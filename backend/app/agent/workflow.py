"""LangGraph AI Agent for Funny Effects."""

from functools import lru_cache
from pathlib import Path
from typing import Literal, TypedDict

from langgraph.graph import StateGraph, START, END
from ..presets import get_preset


# 1. Shared state
class GenerationState(TypedDict, total=False):
    preset_id: str
    extra_prompt: str
    mode: Literal["plan", "generate"]
    media_type: str
    final_prompt: str
    route: str
    source_path: str
    output_path: str
    result_path: str


# 2. Validate request and prepare prompt
def validate_request(state: GenerationState) -> dict:

    preset = get_preset(state["preset_id"])

    additional = (
        state.get("extra_prompt") or ""
    ).strip()

    if len(additional) > 500:
        raise ValueError("Additional prompt is too long")

    if state.get("mode") == "generate":
        if not state.get("source_path") or not state.get("output_path"):
            raise ValueError("Input and output paths are required")

    prompt = preset.prompt_template

    if additional:
        prompt += "\nAdditional user instruction: " + additional

    return {
        "media_type": preset.media_type,
        "final_prompt": prompt,
    }


# 3. Decide which model to use
def choose_path(state: GenerationState) -> str:
    return state["media_type"]


# 4. Image-to-Image node
def route_image(state: GenerationState) -> dict:

    if state.get("mode", "plan") == "generate":

        from ..inference import image

        if not image.READY:
            raise RuntimeError("Image model is not ready")

        image.generate_image(
            Path(state["source_path"]),
            state["final_prompt"],
            Path(state["output_path"]),
        )

        return {
            "route": "image_to_image",
            "result_path": state["output_path"],
        }

    return {"route": "image_to_image"}


# 5. Image-to-Video node
def route_video(state: GenerationState) -> dict:

    if state.get("mode", "plan") == "generate":

        from ..inference import video

        if not video.READY:
            raise RuntimeError("Video model is not ready")

        video.generate_video(
            Path(state["source_path"]),
            state["final_prompt"],
            Path(state["output_path"]),
        )

        return {
            "route": "image_to_video",
            "result_path": state["output_path"],
        }

    return {"route": "image_to_video"}


# 6. Build LangGraph
@lru_cache(maxsize=1)
def get_graph():

    builder = StateGraph(GenerationState)

    builder.add_node("validate", validate_request)
    builder.add_node("image", route_image)
    builder.add_node("video", route_video)

    builder.add_edge(START, "validate")

    builder.add_conditional_edges(
        "validate",
        choose_path,
        {
            "image_to_image": "image",
            "image_to_video": "video",
        },
    )

    builder.add_edge("image", END)
    builder.add_edge("video", END)

    return builder.compile()


# 7. Plan request without loading models
def plan_generation(
    preset_id: str,
    extra_prompt: str = "",
) -> GenerationState:

    return get_graph().invoke({
        "mode": "plan",
        "preset_id": preset_id,
        "extra_prompt": extra_prompt,
    })


# 8. Execute actual generation
def execute_generation(
    preset_id: str,
    source: Path,
    output: Path,
    extra_prompt: str = "",
) -> GenerationState:

    return get_graph().invoke({
        "mode": "generate",
        "preset_id": preset_id,
        "extra_prompt": extra_prompt,
        "source_path": str(source),
        "output_path": str(output),
    })