import { useState } from "react";
import { Position, type Node, type NodeProps } from "@xyflow/react";
import { BaseNode, type NodeHandle } from "../components/BaseNode";

type LoopNodeData = {
  count?: number;
};

export const LoopNode = ({ id, data }: NodeProps<Node<LoopNodeData>>) => {
  const [count, setCount] = useState(data?.count || 1);

  const loopHandles: NodeHandle[] = [
    /* Target & Source: Mapped to your theme's Neutral (Charcoal/Sand) */
    { type: "target", position: Position.Left, id: "in" },
    { type: "source", position: Position.Right, id: "out" },
  ];

  return (
    <BaseNode
      handles={loopHandles}
      id={id}
      label="Iteration Control"
      type="loopNode"
      data={data}
    >
      <div className="flex flex-col gap-3">
        {/* Header Label */}
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black text-neutral opacity-50 uppercase tracking-widest">
            Total Cycles
          </label>
          {/* Subtle cycling animation indicator */}
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-primary animate-bounce" />
            <div className="w-1 h-1 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
            <div className="w-1 h-1 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>

        <div className="relative group">
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="
              w-full p-2.5 rounded-lg font-mono text-sm font-bold
              bg-surface border border-border text-primary !
              outline-none transition-all
              focus:border-primary focus:ring-1 focus:ring-primary/20 !
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
            "
            min={1}
          />
          {/* Label suffix for unit measurement */}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-neutral opacity-30 pointer-events-none uppercase">
            Runs
          </span>
        </div>

        <p className="text-[9px] font-medium text-neutral opacity-40 italic">
          The pipeline will repeat {count} times before continuing.
        </p>
      </div>
    </BaseNode>
  );
};
