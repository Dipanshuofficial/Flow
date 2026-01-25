import { Position, type NodeProps } from "@xyflow/react";
import { BaseNode, type NodeHandle } from "../components/BaseNode";

const logHandles: NodeHandle[] = [
  // 📥 Target: Charcoal/Sand (neutral)
  { type: "target", position: Position.Left, id: "input" },
];

export const DataLogNode = ({ id, data }: NodeProps) => {
  return (
    <BaseNode id={id} type="dataLog" label="Data Log" handles={logHandles}>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black text-neutral opacity-50 uppercase tracking-widest">
          Console Output
        </label>

        {/* TERMINAL BOX: Recessed look using bg-surface */}
        <div
          className="
          min-h-15 max-h-30 overflow-y-auto
          p-3 rounded-lg font-mono text-[10px] leading-relaxed
          bg-surface border border-border text-neutral !
          scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent
        "
        >
          {typeof data?.logs === "string" ? (
            <span className="opacity-90">{data.logs}</span>
          ) : (
            <span className="opacity-40 italic">
              {" "}
              {">"} Waiting for data...
            </span>
          )}
        </div>
      </div>
    </BaseNode>
  );
};
