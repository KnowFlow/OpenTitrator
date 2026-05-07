from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "OpenTitrator"
    hardware_mode: str = "mock"
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
    ]

    urm09_i2c_addr: int = 0x11
    distance_min: float = 2.0
    distance_max: float = 19.0
    position_tolerance: float = 0.5
    sensor_read_interval: float = 0.5
    servo_step_delay: float = 2.0
    move_max_iterations: int = 1000

    pin_pwm_down: int = 8
    pin_pwm_up: int = 9
    pin_acid_pump: int = 11
    pin_alkali_pump: int = 12
    pin_test_pump: int = 13

    database_path: str = "data/opentitrator.db"

    model_config = {"env_prefix": "OT_"}
