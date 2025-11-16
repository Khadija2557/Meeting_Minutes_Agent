from __future__ import annotations

import json
import os
import re
from dataclasses import asdict, dataclass
from typing import List

from langchain.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI


class ActionExtractionError(Exception):
    pass


@dataclass
class ActionItemRecord:
    description: str
    owner: str | None = None
    due_date: str | None = None
    status: str = "pending"


def _rule_based_items(text: str) -> List[ActionItemRecord]:
    candidates: List[ActionItemRecord] = []
    pattern = re.compile(
        r"(?:ACTION|TODO)[:\-]\s*(?P<description>[^@\n]+?)(?:\s*@(?P<owner>[\w\s]+))?(?:\s*\(due\s*(?P<due>[^)]+)\))?",
        re.IGNORECASE,
    )
    for match in pattern.finditer(text):
        candidates.append(
            ActionItemRecord(
                description=match.group("description").strip(),
                owner=(match.group("owner") or "").strip() or None,
                due_date=(match.group("due") or "").strip() or None,
            )
        )
    if not candidates and text:
        sentences = re.split(r"[\n\.]+", text)
        for sentence in sentences:
            if "will" in sentence.lower() or "needs to" in sentence.lower():
                candidates.append(ActionItemRecord(description=sentence.strip()))
    return candidates


def _gemini_items(text: str) -> List[ActionItemRecord]:  # pragma: no cover - network call
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise ActionExtractionError("GEMINI_API_KEY is required for action extraction")
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "Extract actionable tasks from the meeting transcript. Return valid JSON array where each entry has description, owner, due_date (ISO8601 or null), and status.",
            ),
            (
                "human",
                "Transcript:\n{transcript}\n\nDo not add commentary. Return only JSON.",
            ),
        ]
    )
    llm = ChatGoogleGenerativeAI(
        model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
        temperature=0,
        google_api_key=api_key,
        convert_system_message_to_human=True,
    )
    messages = prompt.format_messages(transcript=text)
    response = llm.invoke(messages)
    raw_text = getattr(response, "content", "") or ""
    payload = _parse_json_array(raw_text)
    items: List[ActionItemRecord] = []
    for entry in payload:
        if not isinstance(entry, dict):
            continue
        description = (entry.get("description") or "").strip()
        if not description:
            continue
        items.append(
            ActionItemRecord(
                description=description,
                owner=(entry.get("owner") or None),
                due_date=(entry.get("due_date") or None),
                status=(entry.get("status") or "pending") or "pending",
            )
        )
    return items


def extract_action_items(transcript: str, summary: str | None = None) -> List[dict]:
    combined = "\n".join(filter(None, [summary or "", transcript or ""]))
    cleaned = combined.strip()
    if not cleaned:
        raise ActionExtractionError("Transcript or summary is required for action extraction")

    if os.getenv("MOCK_ACTION_ITEMS", "0") == "1":
        items = _rule_based_items(cleaned)
    else:
        try:
            items = _gemini_items(cleaned)
        except ActionExtractionError:
            items = _rule_based_items(cleaned)

    return [asdict(item) for item in items]


def _parse_json_array(value: str) -> List[dict]:
    stripped = value.strip()
    if not stripped:
        return []
    if stripped.startswith("```"):
        stripped = re.sub(r"```(?:json)?", "", stripped).strip("`\n ")
    try:
        data = json.loads(stripped)
    except json.JSONDecodeError:
        return []
    if isinstance(data, dict) and "items" in data:
        return data.get("items") or []
    return data if isinstance(data, list) else []
