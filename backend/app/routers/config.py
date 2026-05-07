from fastapi import APIRouter, Request

router = APIRouter(prefix="/api/config", tags=["config"])


@router.get("/")
async def get_config(request: Request) -> dict:
    settings = request.app.state.settings
    return {
        "hardware_mode": settings.hardware_mode,
        "sensor_read_interval": settings.sensor_read_interval,
        "distance_min": settings.distance_min,
        "distance_max": settings.distance_max,
        "position_tolerance": settings.position_tolerance,
        "database_path": settings.database_path,
    }
