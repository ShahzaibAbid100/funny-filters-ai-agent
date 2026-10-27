import json
from functools import lru_cache
from pydantic import TypeAdapter
from .config import CONFIG_DIR
from .schemas import Preset


@lru_cache(maxsize=1)
def load_presets() -> list[Preset]:
    source = CONFIG_DIR / "presets.json"
    raw = json.loads(source.read_text(encoding="utf-8"))
    presets = TypeAdapter(list[Preset]).validate_python(raw)
    if len({p.id for p in presets}) != len(presets):
        raise ValueError("Duplicate preset IDs in config/presets.json")
    return presets


def get_preset(preset_id: str) -> Preset:
    for preset in load_presets():
        if preset.id == preset_id:
            return preset
    raise ValueError(f"Unknown preset: {preset_id}")
