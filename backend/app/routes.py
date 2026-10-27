import io
from uuid import uuid4
from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from PIL import Image, ImageOps, UnidentifiedImageError
from .agent.workflow import plan_generation
from .config import MAX_IMAGE_PIXELS, MAX_UPLOAD_BYTES, OUTPUT_DIR, UPLOAD_DIR
from .jobs import capabilities, get_job, start_job
from .presets import load_presets
from .schemas import GenerationRequest, PlanRequest

router = APIRouter(prefix="/api")


@router.get("/health")
def health():
    return {"status": "ok", "inference_ready": capabilities()}


@router.get("/presets")
def presets():
    return [preset.model_dump() for preset in load_presets()]


@router.get("/capabilities")
def get_capabilities():
    return capabilities()


@router.post("/plan")
def preview_route(request: PlanRequest):
    try:
        plan = plan_generation(request.preset_id, request.extra_prompt)
        return {
            "preset_id": request.preset_id,
            "route": plan["route"],
            "prompt": plan["final_prompt"],
            "provider_ready": capabilities()[plan["route"]],
        }
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err)) from err


@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    raw = await file.read(MAX_UPLOAD_BYTES + 1)
    if len(raw) > MAX_UPLOAD_BYTES:
        raise HTTPException(413, "Image exceeds 10 MB")
    if not raw:
        raise HTTPException(400, "No image supplied")
    try:
        with Image.open(io.BytesIO(raw)) as opened:
            if opened.format not in ("PNG", "JPEG", "WEBP"):
                raise ValueError("Only PNG, JPEG and WebP supported")
            if opened.width * opened.height > MAX_IMAGE_PIXELS:
                raise ValueError("Image dimensions too large")
            opened.verify()
        with Image.open(io.BytesIO(raw)) as opened:
            image = ImageOps.exif_transpose(opened).convert("RGB")
            image_id = uuid4().hex + ".png"
            image.save(UPLOAD_DIR / image_id, format="PNG")
    except (UnidentifiedImageError, ValueError, OSError, Image.DecompressionBombError) as err:
        raise HTTPException(400, f"Invalid image: {err}") from err
    return {"image_id": image_id, "status": "uploaded"}


@router.post("/generate", status_code=202)
def generate(request: GenerationRequest):
    try:
        return start_job(request.preset_id, request.image_id, request.extra_prompt)
    except ValueError as err:
        raise HTTPException(400, str(err)) from err
    except FileNotFoundError as err:
        raise HTTPException(404, str(err)) from err
    except RuntimeError as err:
        raise HTTPException(503, str(err)) from err


@router.get("/jobs/{job_id}")
def job_status(job_id: str):
    job = get_job(job_id)
    if job is None:
        raise HTTPException(404, "Job not found")
    return job


@router.get("/jobs/{job_id}/output")
def get_output(job_id: str):
    job = get_job(job_id)
    if job is None:
        raise HTTPException(404, "Job not found")
    if job["status"] != "completed" or not job["output_name"]:
        raise HTTPException(409, "Output is not ready")
    name = job["output_name"]
    expected = job_id + (".png" if job["media_type"] == "image_to_image" else ".mp4")
    if name != expected:
        raise HTTPException(500, "Invalid generated filename")
    path = OUTPUT_DIR / name
    if not path.is_file():
        raise HTTPException(404, "Output file missing")
    return FileResponse(
        str(path),
        media_type="image/png" if path.suffix == ".png" else "video/mp4",
        filename=name,
    )
