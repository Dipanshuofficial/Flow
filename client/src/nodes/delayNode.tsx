import { useState } from "react";
import { Position, type Node, type NodeProps } from "@xyflow/react";
import { BaseNode, type NodeHandle } from "../components/BaseNode";

type DelayNodeData = {
  delay?: number;
};

export const DelayNode = ({ id, data }: NodeProps<Node<DelayNodeData>>) => {
  const delayHandles: NodeHandle[] = [
    /* Target & Source: Standard theme-mapped handles */
    { type: "target", position: Position.Left, id: "in" },
    { type: "source", position: Position.Right, id: "out" },
  ];

  const [delay, setDelay] = useState(data?.delay || 0);

  return (
    <BaseNode
      handles={delayHandles}
      id={id}
      label="Delay Control"
      type="delayNode"
    >
      <div className="flex flex-col gap-2">
        {/* Typographically consistent label */}
        <label className="text-[10px] font-black text-neutral opacity-50 uppercase tracking-widest">
          Wait Duration
        </label>

        <div className="relative group">
          <input
            type="number"
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            className="
              w-full p-2.5 rounded-lg font-mono text-sm font-bold
              bg-surface border border-border text-primary !
              outline-none transition-all
              focus:border-primary focus:ring-1 focus:ring-primary/20 !
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
            "
            min={0}
          />
          {/* Suffix unit inside the input area */}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-neutral opacity-30 pointer-events-none uppercase">
            SEC
          </span>
        </div>

        {/* Dynamic description text */}
        <p className="text-[9px] font-medium text-neutral opacity-40 italic mt-1">
          Execution will pause for {delay} seconds.
        </p>
      </div>
    </BaseNode>
  );
};
