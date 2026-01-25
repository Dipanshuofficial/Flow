import toast from "react-hot-toast";
import { useStore } from "../components/Store";

export const validatePipeline = async (): Promise<boolean> => {
  const { nodes, edges, setNodeError } = useStore.getState();
  setNodeError(null);

  try {
    const response = await fetch("http://localhost:8000/export/n8n", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodes, edges }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const detail = errorData.detail as string;

      if (detail.includes("CYCLE_DETECTED:")) {
        const nodeId = detail.split(":")[1].trim(); // Removes any accidental whitespace
        setNodeError(nodeId);
        toast.error(`Cycle found at ${nodeId}`);
      } else {
        toast.error(detail);
      }
      return false;
    }
    return true;
  } catch (error) {
    toast.error("FastAPI Backend unreachable");
    return false;
  }
};
export const handleExport = async (platform: string) => {
  const { nodes, edges, setNodeError } = useStore.getState();
  setNodeError(null); // Clear previous visual errors

  try {
    const response = await fetch(`http://localhost:8000/export/${platform}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodes, edges }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const detail = errorData.detail;

      // Handle the validation visual indicator
      if (detail.includes("CYCLE_DETECTED:")) {
        const nodeId = detail.split(":")[1];
        setNodeError(nodeId); // Highlights the node red in the UI
      }
      toast.error(`Export Error: ${detail}`);
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ostrich_${platform}_export.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    toast.error("Connection error:" + error);
  }
};
