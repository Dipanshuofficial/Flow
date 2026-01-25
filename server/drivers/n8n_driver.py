from typing import List, Dict, Any
from drivers.base_driver import BaseDriver
from schemas import RFNode, RFEdge


class N8NDriver(BaseDriver):
    # Mapping Ostrich nodes to functional n8n nodes
    TYPE_MAP: Dict[str, str] = {
        "customInput": "n8n-nodes-base.manualTrigger",
        "customOutput": "n8n-nodes-base.noOp",
        "text": "n8n-nodes-base.set",  # Sets variables in the workflow
        "condition": "n8n-nodes-base.if",  # Logical branching
        "mergeNode": "n8n-nodes-base.merge",  # Combines data streams
        "delayNode": "n8n-nodes-base.wait",  # Pauses execution
        "loopNode": "n8n-nodes-base.splitInBatches",  # Iteration control
        "llm": "n8n-nodes-base.httpRequest",  # API call to AI services
        "dataLog": "n8n-nodes-base.noOp",  # Placeholder for logging
    }

    def generate(self, nodes: List[RFNode], edges: List[RFEdge]) -> Dict[str, Any]:
        n8n_nodes: List[Dict[str, Any]] = []
        for node in nodes:
            n8n_nodes.append(
                {
                    "parameters": node.data,
                    "name": node.id,
                    "type": self.TYPE_MAP.get(node.type, "n8n-nodes-base.noOp"),
                    "typeVersion": 1,
                    "position": [node.position["x"], node.position["y"]],
                }
            )

        connections: Dict[str, Any] = {}
        for edge in edges:
            if edge.source not in connections:
                connections[edge.source] = {"main": [[]]}
            connections[edge.source]["main"][0].append(
                {"node": edge.target, "type": "main", "index": 0}
            )

        return {"nodes": n8n_nodes, "connections": connections}
