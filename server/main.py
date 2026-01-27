import json
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from typing import Dict

# Import the bridge for Cloudflare
from workers import WorkerEntrypoint
import asgi


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


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# PRODUCTION CORS: Restrict to your Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ostrichflow.iamdipanshusinha.workers.dev/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DRIVERS: Dict[str, BaseDriver] = {
    "n8n": N8NDriver(),
    "make": MakeDriver(),
    "zapier": ZapierDriver(),
}


@app.post("/export/{platform}")
async def export_pipeline(platform: str, request: PipelineRequest):
    target = platform.lower()
    driver = DRIVERS.get(target)

    if not driver:
        raise HTTPException(
            status_code=400, detail=f"Platform '{platform}' not supported."
        )

    try:
        PipelineValidator.validate_all(request.nodes, request.edges)
        exported_data = driver.generate(request.nodes, request.edges)

        # FIX: Don't write to disk. Return the JSON directly as a file download.
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


# THE BRIDGE: This is what Cloudflare actually runs
class Default(WorkerEntrypoint):
    async def fetch(self, request):
        return await asgi.fetch(app, request, self.env)


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)