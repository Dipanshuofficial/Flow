from typing import List, Dict, Set
from schemas import RFNode, RFEdge


class PipelineValidator:
    @staticmethod
    def validate_all(nodes: List[RFNode], edges: List[RFEdge]) -> None:
        """Runs a suite of production checks on the pipeline."""
        PipelineValidator._check_empty(nodes)
        PipelineValidator._check_for_cycles(nodes, edges)
        PipelineValidator._check_orphans(nodes, edges)

    @staticmethod
    def _check_empty(nodes: List[RFNode]) -> None:
        if not nodes:
            raise ValueError("Pipeline is empty. Add nodes before exporting.")

    @staticmethod
    def _check_for_cycles(nodes: List[RFNode], edges: List[RFEdge]) -> None:
        """Detects if the graph has circular dependencies (DAG Check)."""
        # 1. Explicitly annotate the adjacency list type
        adj: Dict[str, List[str]] = {node.id: [] for node in nodes}
        for edge in edges:
            if edge.source in adj:
                adj[edge.source].append(edge.target)

        # 2. Explicitly annotate set types
        visited: Set[str] = set()
        rec_stack: Set[str] = set()

        # 3. Add type annotation for the recursive parameter 'v'
        def has_cycle(v: str) -> bool:
            visited.add(v)
            rec_stack.add(v)

            # Use .get() safely with a typed default
            for neighbor in adj.get(v, []):
                if neighbor not in visited:
                    if has_cycle(neighbor):
                        return True
                elif neighbor in rec_stack:
                    raise ValueError(f"CYCLE_DETECTED: {neighbor}")

            rec_stack.remove(v)
            return False

        for node in nodes:
            if node.id not in visited:
                if has_cycle(node.id):
                    raise ValueError(
                        f"Cycle detected at node: {node.id}. Pipelines must be acyclic."
                    )

    @staticmethod
    def _check_orphans(nodes: List[RFNode], edges: List[RFEdge]) -> None:
        """Ensures all nodes have at least one connection."""
        connected_nodes: Set[str] = set()
        for edge in edges:
            connected_nodes.add(edge.source)
            connected_nodes.add(edge.target)

        for node in nodes:
            # We allow customInput to be unconnected as it is a trigger
            if node.id not in connected_nodes and node.type != "customInput":
                raise ValueError(
                    f"Orphaned node detected: {node.id}. Please connect or remove it."
                )
