import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import { type CSSProperties, useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useStore } from "./Store";

export const CustomEdge = (
  props: EdgeProps & { data?: { label?: string } },
) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    markerEnd,
    style,
  } = props;

  // Hooks First 💂‍♂️
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [labelText, setLabelText] = useState((data?.label as string) || "");
  const { deleteEdge, updateEdgeLabel } = useStore();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  useEffect(() => {
    setLabelText((data?.label as string) || "");
  }, [data?.label]);

  const handleLabelSave = () => {
    updateEdgeLabel(id as string, labelText);
    setIsEditingLabel(false);
  };

  const hasLabel = !!(data?.label && String(data.label).trim() !== "");
  const trashX = sourceX * 0.2 + targetX * 0.8;
  const trashY = sourceY * 0.2 + targetY * 0.8;

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={style as CSSProperties}
        
      />

      {/* 🛣️ THE MEGA HITBOX (Invisible wide path) */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={40}
        className="cursor-pointer"
        style={{ pointerEvents: "all" }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setIsEditingLabel(true);
        }}
      />

      <EdgeLabelRenderer>
        {/* 🏷️ THE LABEL - Locked in the center via CSS transform */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
            zIndex: 50,
          }}
        >
          <div
            onDoubleClick={() => setIsEditingLabel(true)}
            className={`flex items-center justify-center rounded-lg transition-all border
              ${
                hasLabel || isEditingLabel
                  ? "bg-panel border-border shadow-md px-3 py-1.5"
                  : "bg-transparent border-transparent w-28 h-12 hover:bg-panel/10"
              } 
            `}
          >
            {isEditingLabel ? (
              <input
                autoFocus
                className="bg-transparent text-xs outline-none text-text-main min-w-20 font-bold text-center"
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                onBlur={handleLabelSave}
                onKeyDown={(e) => e.key === "Enter" && handleLabelSave()}
              />
            ) : (
              <span className="text-xs text-text-main font-bold">
                {data?.label}
              </span>
            )}
          </div>
        </div>

        {/* 🗑️ TRASH BUTTON - Near Arrowhead */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: `translate(-50%, -50%) translate(${trashX}px,${trashY}px)`,
            pointerEvents: "all",
            zIndex: 50,
          }}
          className="group"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteEdge(id);
            }}
            className="invisible group-hover:visible p-1.5 rounded-lg bg-panel border border-border text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
            title="Delete Edge"
          >
            <Trash2 size={13} strokeWidth={3} />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
