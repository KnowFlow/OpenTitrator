import aiosqlite
import logging

logger = logging.getLogger(__name__)

_SCHEMA = """
CREATE TABLE IF NOT EXISTS experiments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    config_json TEXT,
    status TEXT NOT NULL DEFAULT 'running',
    endpoint_volume REAL,
    endpoint_reading REAL,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    experiment_id TEXT NOT NULL REFERENCES experiments(id),
    volume_ml REAL NOT NULL,
    reading REAL NOT NULL,
    timestamp TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sensor_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    distance_cm REAL NOT NULL,
    temperature_c REAL NOT NULL,
    timestamp TEXT NOT NULL
);
"""


async def init_db(db_path: str) -> aiosqlite.Connection:
    import os
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    db = await aiosqlite.connect(db_path)
    db.row_factory = aiosqlite.Row
    await db.executescript(_SCHEMA)
    await db.commit()
    logger.info("Database initialized: %s", db_path)
    return db
