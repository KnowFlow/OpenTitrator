from fastapi import APIRouter, Request

from ..models.experiment import Experiment
from ..services.export.csv_export import generate_csv
from ..services.export.pdf_export import generate_pdf
from ..services.storage.experiments import (
    delete_experiment,
    get_experiment,
    list_experiments,
    save_experiment,
)

router = APIRouter(prefix="/api/experiment", tags=["experiment"])


@router.get("/")
async def get_experiments(request: Request, limit: int = 50, offset: int = 0) -> dict:
    db = request.app.state.db
    items = await list_experiments(db, limit, offset)
    return {
        "experiments": [
            {"id": e.id, "name": e.name, "created_at": e.created_at, "status": e.status, "step_count": e.step_count}
            for e in items
        ]
    }


@router.get("/{experiment_id}")
async def get_experiment_detail(experiment_id: str, request: Request) -> dict:
    db = request.app.state.db
    exp = await get_experiment(db, experiment_id)
    if not exp:
        return {"error": "Experiment not found"}
    return {
        "id": exp.id,
        "name": exp.name,
        "created_at": exp.created_at,
        "status": exp.status,
        "steps": [
            {"volume_ml": s.volume_ml, "reading": s.reading, "timestamp": s.timestamp}
            for s in exp.steps
        ],
        "notes": exp.notes,
    }


@router.delete("/{experiment_id}")
async def delete_experiment_endpoint(experiment_id: str, request: Request) -> dict:
    db = request.app.state.db
    deleted = await delete_experiment(db, experiment_id)
    return {"deleted": deleted}
