from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum


class MessageType(str, Enum):
    SENSOR_DATA = "sensor_data"
    MOTOR_POSITION = "motor_position"
    TITRATION_STATUS = "titration_status"
    TITRATION_DATA_POINT = "titration_data_point"
    ENDPOINT_DETECTED = "endpoint_detected"
    ERROR = "error"
    COMMAND = "command"


@dataclass(frozen=True)
class WsMessage:
    type: MessageType
    payload: dict
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())

    def to_dict(self) -> dict:
        return {
            "type": self.type.value,
            "payload": self.payload,
            "timestamp": self.timestamp,
        }
