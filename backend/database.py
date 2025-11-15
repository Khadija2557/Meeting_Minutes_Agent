from __future__ import annotations

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker, declarative_base

Base = declarative_base()
_engine = None
SessionLocal = scoped_session(sessionmaker(autoflush=False, autocommit=False))


def init_engine(database_url: str, echo: bool = False, force: bool = False):
    global _engine

    if _engine is not None and not force:
        return _engine

    if _engine is not None and force:
        SessionLocal.remove()
        _engine.dispose()

    _engine = create_engine(database_url, echo=echo, future=True)
    SessionLocal.configure(bind=_engine)
    return _engine


def init_db() -> None:
    if _engine is None:
        raise RuntimeError("Database engine is not initialized. Call init_engine first.")
    Base.metadata.create_all(bind=_engine)


def get_session():
    return SessionLocal()
