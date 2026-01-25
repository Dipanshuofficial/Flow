import { Position, type NodeProps } from "@xyflow/react";
import { BaseNode, type NodeHandle } from "../components/BaseNode";

export const LLMNode = ({ id, data }: NodeProps) => {
  const llmHandles: NodeHandle[] = [
    /* Target Inputs: Use Neutral (Charcoal/Sand) */
    {
      type: "target",
      position: Position.Left,
      id: "system",
      style: { top: "33%", background: "var(--brand-neutral)" },
    },
    {
      type: "target",
      position: Position.Left,
      id: "prompt",
      style: { top: "66%", background: "var(--brand-neutral)" },
    },
    /* Output Response: Brand Primary Orange */
    {
      type: "source",
      position: Position.Right,
      id: "response",
      style: { background: "var(--brand-primary)" },
    },
  ];

  return (
    <BaseNode
      id={id}
      label="Large Language Model"
      type="llm"
      handles={llmHandles}
      data={data}
    >
      <div className="flex flex-col gap-3">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black text-neutral opacity-70 uppercase tracking-widest">
            AI Engine Active
          </span>
        </div>

        {/* Informational Text Area */}
        <div
          className="
          p-3 rounded-lg text-[11px] leading-relaxed
          bg-surface border border-border text-neutral font-medium
        "
        >
          This is an <span className="text-primary font-black">LLM Node</span>.
          It processes incoming system instructions and user prompts to generate
          a response.
        </div>

        {/* Footer Metric */}
        <div className="flex justify-between items-center opacity-40">
          <span className="text-[9px] font-bold uppercase">
            Token Limit: 4096
          </span>
          <span className="text-[9px] font-mono">v1.0.4</span>
        </div>
      </div>
    </BaseNode>
  );
};
