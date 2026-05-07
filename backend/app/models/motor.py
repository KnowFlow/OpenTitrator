from dataclasses import dataclass


@dataclass(frozen=True)
class MotorState:
    position_cm: float
    target_cm: float | None
    moving: bool
