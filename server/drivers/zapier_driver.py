from typing import List, Dict, Any
from drivers.base_driver import BaseDriver
from schemas import RFNode, RFEdge


class ZapierDriver(BaseDriver):
    # Zapier Step Type Mappings
    TYPE_MAP: Dict[str, str] = {
        "customInput": "trigger",
        "condition": "path",
        "delayNode": "delay",
        "llm": "action",
        "text": "formatter",
    }

    def generate(self, nodes: List[RFNode], edges: List[RFEdge]) -> Dict[str, Any]:
        steps: List[Dict[str, Any]] = []
        for node in nodes:
            steps.append(
                {
                    "id": node.id,
                    "method": self.TYPE_MAP.get(node.type, "action"),
                    "params": node.data,
                    "position": node.position,
                }
            )

        return {"zap": {"title": "Exported Zap", "steps": steps}}
