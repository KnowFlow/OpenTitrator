import json
import aiosqlite

from ...models.experiment import Experiment, ExperimentListItem
from ...models.titration import TitrationStep


async def save_experiment(
    db: aiosqlite.Connection,
    experiment: Experiment,
) -> None:
    config_json = json.dumps(experiment.config.__dict__) if experiment.config else None
    await db.execute(
        "INSERT OR REPLACE INTO experiments (id, name, created_at, config_json, status, notes) VALUES (?, ?, ?, ?, ?, ?)",
        (experiment.id, experiment.name, experiment.created_at, config_json, experiment.status, experiment.notes),
    )
    for step in experiment.steps:
        await db.execute(
            "INSERT INTO readings (experiment_id, volume_ml, reading, timestamp) VALUES (?, ?, ?, ?)",
            (experiment.id, step.volume_ml, step.reading, step.timestamp),
        )
    await db.commit()


async def list_experiments(
    db: aiosqlite.Connection,
    limit: int = 50,
    offset: int = 0,
) -> list[ExperimentListItem]:
    cursor = await db.execute(
        "SELECT e.id, e.name, e.created_at, e.status, COUNT(r.id) as step_count "
        "FROM experiments e LEFT JOIN readings r ON e.id = r.experiment_id "
        "GROUP BY e.id ORDER BY e.created_at DESC LIMIT ? OFFSET ?",
        (limit, offset),
    )
    rows = await cursor.fetchall()
    return [
        ExperimentListItem(
            id=row["id"],
            name=row["name"],
            created_at=row["created_at"],
            status=row["status"],
            step_count=row["step_count"],
        )
        for row in rows
    ]


async def get_experiment(
    db: aiosqlite.Connection,
    experiment_id: str,
) -> Experiment | None:
    cursor = await db.execute(
        "SELECT * FROM experiments WHERE id = ?", (experiment_id,)
    )
    row = await cursor.fetchone()
    if not row:
        return None

    cursor2 = await db.execute(
        "SELECT volume_ml, reading, timestamp FROM readings WHERE experiment_id = ? ORDER BY volume_ml",
        (experiment_id,),
    )
    reading_rows = await cursor2.fetchall()
    steps = tuple(
        TitrationStep(
            volume_ml=r["volume_ml"],
            reading=r["reading"],
            timestamp=r["timestamp"],
        )
        for r in reading_rows
    )

    return Experiment(
        id=row["id"],
        name=row["name"],
        created_at=row["created_at"],
        status=row["status"],
        steps=steps,
        notes=row["notes"] or "",
    )


async def delete_experiment(
    db: aiosqlite.Connection,
    experiment_id: str,
) -> bool:
    await db.execute("DELETE FROM readings WHERE experiment_id = ?", (experiment_id,))
    cursor = await db.execute("DELETE FROM experiments WHERE id = ?", (experiment_id,))
    await db.commit()
    return cursor.rowcount > 0
