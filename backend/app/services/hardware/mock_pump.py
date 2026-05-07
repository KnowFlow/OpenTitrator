from .protocols import PumpProtocol


class MockPump(PumpProtocol):
    def __init__(self) -> None:
        self._angle: int = 90
        self._dispensed: float = 0.0

    def set_angle(self, angle: int) -> None:
        clamped = max(0, min(180, angle))
        self._angle = clamped

    def get_angle(self) -> int:
        return self._angle

    def get_dispensed(self) -> float:
        return self._dispensed

    def add_dispensed(self, volume_ml: float) -> None:
        self._dispensed += volume_ml
