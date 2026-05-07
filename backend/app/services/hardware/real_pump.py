import logging

logger = logging.getLogger(__name__)


class RealPump:
    """Servo pump via pinpong. Only works with real hardware connected."""

    def __init__(self, pin_number: int) -> None:
        from pinpong.board import Pin, Servo

        self._servo = Servo(Pin(f"D{pin_number}"))
        self._angle: int = 90
        self._dispensed: float = 0.0
        logger.info("Real pump initialized on pin D%d", pin_number)

    def set_angle(self, angle: int) -> None:
        clamped = max(0, min(180, angle))
        self._servo.write_angle(clamped)
        self._angle = clamped

    def get_angle(self) -> int:
        return self._angle

    def get_dispensed(self) -> float:
        return self._dispensed

    def add_dispensed(self, volume_ml: float) -> None:
        self._dispensed += volume_ml
