import json
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from typing import Dict

from schemas import PipelineRequest
from drivers.n8n_driver import N8NDriver
from drivers.make_driver import MakeDriver
from drivers.zapier_driver import ZapierDriver
from drivers.base_driver import BaseDriver
from validator import PipelineValidator

# uvicorn main:app --reload --port 8000


# Meta-information for the OpenAPI Documentation
tags_metadata = [
    {
        "name": "Export",
        "description": "Transform React Flow pipelines into platform-specific configurations.",
    },
]

app = FastAPI(
    title="Ostrich Flow API",
    description="Backend service for modular workflow transpilation.",
    version="1.0.0",
    openapi_tags=tags_metadata,
)

# PRODUCTION CORS: Restrict to your Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)

DRIVERS: Dict[str, BaseDriver] = {
    "n8n": N8NDriver(),
    "make": MakeDriver(),
    "zapier": ZapierDriver(),
}


@app.post(
    "/export/{platform}",
    tags=["Export"],
    status_code=status.HTTP_200_OK,
    summary="Generate platform-ready JSON",
    response_class=FileResponse,
)
async def export_pipeline(platform: str, request: PipelineRequest):
    target = platform.lower()
    driver = DRIVERS.get(target)

    if not driver:
        raise HTTPException(
            status_code=400, detail=f"Platform '{platform}' not supported."
        )

    try:
        # 1. RUN ALL PRODUCTION CHECKS
        PipelineValidator.validate_all(request.nodes, request.edges)

        # 2. PROCEED TO GENERATION
        exported_data = driver.generate(request.nodes, request.edges)

        file_path = f"ostrich_{target}_export.json"
        with open(file_path, "w") as f:
            json.dump(exported_data, f, indent=2)

        return FileResponse(
            path=file_path, filename=file_path, media_type="application/json"
        )

    except ValueError as ve:
        # Validation Errors (User's fault - 400)
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        # Internal Errors (System's fault - 500)
        raise HTTPException(status_code=500, detail=f"Internal Error: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
