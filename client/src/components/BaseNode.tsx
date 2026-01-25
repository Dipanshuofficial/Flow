import { Handle, Position } from "@xyflow/react";
import { IconMap } from "../utils/icons";
import "../styles/baseNode.css";
import type { CSSProperties } from "react";
import { Trash2Icon, AlertCircle } from "lucide-react"; // 🚨 Added AlertCircle here
import { useStore } from "./Store";

export interface NodeHandle {
  id: string;
  type: "source" | "target";
  position: Position;
  style?: CSSProperties;
}

export interface BaseNodeProps {
  id: string;
  type: string;
  data?: any;
  label?: string;
  children?: React.ReactNode;
  handles: NodeHandle[];
}

export const BaseNode = ({
  children,
  id,
  type,
  label,
  handles,
}: BaseNodeProps) => {
  const Icon = IconMap[type];
  const errorNodeId = useStore((state) => state.errorNodeId);
  const deleteNode = useStore((state) => state.deleteNode);
  const isErrored = errorNodeId === id; // Check if this node is the culprit

  return (
    <div
      className={`
      relative min-w-52 bg-panel border rounded-2xl transition-all group
      ${
        isErrored
          ? "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse"
          : "border-border shadow-xl"
      }
    `}
    >
      {/* Header with Secondary Tint */}
      <div
        className={`
        flex items-center gap-2 px-3 py-2.5 border-b rounded-t-2xl
        ${isErrored ? "bg-red-500/10 border-red-500/50" : "bg-secondary/20 border-border"}
      `}
      >
        {/* Switch icon to AlertCircle if errored */}
        {isErrored ? (
          <AlertCircle size={16} strokeWidth={3} className="text-red-500" />
        ) : (
          Icon && <Icon size={16} strokeWidth={3} className="text-primary" />
        )}

        <span
          className={`text-[11px] font-black uppercase tracking-widest ${isErrored ? "text-red-500" : "text-neutral/70"}`}
        >
          {label}
        </span>

        <button
          className="text-primary ml-auto p-1 hover:bg-red-500 hover:text-white rounded-md"
          onClick={() => {
            deleteNode(id);
          }}
          title="Delete Node"
        >
          <Trash2Icon size={16} strokeWidth={3} />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-4 bg-panel rounded-b-2xl relative">
        <div className="text-text-main text-sm">{children}</div>
      </div>

      {/* Connection Handles */}
      {handles.map((h: any) => (
        <Handle
          key={h.id}
          {...h}
          className={`
            w-4 h-4 border-[3px] border-panel shadow-lg transition-all hover:scale-150 hover:border-primary cursor-crosshair z-10
            ${h.type === "source" ? "bg-primary" : "bg-neutral"}
          `}
          style={{
            ...h.style,
            position: "absolute",
            [h.position === "left" ? "left" : "right"]: "-6px",
          }}
        />
      ))}

      {/* Hover Ring (Disable if errored to keep focus on red glow) */}
      {!isErrored && (
        <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-primary/20 pointer-events-none transition-all" />
      )}
    </div>
  );
};
