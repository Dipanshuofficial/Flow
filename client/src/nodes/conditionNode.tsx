import { Position, type NodeProps } from "@xyflow/react";
import { BaseNode, type NodeHandle } from "../components/BaseNode";
import { useStore } from "../components/Store";

// 🚦 Define the "Tracks": Where data comes in and where it splits
const conditionHandles: NodeHandle[] = [
  // 📥 Target: Neutral Input
  { type: "target", position: Position.Left, id: "input" },

  // 📤 True Path: Emerald Green with Glow
  {
    type: "source",
    position: Position.Right,
    id: "true",
    style: {
      top: "30%",
      background: "#10b981",
      boxShadow: "0 0 8px rgba(16, 185, 129, 0.4)",
    },
  },

  // 📤 False Path: Rose Red with Glow
  {
    type: "source",
    position: Position.Right,
    id: "false",
    style: {
      top: "70%",
      background: "#f43f5e",
      boxShadow: "0 0 8px rgba(244, 63, 94, 0.4)",
    },
  },
];

export const ConditionNode = ({ id, data }: NodeProps) => {
  // 🧠 Hook into the store to save changes
  const updateNodeField = useStore((state) => state.updateNodeField);

  return (
    <BaseNode
      id={id}
      type="condition"
      label="Condition"
      handles={conditionHandles}
      data={data}
    >
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black text-neutral opacity-50 uppercase tracking-tighter">
          Logical Operator
        </label>

        {/* 🎢 The Switch: Determines the data path */}
        <select
          // Force a string fallback to keep TypeScript happy
          value={typeof data?.operator === "string" ? data.operator : "equals"}
          className="w-full text-[11px] font-bold uppercase tracking-tight bg-surface border border-border rounded-lg p-2 text-neutral outline-none"
          onChange={(e) => updateNodeField(id, "operator", e.target.value)}
        >
          <option value="equals">Equals</option>
          <option value="contains">Contains</option>
          <option value="exists">Exists</option>
        </select>
      </div>
    </BaseNode>
  );
};
