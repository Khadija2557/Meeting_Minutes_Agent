from __future__ import annotations

from datetime import datetime
from typing import List

from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

try:
    from backend.database import Base
except ModuleNotFoundError:
    from database import Base


class Meeting(Base):
    __tablename__ = "meetings"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    audio_url = Column(String(1024), nullable=True)
    transcript = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    status = Column(String(50), default="pending", nullable=False)
    source_agent = Column(String(255), nullable=True)

    action_items: List["ActionItem"] = relationship(
        "ActionItem", back_populates="meeting", cascade="all, delete-orphan"
    )


class ActionItem(Base):
    __tablename__ = "action_items"
    __allow_unmapped__ = True

    id = Column(Integer, primary_key=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False, index=True)
    description = Column(Text, nullable=False)
    owner = Column(String(255), nullable=True)
    due_date = Column(Date, nullable=True)
    status = Column(String(50), default="pending", nullable=False)

    meeting = relationship("Meeting", back_populates="action_items")
