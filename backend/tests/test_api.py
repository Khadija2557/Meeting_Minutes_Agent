from backend.database import SessionLocal
from backend.models import Meeting


def test_create_and_fetch_meeting(client):
    response = client.post(
        "/meetings",
        json={
            "title": "Design Review",
            "transcript": "ACTION: Update spec @Nora (due 2023-11-30)",
            "source_agent": "dashboard",
        },
    )
    assert response.status_code == 201
    meeting_id = response.json["meeting_id"]

    fetch_response = client.get(f"/meetings/{meeting_id}")
    assert fetch_response.status_code == 200
    payload = fetch_response.json
    assert payload["summary"]
    assert payload["action_items"]


def test_followup_endpoint(client):
    response = client.post(
        "/agents/meeting-followup",
        json={
            "transcript": "ACTION: Prepare budget @Liam (due 2023-12-15)",
            "metadata": {"source": "integration-test"},
        },
    )
    assert response.status_code == 200
    data = response.json
    assert data["summary"]
    assert len(data["action_items"]) == 1
