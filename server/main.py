import json
import os
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from typing import Dict

from schemas import PipelineRequest
from drivers.n8n_driver import N8NDriver
from drivers.make_driver import MakeDriver
from drivers.zapier_driver import ZapierDriver
from drivers.base_driver import BaseDriver
from validator import PipelineValidator

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


@app.get("/")
async def root():
    return {
        "message": "Ostrich Flow API is running",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# CORS Configuration - Updated for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ostrichflow.iamdipanshusinha.workers.dev",  # No trailing slash
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative dev port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DRIVERS: Dict[str, BaseDriver] = {
    "n8n": N8NDriver(),
    "make": MakeDriver(),
    "zapier": ZapierDriver(),
}


@app.post("/export/{platform}", tags=["Export"])
async def export_pipeline(platform: str, request: PipelineRequest):
    """
    Export a React Flow pipeline to the specified platform format.

    Supported platforms: n8n, make, zapier
    """
    target = platform.lower()
    driver = DRIVERS.get(target)

    if not driver:
        raise HTTPException(
            status_code=400,
            detail=f"Platform '{platform}' not supported. Available: {list(DRIVERS.keys())}",
        )

    try:
        # Validate pipeline structure
        PipelineValidator.validate_all(request.nodes, request.edges)

        # Generate platform-specific export
        exported_data = driver.generate(request.nodes, request.edges)

        # Return JSON as downloadable file
        json_content = json.dumps(exported_data, indent=2)
        filename = f"ostrich_{target}_export.json"

        return Response(
            content=json_content,
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )

    except ValueError as ve:
        # Validation Errors (User's fault - 400)
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        # Internal Errors (System's fault - 500)
        raise HTTPException(status_code=500, detail=f"Internal Error: {str(e)}")


# Local development server
if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
