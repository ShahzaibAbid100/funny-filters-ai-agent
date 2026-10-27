from typing import Literal
from pydantic import BaseModel, Field

MediaType = Literal["image_to_image", "image_to_video"]


class Preset(BaseModel):
    id: str
    name: str
    description: str
    media_type: MediaType
    prompt_template: str
    is_sample: bool = True


class PlanRequest(BaseModel):
    preset_id: str
    extra_prompt: str = Field(default="", max_length=500)


class GenerationRequest(PlanRequest):
    image_id: str
