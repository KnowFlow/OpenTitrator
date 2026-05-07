import logging

from ...config import Settings

logger = logging.getLogger(__name__)


class RealSensor:
    """URM09 sensor via pinpong. Only works with real hardware connected."""

    def __init__(self, config: Settings) -> None:
        from pinpong.board import Board
        from pinpong.libs.dfrobot_urm09 import URM09

        Board("leonardo").begin()
        self._urm = URM09(i2c_addr=config.urm09_i2c_addr)
        self._urm.set_mode_range(
            URM09._MEASURE_MODE_AUTOMATIC,
            URM09._MEASURE_RANG_500,
        )
        logger.info("Real sensor initialized")

    def read(self) -> tuple[float, float]:
        distance = float(self._urm.distance_cm())
        temperature = float(self._urm.temp_c())
        return (round(distance, 2), round(temperature, 2))
