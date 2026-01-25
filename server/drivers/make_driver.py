from typing import List, Dict, Any
from drivers.base_driver import BaseDriver
from schemas import RFNode, RFEdge


class MakeDriver(BaseDriver):
    # Make.com Module ID Mappings
    TYPE_MAP: Dict[str, str] = {
        "customInput": "webhooks:CustomWebhook",
        "text": "builtin:BasicVariable",
        "condition": "builtin:Router",
        "mergeNode": "builtin:Aggregator",
        "delayNode": "builtin:Sleep",
        "loopNode": "builtin:Iterator",
        "llm": "openai:CreateChatCompletion",
    }

    def generate(self, nodes: List[RFNode], edges: List[RFEdge]) -> Dict[str, Any]:
        flow: List[Dict[str, Any]] = []
        for node in nodes:
            flow.append(
                {
                    "id": node.id,
                    "module": self.TYPE_MAP.get(node.type, "builtin:NoOp"),
                    "metadata": {
                        "designer": {"x": node.position["x"], "y": node.position["y"]}
                    },
                    "parameters": node.data,
                }
            )

        return {"name": "Ostrich Flow Export", "flow": flow, "metadata": {"version": 1}}
