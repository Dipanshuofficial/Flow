import { Position, type Node, type NodeProps } from "@xyflow/react";
import { BaseNode, type NodeHandle } from "../components/BaseNode";
import { useState } from "react";

type OutputNodeData = {
  outputName: string;
  outputType: string;
};

export const OutputNode = ({ id, data }: NodeProps<Node<OutputNodeData>>) => {
  const [currName, setCurrName] = useState(
    data?.outputName || id.replace("customOutput-", "output_"),
  );
  const [outputType, setOutputType] = useState(data.outputType || "Text");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOutputType(e.target.value);
  };

  const outputHandles: NodeHandle[] = [
    /* Target Input: Mapped to Neutral (Charcoal/Sand) */
    {
      type: "target",
      position: Position.Left,
      id: "value",
      style: { background: "var(--brand-neutral)" },
    },
  ];

  return (
    <BaseNode
      label={"Output Terminal"}
      id={id}
      handles={outputHandles}
      type="customOutput"
      data={data}
    >
      <div className="flex flex-col gap-3">
        {/* Output Name Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-neutral opacity-50 uppercase tracking-widest">
            Export Variable
          </label>
          <input
            type="text"
            value={currName}
            onChange={handleNameChange}
            className="
              w-full p-2 rounded-lg font-mono text-xs font-bold
              bg-surface border border-border text-primary !
              outline-none transition-all
              focus:border-primary focus:ring-1 focus:ring-primary/20 !
            "
          />
        </div>

        {/* Output Format Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-neutral opacity-50 uppercase tracking-widest">
            Format Type
          </label>
          <select
            value={outputType}
            onChange={handleTypeChange}
            className="
              w-full p-2 rounded-lg font-bold uppercase text-[10px] tracking-tight
              bg-surface border border-border text-neutral !
              cursor-pointer outline-none !
              focus:border-primary !
            "
          >
            <option value="Text">Text Stream</option>
            <option value="File">Image Asset</option>
          </select>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-end gap-2 mt-1 opacity-40">
          <span className="text-[8px] font-black uppercase tracking-tighter">
            Ready for export
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </div>
      </div>
    </BaseNode>
  );
};
