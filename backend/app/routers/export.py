from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from ..services.export.csv_export import generate_csv
from ..services.export.pdf_export import generate_pdf
from ..services.storage.experiments import get_experiment

router = APIRouter(prefix="/api/export", tags=["export"])


@router.get("/csv/{experiment_id}")
async def export_csv(experiment_id: str, request: Request) -> StreamingResponse:
    db = request.app.state.db
    exp = await get_experiment(db, experiment_id)
    if not exp:
        return StreamingResponse(iter(["Experiment not found"]), media_type="text/plain", status_code=404)
    csv_data = generate_csv(exp)
    return StreamingResponse(
        iter([csv_data]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=experiment_{experiment_id}.csv"},
    )


@router.get("/pdf/{experiment_id}")
async def export_pdf(experiment_id: str, request: Request) -> StreamingResponse:
    db = request.app.state.db
    exp = await get_experiment(db, experiment_id)
    if not exp:
        return StreamingResponse(iter(["Experiment not found"]), media_type="text/plain", status_code=404)
    pdf_data = generate_pdf(exp)
    return StreamingResponse(
        iter([pdf_data]),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=experiment_{experiment_id}.pdf"},
    )
