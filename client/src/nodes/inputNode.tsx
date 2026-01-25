import { Position, type Node, type NodeProps } from "@xyflow/react";
import { BaseNode, type NodeHandle } from "../components/BaseNode";
import { useState } from "react";

type InputNodeData = {
  inputName?: string;
  inputType?: string;
};

export const InputNode = ({ id, data }: NodeProps<Node<InputNodeData>>) => {
  const [currName, setCurrName] = useState(
    data?.inputName || id.replace("customInput-", "input_"),
  );
  const [inputType, setInputType] = useState(data.inputType || "Text");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInputType(e.target.value);
  };

  const inputHandles: NodeHandle[] = [
    /* Output: Brand Primary Orange */
    { type: "source", position: Position.Right, id: "value" },
  ];

  return (
    <BaseNode
      id={id}
      label={"Input Definition"}
      handles={inputHandles}
      type="customInput"
      data={data}
    >
      <div className="flex flex-col gap-3">
        {/* Name Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-neutral opacity-50 uppercase tracking-widest">
            Variable Name
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

        {/* Type Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-neutral opacity-50 uppercase tracking-widest">
            Data Type
          </label>
          <select
            value={inputType}
            onChange={handleTypeChange}
            className="
              w-full p-2 rounded-lg font-bold uppercase text-[10px] tracking-tight
              bg-surface border border-border text-neutral !
              cursor-pointer outline-none !
              focus:border-primary !
            "
          >
            <option value="Text">Text String</option>
            <option value="File">Binary File</option>
          </select>
        </div>
      </div>
    </BaseNode>
  );
};
