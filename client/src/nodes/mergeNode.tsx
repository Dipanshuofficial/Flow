import { Position, type NodeProps } from "@xyflow/react";
import { BaseNode, type NodeHandle } from "../components/BaseNode";

export const MergeNode = ({ id, data }: NodeProps) => {
  const mergeHandles: NodeHandle[] = [
    /* Target Inputs: Use Neutral (Charcoal/Sand) */
    {
      type: "target",
      position: Position.Left,
      id: "a",
      style: { top: "33%", background: "var(--brand-neutral)" },
    },
    {
      type: "target",
      position: Position.Left,
      id: "b",
      style: { top: "66%", background: "var(--brand-neutral)" },
    },
    /* Output: Brand Primary Orange */
    {
      type: "source",
      position: Position.Right,
      id: "merged",
      style: { background: "var(--brand-primary)" },
    },
  ];

  return (
    <BaseNode
      id={id}
      label="Stream Merger"
      handles={mergeHandles}
      type="mergeNode"
      data={data}
    >
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black text-neutral opacity-50 uppercase tracking-widest">
          Function
        </label>

        {/* Information Box: Recessed look using bg-surface */}
        <div
          className="
          p-3 rounded-lg text-[11px] leading-relaxed
          bg-surface border border-border text-neutral font-medium
        "
        >
          Combines two{" "}
          <span className="text-primary font-black">Datastreams</span> into a
          single unified JSON object.
        </div>

        {/* Footer Hardware Spec */}
        <div className="flex justify-between items-center opacity-30 mt-1">
          <span className="text-[8px] font-bold uppercase">Sync: Auto</span>
          <span className="text-[8px] font-mono">ID: {id.split("-")[1]}</span>
        </div>
      </div>
    </BaseNode>
  );
};
