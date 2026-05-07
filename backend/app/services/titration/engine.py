import asyncio
import logging
import uuid
from datetime import datetime

from ...models.titration import (
    EndpointResult,
    TitrationConfig,
    TitrationState,
    TitrationStatus,
    TitrationStep,
)
from ..hardware.protocols import PumpProtocol, SensorProtocol
from .endpoint import find_endpoint

logger = logging.getLogger(__name__)


class TitrationEngine:
    def __init__(self, sensor: SensorProtocol, ws_manager: object) -> None:
        self._sensor = sensor
        self._ws_manager = ws_manager
        self._state = TitrationState.IDLE
        self._config: TitrationConfig | None = None
        self._steps: list[TitrationStep] = []
        self._current_volume: float = 0.0
        self._task: asyncio.Task | None = None
        self._experiment_id: str = ""

    @property
    def state(self) -> TitrationState:
        return self._state

    def get_status(self) -> TitrationStatus:
        return TitrationStatus(
            state=self._state,
            current_volume=self._current_volume,
            step_count=len(self._steps),
            total_steps=(
                int(self._config.max_volume_ml / self._config.step_volume_ml)
                if self._config
                else 0
            ),
        )

    async def start(self, config: TitrationConfig) -> None:
        if self._state != TitrationState.IDLE:
            raise ValueError(f"Cannot start titration in state {self._state.value}")
        self._config = config
        self._steps = []
        self._current_volume = 0.0
        self._experiment_id = str(uuid.uuid4())[:8]
        self._state = TitrationState.TITRATING
        self._task = asyncio.create_task(self._run_titration())
        logger.info("Titration started: %s", self._experiment_id)

    async def stop(self) -> None:
        if self._task and not self._task.done():
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        self._state = TitrationState.IDLE
        self._task = None
        logger.info("Titration stopped")

    async def _run_titration(self) -> None:
        assert self._config is not None
        pump_key = self._config.pump_id.value
        try:
            while self._current_volume < self._config.max_volume_ml:
                self._current_volume += self._config.step_volume_ml
                distance, _ = self._sensor.read()

                step = TitrationStep(
                    volume_ml=round(self._current_volume, 2),
                    reading=distance,
                )
                self._steps.append(step)

                from ...ws.messages import MessageType, WsMessage
                msg = WsMessage(
                    type=MessageType.TITRATION_DATA_POINT,
                    payload={"volume_ml": step.volume_ml, "reading": step.reading},
                )
                await self._ws_manager.broadcast(msg)

                volumes = [s.volume_ml for s in self._steps]
                readings = [s.reading for s in self._steps]
                endpoint = find_endpoint(
                    volumes, readings, self._config.endpoint_threshold
                )

                if endpoint is not None and len(self._steps) >= 5:
                    self._state = TitrationState.ENDPOINT_DETECTED
                    endpoint_msg = WsMessage(
                        type=MessageType.ENDPOINT_DETECTED,
                        payload={
                            "volume_ml": endpoint.volume_ml,
                            "reading": endpoint.reading,
                            "first_deriv": endpoint.first_deriv,
                            "second_deriv": endpoint.second_deriv,
                        },
                    )
                    await self._ws_manager.broadcast(endpoint_msg)
                    logger.info("Endpoint detected at %.2f mL", endpoint.volume_ml)
                    break

                await asyncio.sleep(self._config.settling_time_s)

            self._state = TitrationState.COMPLETE
            status_msg = WsMessage(
                type=MessageType.TITRATION_STATUS,
                payload={"state": self._state.value, "step_count": len(self._steps)},
            )
            await self._ws_manager.broadcast(status_msg)

        except asyncio.CancelledError:
            self._state = TitrationState.IDLE
        except Exception as exc:
            logger.error("Titration error: %s", exc)
            self._state = TitrationState.ERROR
