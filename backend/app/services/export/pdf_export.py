from io import BytesIO

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from ...models.experiment import Experiment


def generate_pdf(experiment: Experiment) -> bytes:
    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    w, h = A4

    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, h - 50, f"Experiment: {experiment.name}")
    c.setFont("Helvetica", 10)
    c.drawString(50, h - 70, f"ID: {experiment.id}")
    c.drawString(50, h - 85, f"Created: {experiment.created_at}")
    c.drawString(50, h - 100, f"Status: {experiment.status}")

    y = h - 130
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, y, "Volume (mL)")
    c.drawString(150, y, "Reading")
    c.drawString(250, y, "Timestamp")
    c.setFont("Helvetica", 9)

    for step in experiment.steps:
        y -= 15
        if y < 50:
            c.showPage()
            y = h - 50
            c.setFont("Helvetica", 9)
        c.drawString(50, y, f"{step.volume_ml:.2f}")
        c.drawString(150, y, f"{step.reading:.2f}")
        c.drawString(250, y, step.timestamp)

    c.save()
    return buf.getvalue()
