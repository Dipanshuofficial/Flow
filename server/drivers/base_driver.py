from abc import ABC, abstractmethod
from typing import List, Dict, Any
from schemas import RFNode, RFEdge


class BaseDriver(ABC):
    @abstractmethod
    def generate(self, nodes: List[RFNode], edges: List[RFEdge]) -> Dict[str, Any]:
        """Convert React Flow data to platform-specific JSON."""
        pass
