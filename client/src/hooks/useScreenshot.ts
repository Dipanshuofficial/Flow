import {
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from "@xyflow/react";
import { toBlob } from "html-to-image";
import toast from "react-hot-toast";

export const useScreenshot = () => {
  const { getNodes } = useReactFlow();

  const takeScreenshot = async () => {
    const nodes = getNodes();
    const viewportElement = document.querySelector(
      ".react-flow__viewport",
    ) as HTMLElement;

    if (!viewportElement) return;

    // 🎨 Theme Sync: Pull from index.css
    const style = getComputedStyle(document.documentElement);
    const bgSurface = style.getPropertyValue("--bg-surface").trim();
    const dotColor = style.getPropertyValue("--border-color").trim();

    let width = 1920;
    let height = 1080;
    let transform = "translate(0,0) scale(1)";

    if (nodes.length > 0) {
      const bounds = getNodesBounds(nodes);
      const viewport = getViewportForBounds(
        bounds,
        width,
        height,
        0.1,
        2.0,
        0.2,
      );
      transform = `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`;
    }

    // 🚀 Execution with Toast Promise
    return toast.promise(
      (async () => {
        const blob = await toBlob(viewportElement, {
          backgroundColor: bgSurface,
          width: width,
          height: height,
          style: {
            width: `${width}px`,
            height: `${height}px`,
            transform: transform,
            backgroundImage: `radial-gradient(${dotColor} 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          },
        });

        if (!blob) throw new Error("Failed to generate image");

        // 📋 Copy to Clipboard
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
      })(),
      {
        loading: "Rendering canvas...",
        success: "Snapshot copied to clipboard!",
        error: "Failed to capture screenshot.",
      },
    );
  };

  return takeScreenshot;
};
