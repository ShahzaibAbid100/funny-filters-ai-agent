"""Local LTX-Video 2B 0.9.8 distilled image-to-video adapter.

Public contract (used by LangGraph): READY, generate_video(source, prompt, output).
READY means local *files* exist. Original 2B safetensors -> Diffusers conversion,
reused FLUX T5, and real I2V quality are not validated without inference.
"""
from functools import lru_cache
from pathlib import Path
import os

PROJECT_ROOT = Path(__file__).resolve().parents[3]
MODEL_DIR = PROJECT_ROOT / "models" / "ltx_video"
MODEL_FILE = MODEL_DIR / "ltxv-2b-0.9.8-distilled.safetensors"
PIPELINE_DIR = MODEL_DIR / "pipeline"


def model_files_available() -> bool:
    required = [
        MODEL_FILE,
        PIPELINE_DIR / "model_index.json",
        PIPELINE_DIR / "transformer" / "config.json",
        PIPELINE_DIR / "vae" / "config.json",
        PIPELINE_DIR / "text_encoder" / "config.json",
        PIPELINE_DIR / "tokenizer" / "tokenizer_config.json",
    ]
    if not all(path.is_file() for path in required):
        return False
    return (
        any((PIPELINE_DIR / "vae").glob("*.safetensors"))
        and any((PIPELINE_DIR / "text_encoder").rglob("*.safetensors"))
    )


# Files-only flag; no GPU check and no inference test performed here.
READY = model_files_available() and os.getenv("ENABLE_REAL_INFERENCE", "0") == "1"


@lru_cache(maxsize=1)
def load_pipeline():
    if not READY:
        raise RuntimeError("Real inference is disabled.")

    if not model_files_available():
        raise RuntimeError("LTX checkpoint or local supporting components are missing")

    import torch
    from diffusers import LTXImageToVideoPipeline, LTXVideoTransformer3DModel

    if not torch.cuda.is_available():
        raise RuntimeError(
            "GPU inference unavailable: CUDA-enabled PyTorch and a compatible "
            "NVIDIA GPU are required."
        )

    print("[LTX] Converting/loading original 2B checkpoint...", flush=True)
    transformer = LTXVideoTransformer3DModel.from_single_file(
        str(MODEL_FILE),
        config=str(PIPELINE_DIR),
        subfolder="transformer",
        dtype=torch.bfloat16,
        local_files_only=True,
    )

    print("[LTX] Loading remaining local I2V components...", flush=True)
    # Explicit image-to-video class: the upstream model_index declares LTXPipeline
    # (text-to-video); do not instantiate that class for image conditioning.
    pipe = LTXImageToVideoPipeline.from_pretrained(
        str(PIPELINE_DIR),
        transformer=transformer,
        dtype=torch.bfloat16,
        local_files_only=True,
    )
    pipe.enable_model_cpu_offload()
    if hasattr(pipe.vae, "enable_tiling"):
        pipe.vae.enable_tiling()
    return pipe


def generate_video(source: Path, prompt: str, output: Path) -> None:
    import torch
    from PIL import Image, ImageOps
    from diffusers.utils import export_to_video

    source, output = Path(source), Path(output)
    if not source.is_file():
        raise FileNotFoundError(f"Input image missing: {source}")
    if not prompt.strip():
        raise ValueError("Video prompt must not be empty")

    with Image.open(source) as opened:
        conditioned_image = ImageOps.fit(
            ImageOps.exif_transpose(opened).convert("RGB"),
            (704, 480),
        )

    pipe = load_pipeline()
    print("[LTX] Generating frames...", flush=True)
    with torch.inference_mode():
        result = pipe(
            image=conditioned_image,
            prompt=prompt,
            width=704,
            height=480,
            num_frames=49,
            timesteps=[1000, 993, 987, 981, 975, 909, 725, 0.03],
            guidance_scale=1.0,
            decode_timestep=0.05,
            decode_noise_scale=0.025,
            output_type="pil",
        )

    output.parent.mkdir(parents=True, exist_ok=True)
    export_to_video(result.frames[0], str(output), fps=24)
    if not output.is_file() or output.stat().st_size == 0:
        raise RuntimeError("LTX did not create a valid MP4 file")
