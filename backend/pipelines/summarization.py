from __future__ import annotations

import os
import textwrap

from langchain.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

class SummarizationError(Exception):
    pass


def summarize_transcript(transcript: str, max_sentences: int = 5) -> str:
    cleaned = transcript.strip()
    if not cleaned:
        raise SummarizationError("Transcript is empty")

    if os.getenv("MOCK_SUMMARY", "0") == "1":
        return textwrap.shorten(cleaned, width=500, placeholder="...")

    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise SummarizationError("GEMINI_API_KEY is required for summarization")

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "You are a meeting assistant. Return a concise summary limited to {max_sentences} sentences.",
            ),
            (
                "human",
                "Transcript:\n{transcript}\n\nReturn only the summary text.",
            ),
        ]
    )
    llm = ChatGoogleGenerativeAI(
        model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
        temperature=0.2,
        google_api_key=api_key,
        convert_system_message_to_human=True,
    )

    messages = prompt.format_messages(
        transcript=cleaned, max_sentences=max_sentences
    )
    response = llm.invoke(messages)
    content = getattr(response, "content", None) or ""
    if not content:
        raise SummarizationError("Gemini returned an empty summary")
    return content.strip()
