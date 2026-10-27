"""Standalone real inference runner; does not use mocks or require FastAPI.

Examples (run from D:\\Funny):
  .\\.venv\\Scripts\\python.exe -m backend.phase1_run --check
  .\\.venv\\Scripts\\python.exe -m backend.phase1_run --mode image --image .\\data\\sample_input.png
  .\\.venv\\Scripts\\python.exe -m backend.phase1_run --mode video --image .\\data\\sample_input.png
"""
import argparse
from pathlib import Path
import sys
import traceback

from backend.app.inference import image, video
from backend.app.config import DATA_DIR, OUTPUT_DIR


def make_sample(path: Path) -> None:
    """Make a simple synthetic test input, not a model-generated portrait."""
    from PIL import Image, ImageDraw

    path.parent.mkdir(parents=True, exist_ok=True)
    canvas = Image.new("RGB", (704, 512), (194, 217, 235))
    pen = ImageDraw.Draw(canvas)
    pen.ellipse((215, 48, 489, 330), fill=(239, 189, 144))
    pen.ellipse((280, 165, 310, 190), fill=(55, 40, 45))
    pen.ellipse((395, 165, 425, 190), fill=(55, 40, 45))
    pen.arc((310, 200, 396, 274), start=5, end=175, fill=(120, 43, 49), width=8)
    pen.rounded_rectangle((140, 345, 564, 580), radius=120, fill=(44, 95, 151))
    canvas.save(path, format="PNG")
    print(f"[SAMPLE] Created synthetic test image: {path}")


def run() -> int:
    parser = argparse.ArgumentParser(description="Phase 1: FLUX/LTX real inference")
    parser.add_argument("--check", action="store_true", help="Verify paths only; no GPU usage")
    parser.add_argument("--mode", choices=["image", "video"], default="image")
    parser.add_argument("--image", type=Path, help="Input PNG/JPG/WEBP path")
    parser.add_argument("--prompt", default=None, help="Custom generation instruction")
    parser.add_argument("--output", type=Path, default=None, help="Output PNG or MP4 path")
    parser.add_argument("--sample", action="store_true", help="Create/use a synthetic test input")
    args = parser.parse_args()

    print("[STATUS] FLUX files:", image.model_files_available())
    print("[STATUS] LTX files:", video.model_files_available())
    print("[STATUS] Flags above check files only, not model execution.")
    if args.check:
        return 0 if image.model_files_available() and video.model_files_available() else 2

    source = args.image or DATA_DIR / "sample_input.png"
    if args.sample and not source.is_file():
        make_sample(source)
    if not source.is_file():
        parser.error(f"Input missing: {source}. Supply --image or use --sample.")

    is_image = args.mode == "image"
    prompt = args.prompt or (
        "Edit this portrait into a funny surprised reaction photo, keeping the same face identity."
        if is_image else
        "The person gives an exaggerated surprised reaction and gently waves at the camera, steady view."
    )
    output = args.output or (OUTPUT_DIR / ("phase1_flux.png" if is_image else "phase1_ltx.mp4"))
    if output.suffix.lower() != (".png" if is_image else ".mp4"):
        parser.error("Output extension must be .png for image mode or .mp4 for video mode")

    print(f"[START] {args.mode.upper()} generation using local model weights")
    print("[INPUT]", source)
    print("[OUTPUT]", output)
    try:
        if is_image:
            image.generate_image(source, prompt, output)
        else:
            video.generate_video(source, prompt, output)
    except Exception as error:
        print(f"[FAILED] {type(error).__name__}: {error}", file=sys.stderr)
        traceback.print_exc()
        return 1
    print(f"[SUCCESS] Real model output saved to: {output} ({output.stat().st_size:,} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(run())
