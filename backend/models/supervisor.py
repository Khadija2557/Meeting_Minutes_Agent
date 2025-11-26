"""
Pydantic models for Supervisor Agent integration.
These match the contract defined in the Supervisor Integration Agent repository.
"""
from __future__ import annotations

from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class AgentInput(BaseModel):
    """Input structure from Supervisor to worker agent."""
    text: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


class AgentContext(BaseModel):
    """Context information from Supervisor."""
    user_id: Optional[str] = None
    conversation_id: Optional[str] = None
    timestamp: Optional[str] = None


class SupervisorAgentRequest(BaseModel):
    """
    Incoming request from Supervisor Agent to worker agent.
    This is the standardized handshake format.
    """
    request_id: str
    agent_name: str
    intent: str
    input: AgentInput
    context: AgentContext


class ErrorModel(BaseModel):
    """Error details returned to Supervisor."""
    type: str
    message: str


class OutputModel(BaseModel):
    """Success output returned to Supervisor."""
    result: Any
    confidence: Optional[float] = None
    details: Optional[str] = None


class SupervisorAgentResponse(BaseModel):
    """
    Response from worker agent back to Supervisor.
    Either output or error should be populated (mutually exclusive).
    """
    request_id: str
    agent_name: str
    status: str  # "success" or "error"
    output: Optional[OutputModel] = None
    error: Optional[ErrorModel] = None
