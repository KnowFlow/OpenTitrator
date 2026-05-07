from fastapi import APIRouter, Request

from ..models.sensor import SensorReading

router = APIRouter(prefix="/api/sensor", tags=["sensor"])


@router.get("/latest")
async def get_latest_reading(request: Request) -> dict:
    hardware = request.app.state.hardware
    distance, temperature = hardware.sensor.read()
    reading = SensorReading(distance_cm=distance, temperature_c=temperature)
    return reading.__dict__


@router.get("/history")
async def get_history(limit: int = 100) -> dict:
    return {"readings": [], "count": 0}
