from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any, Optional


class RFNode(BaseModel):
    # In Pydantic v2, we use 'examples' as a list for documentation
    id: str = Field(..., examples=["text-1"])
    type: str = Field(..., examples=["text"])
    position: Dict[str, float] = Field(..., examples=[{"x": 100, "y": 200}])
    data: Dict[str, Any] = Field(
        default={}, examples=[{"label": "Template", "text": "{{input}}"}]
    )


class RFEdge(BaseModel):
    id: str = Field(..., examples=["e1-2"])
    source: str = Field(..., examples=["text-1"])
    target: str = Field(..., examples=["llm-1"])
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None


class PipelineRequest(BaseModel):
    nodes: List[RFNode]
    edges: List[RFEdge]

    # Pydantic v2 uses ConfigDict instead of a nested class
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "nodes": [
                    {
                        "id": "input-1",
                        "type": "customInput",
                        "position": {"x": 0, "y": 0},
                        "data": {"label": "Input node"},
                    }
                ],
                "edges": [],
            }
        }
    )
