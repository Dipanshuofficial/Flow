import { useLayoutEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  Position,
  type NodeProps,
  useUpdateNodeInternals,
} from "@xyflow/react";
import { BaseNode, type NodeHandle } from "../components/BaseNode";
import TextareaAutosize from "react-textarea-autosize";

export const TextNode = ({ id, data }: NodeProps) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const [currText, setCurrText] = useState<string>(
    typeof data?.text === "string" ? data.text : "{{input}}",
  );

  // 🔍 Regex Parser: Extracts variable names from {{curly_brackets}}
  const variables = useMemo(() => {
    const regex = /\{\{\s*([a-zA-Z0-9_$]+)\s*\}\}/g;
    const matches = Array.from(currText.matchAll(regex));
    return [...new Set(matches.map((match) => match[1]))];
  }, [currText]);
  useLayoutEffect(() => {
    const triggerUpdate = () => updateNodeInternals(id);

    // Request animation frame ensures the textarea has finished resizing in the DOM
    const frame = requestAnimationFrame(triggerUpdate);

    return () => cancelAnimationFrame(frame);
  }, [id, currText, variables.length, updateNodeInternals]);
  // 🔌 Dynamic Target Handles: Mapped to Neutral (Charcoal/Sand)
  const variableHandles: NodeHandle[] = variables.map((variable, idx) => ({
    type: "target",
    position: Position.Left,
    id: `${id}-${variable}`,
    style: {
      top: `${(idx + 1) * (100 / (variables.length + 1))}%`,
      background: "var(--brand-neutral)", // Charcoal/Sand connectors
    },
  }));

  // 📤 Static Output: One handle on the right using Brand Primary (Orange)
  const textHandles: NodeHandle[] = [
    ...variableHandles,
    {
      type: "source",
      position: Position.Right,
      id: "output",
      style: { background: "var(--brand-primary)" },
    },
  ];

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCurrText(e.target.value);
  };

  return (
    <BaseNode label="Text Template" type="text" id={id} handles={textHandles}>
      <div className="flex flex-col gap-2 p-1">
        <label className="text-[10px] font-black text-neutral opacity-50 uppercase tracking-widest">
          Template Body
        </label>

        {/* Recessed Textarea: Using bg-surface and font-mono */}
        <TextareaAutosize
          value={currText}
          onChange={handleTextChange}
          placeholder="Type {{variable}}..."
          className="
            w-full p-3 rounded-lg text-xs font-mono leading-relaxed
            bg-surface border border-border text-neutral !
            outline-none transition-all
            focus:border-primary focus:ring-1 focus:ring-primary/20 !
            placeholder:opacity-30 !
          "
          minRows={2}
          maxRows={6}
        />

        {/* Dynamic Variable Counter */}
        <div className="flex justify-between items-center mt-1 px-1">
          <span className="text-[8px] font-bold text-neutral opacity-40 uppercase tracking-tight">
            Variables: {variables.length}
          </span>
          {variables.length > 0 && (
            <div className="flex gap-1">
              {variables.map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-primary" />
              ))}
            </div>
          )}
        </div>
      </div>
    </BaseNode>
  );
};
