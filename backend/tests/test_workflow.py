import pytest
from backend.app.agent.workflow import plan_generation
from backend.app.jobs import capabilities


def test_image_route():
    result = plan_generation("example-funny-portrait")
    assert result["route"] == "image_to_image"
    assert "portrait" in result["final_prompt"].lower()


def test_video_route():
    result = plan_generation("example-playful-motion", "Smile gently")
    assert result["route"] == "image_to_video"
    assert "Smile gently" in result["final_prompt"]


def test_unknown_preset():
    with pytest.raises(ValueError):
        plan_generation("does-not-exist")


def test_models_not_falsely_marked_ready():
    assert capabilities() == {"image_to_image": False, "image_to_video": False}
