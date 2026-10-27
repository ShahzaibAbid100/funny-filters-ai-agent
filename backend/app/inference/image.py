"""Local FLUX.1 Kontext Dev image-to-image inference.

Public contract (used by LangGraph): READY, generate_image(source, prompt, output).
READY means required *files* are present, not that a real GPU generation passed.
"""
from functools import lru_cache
from pathlib import Path
import os

PROJECT_ROOT = Path(__file__).resolve().parents[3]
MODEL_DIR = PROJECT_ROOT / "models" / "flux_kontext"


def model_files_available() -> bool:
    required = [
        MODEL_DIR / "model_index.json",
        MODEL_DIR / "transformer" / "config.json",
        MODEL_DIR / "vae" / "config.json",
        MODEL_DIR / "text_encoder_2" / "config.json",
    ]
    if not all(path.is_file() for path in required):
        return False
    for folder in ("transformer", "vae", "text_encoder_2"):
        if not any((MODEL_DIR / folder).rglob("*.safetensors")):
            return False
    return True


# Files-only flag, deliberately does not probe GPU.
READY = model_files_available() and os.getenv("ENABLE_REAL_INFERENCE", "0") == "1"


@lru_cache(maxsize=1)
def load_pipeline():
    if not READY:
        raise RuntimeError("Real inference is disabled.")

    if not model_files_available():
        raise RuntimeError(f"FLUX Kontext model files incomplete: {MODEL_DIR}")

    import torch
    from diffusers import FluxKontextPipeline

    if not torch.cuda.is_available():
        raise RuntimeError(
            "GPU inference unavailable: this Python environment needs CUDA-enabled "
            "PyTorch and a compatible NVIDIA GPU."
        )

    print("[FLUX] Loading local Kontext pipeline (large model)...", flush=True)
    pipe = FluxKontextPipeline.from_pretrained(
        str(MODEL_DIR),
        dtype=torch.bfloat16,
        local_files_only=True,
    )
    pipe.enable_model_cpu_offload()
    if hasattr(pipe.vae, "enable_tiling"):
        pipe.vae.enable_tiling()
    return pipe


def generate_image(source: Path, prompt: str, output: Path) -> None:
    import torch
    from PIL import Image, ImageOps

    source, output = Path(source), Path(output)
    if not source.is_file():
        raise FileNotFoundError(f"Input image missing: {source}")
    if not prompt.strip():
        raise ValueError("Image prompt must not be empty")

    with Image.open(source) as opened:
        input_image = ImageOps.exif_transpose(opened).convert("RGB")
        input_image.thumbnail((1024, 1024))
        input_image = input_image.copy()

    pipe = load_pipeline()
    print("[FLUX] Generating image...", flush=True)
    with torch.inference_mode():
        generated = pipe(
            image=input_image,
            prompt=prompt,
            guidance_scale=2.5,
            num_inference_steps=28,
        ).images[0]

    output.parent.mkdir(parents=True, exist_ok=True)
    generated.save(output, format="PNG")
    if not output.is_file() or output.stat().st_size == 0:
        raise RuntimeError("FLUX did not create a valid PNG file")
