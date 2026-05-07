from dataclasses import dataclass

from ...config import Settings
from .mock_motor import MockMotor
from .mock_pump import MockPump
from .mock_sensor import MockSensor
from .protocols import MotorProtocol, PumpProtocol, SensorProtocol


@dataclass(frozen=True)
class HardwareBundle:
    sensor: SensorProtocol
    pumps: dict[str, PumpProtocol]
    motor: MotorProtocol


def create_hardware(config: Settings) -> HardwareBundle:
    if config.hardware_mode == "real":
        from .real_motor import RealMotor
        from .real_pump import RealPump
        from .real_sensor import RealSensor

        return HardwareBundle(
            sensor=RealSensor(config),
            pumps={
                "acid": RealPump(config.pin_acid_pump),
                "alkali": RealPump(config.pin_alkali_pump),
                "test": RealPump(config.pin_test_pump),
            },
            motor=RealMotor(config),
        )

    return HardwareBundle(
        sensor=MockSensor(),
        pumps={
            "acid": MockPump(),
            "alkali": MockPump(),
            "test": MockPump(),
        },
        motor=MockMotor(
            min_cm=config.distance_min,
            max_cm=config.distance_max,
        ),
    )
