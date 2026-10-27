
"""Local job runner integrated with LangGraph."""

from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, asdict
from pathlib import Path
from threading import Lock
from uuid import uuid4

from .config import OUTPUT_DIR, UPLOAD_DIR
from .agent.workflow import plan_generation, execute_generation
from .inference import image, video


# Background job executor
_executor = ThreadPoolExecutor(max_workers=1)

# Store generation jobs in memory
_jobs: dict[str, "JobRecord"] = {}

# Prevent simultaneous modifications
_lock = Lock()


@dataclass
class JobRecord:
    id: str
    status: str
    media_type: str
    error: str | None = None
    output_name: str | None = None


# Check whether models are ready
def capabilities() -> dict[str, bool]:
    return {
        "image_to_image": image.READY,
        "image_to_video": video.READY,
    }


# Get job information
def get_job(job_id: str) -> dict | None:
    with _lock:
        job = _jobs.get(job_id)
        return asdict(job) if job else None


# Update job status
def _update(job_id: str, **updates) -> None:
    with _lock:
        job = _jobs[job_id]

        for key, value in updates.items():
            setattr(job, key, value)


# Execute generation through LangGraph
def _work(
    job_id: str,
    media_type: str,
    source: Path,
    preset_id: str,
    extra_prompt: str,
) -> None:

    _update(job_id, status="processing")

    # Choose output file format
    suffix = (
        ".png"
        if media_type == "image_to_image"
        else ".mp4"
    )

    output = OUTPUT_DIR / f"{job_id}{suffix}"

    try:
        # Execute LangGraph agent
        result = execute_generation(
            preset_id=preset_id,
            source=source,
            output=output,
            extra_prompt=extra_prompt,
        )

        # Verify selected route
        if result["route"] != media_type:
            raise RuntimeError(
                "Unexpected LangGraph route"
            )

        # Verify actual output file
        if (
            not output.is_file()
            or output.stat().st_size == 0
        ):
            raise RuntimeError(
                "Generation did not create an output file"
            )

        # Mark job as completed
        _update(
            job_id,
            status="completed",
            output_name=output.name,
        )

    except Exception as error:

        # Delete incomplete output
        output.unlink(missing_ok=True)

        # Mark job as failed
        _update(
            job_id,
            status="failed",
            error=str(error),
        )


# Start a new generation job
def start_job(
    preset_id: str,
    image_id: str,
    extra_prompt: str = "",
) -> dict:

    # Ask LangGraph to prepare the generation plan
    plan = plan_generation(
        preset_id,
        extra_prompt,
    )

    media_type = plan["route"]

    # Verify selected AI model is available
    if not capabilities()[media_type]:
        raise RuntimeError(
            f"{media_type} inference provider is not connected"
        )

    # Validate uploaded image ID
    if (
        len(image_id) != 36
        or not image_id.endswith(".png")
        or any(
            char not in "0123456789abcdef"
            for char in image_id[:-4]
        )
    ):
        raise ValueError(
            "Invalid uploaded image ID"
        )

    image_path = UPLOAD_DIR / image_id

    if not image_path.is_file():
        raise FileNotFoundError(
            "Uploaded image not found"
        )

    # Generate unique job ID
    job_id = uuid4().hex

    # Register new job
    with _lock:
        _jobs[job_id] = JobRecord(
            id=job_id,
            status="queued",
            media_type=media_type,
        )

    # Submit generation task
    _executor.submit(
        _work,
        job_id,
        media_type,
        image_path,
        preset_id,
        extra_prompt,
    )

    return get_job(job_id)
