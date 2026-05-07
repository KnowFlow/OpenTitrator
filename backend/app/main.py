import asyncio
import json
import logging

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from .config import Settings
from .routers import config, experiment, export, motor, pump, sensor, titration
from .services.hardware.factory import create_hardware
from .services.storage.database import init_db
from .services.titration.engine import TitrationEngine
from .ws.manager import ConnectionManager
from .ws.messages import MessageType, WsMessage

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    settings = Settings()
    app = FastAPI(title=settings.app_name, version="1.0.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(sensor.router)
    app.include_router(pump.router)
    app.include_router(motor.router)
    app.include_router(titration.router)
    app.include_router(experiment.router)
    app.include_router(export.router)
    app.include_router(config.router)

    ws_manager = ConnectionManager()

    @app.on_event("startup")
    async def startup() -> None:
        hardware = create_hardware(settings)
        app.state.hardware = hardware
        app.state.settings = settings
        app.state.ws_manager = ws_manager
        app.state.db = await init_db(settings.database_path)

        engine = TitrationEngine(hardware.sensor, ws_manager)
        app.state.titration_engine = engine

        app.state._sensor_task = asyncio.create_task(
            _sensor_loop(hardware, ws_manager, settings.sensor_read_interval)
        )
        logger.info("App started in %s mode", settings.hardware_mode)

    @app.on_event("shutdown")
    async def shutdown() -> None:
        task = getattr(app.state, "_sensor_task", None)
        if task:
            task.cancel()
        db = getattr(app.state, "db", None)
        if db:
            await db.close()
        logger.info("App shutdown")

    @app.websocket("/ws")
    async def websocket_endpoint(ws: WebSocket) -> None:
        await ws_manager.connect(ws)
        try:
            while True:
                data = await ws.receive_text()
                try:
                    msg = json.loads(data)
                    if msg.get("type") == "command":
                        await _handle_command(app, msg.get("payload", {}))
                except json.JSONDecodeError:
                    pass
        except WebSocketDisconnect:
            ws_manager.disconnect(ws)

    @app.get("/api/health")
    async def health() -> dict:
        return {
            "status": "ok",
            "hardware_mode": settings.hardware_mode,
            "ws_connections": ws_manager.connection_count,
        }

    return app


async def _sensor_loop(
    hardware: object,
    ws_manager: ConnectionManager,
    interval: float,
) -> None:
    while True:
        try:
            distance, temperature = hardware.sensor.read()
            position = hardware.motor.get_position()
            msg = WsMessage(
                type=MessageType.SENSOR_DATA,
                payload={
                    "distance_cm": distance,
                    "temperature_c": temperature,
                    "position_cm": position,
                },
            )
            await ws_manager.broadcast(msg)
        except Exception as exc:
            logger.error("Sensor loop error: %s", exc)
        await asyncio.sleep(interval)


async def _handle_command(app: FastAPI, payload: dict) -> None:
    action = payload.get("action")
    if action == "emergency_stop":
        app.state.hardware.motor.stop()
        engine = app.state.titration_engine
        if engine.state.value != "idle":
            await engine.stop()


app = create_app()
