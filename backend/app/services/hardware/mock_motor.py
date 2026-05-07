import asyncio
import time

from .protocols import MotorProtocol


class MockMotor(MotorProtocol):
    def __init__(self, min_cm: float = 2.0, max_cm: float = 19.0, speed: float = 2.0) -> None:
        self._min_cm = min_cm
        self._max_cm = max_cm
        self._speed = speed
        self._position: float = 10.0
        self._target: float | None = None
        self._moving: bool = False
        self._task: asyncio.Task | None = None

    def move_to(self, target_cm: float) -> None:
        clamped = max(self._min_cm, min(self._max_cm, target_cm))
        self._target = clamped
        self._moving = True

    def get_position(self) -> float:
        if self._target is not None and self._moving:
            diff = self._target - self._position
            step = min(abs(diff), self._speed * 0.1)
            if diff > 0:
                self._position += step
            elif diff < 0:
                self._position -= step
            if abs(self._target - self._position) < 0.1:
                self._position = self._target
                self._moving = False
        return round(self._position, 2)

    def stop(self) -> None:
        self._moving = False
        self._target = None

    def is_moving(self) -> bool:
        return self._moving
