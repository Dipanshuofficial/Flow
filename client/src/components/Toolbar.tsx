import { Panel } from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
import { DraggableNode } from "./DraggableNode";
import {
  Layers,
  Database,
  GitMerge,
  RefreshCw,
  Cpu,
  Type,
  LogIn,
  LogOut,
  Split,
  Clock,
  PanelRightClose,
  DatabaseIcon,
  Play,
  LucideTrash2,
  Fullscreen,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useStore } from "./Store";
import { useScreenshot } from "../hooks/useScreenshot";

import { PlatformPopup } from "./PlatformPopup";
import { handleExport, validatePipeline } from "../utils/submit";

type CategoryId = "General" | "I/O" | "Logic" | "Flow";

interface NodeDefinition {
  type: string;
  label: string;
  icon: LucideIcon;
}

const CATEGORIES: { id: CategoryId; icon: LucideIcon; label: string }[] = [
  { id: "General", icon: Layers, label: "General" },
  { id: "I/O", icon: Database, label: "Input & Output" },
  { id: "Logic", icon: GitMerge, label: "Logic" },
  { id: "Flow", icon: RefreshCw, label: "Flow Control" },
];

const NODE_DATA: Record<CategoryId, NodeDefinition[]> = {
  General: [
    { type: "llm", label: "LLM", icon: Cpu },
    { type: "text", label: "Text", icon: Type },
  ],
  "I/O": [
    { type: "customInput", label: "Input", icon: LogIn },
    { type: "customOutput", label: "Output", icon: LogOut },
    { type: "dataLog", label: "Data Log", icon: DatabaseIcon },
  ],
  Logic: [
    { type: "condition", label: "Condition", icon: Split },
    { type: "mergeNode", label: "Merge", icon: GitMerge },
  ],
  Flow: [
    { type: "delayNode", label: "Delay", icon: Clock },
    { type: "loopNode", label: "Loop", icon: RefreshCw },
  ],
};

// ... Categories and Node Data definitions as per your previous snippet

export const PipelineToolbar = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { deleteAllNodes } = useStore();
  const takeScreenshot = useScreenshot();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const handleStartExport = async () => {
    const isValid = await validatePipeline(); // 1. Run production checks first
    if (isValid) {
      setIsExportOpen(true); // 2. Only open popup if graph is a DAG
    }
  };
  return (
    <Panel
      position="top-right"
      className="m-4 flex gap-4 items-start select-none pointer-events-none"
    >
      <AnimatePresence>
        {activeCategory && (
          <motion.div
            initial={{ width: 0, opacity: 0, x: 20 }}
            animate={{ width: 256, opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="pointer-events-auto"
          >
            <div className="w-64 bg-panel/80 backdrop-blur-xl border border-border shadow-2xl rounded-2xl p-4 overflow-hidden">
              <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
                <h3 className="text-[10px] font-black text-neutral opacity-70 uppercase tracking-widest">
                  {activeCategory}
                </h3>
                <button
                  onClick={() => setActiveCategory(null)}
                  className="text-neutral hover:text-primary transition-colors"
                >
                  <PanelRightClose size={18} strokeWidth={2.5} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {NODE_DATA[activeCategory as keyof typeof NODE_DATA].map(
                  (node, idx) => (
                    <motion.div
                      key={node.type}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <DraggableNode
                        type={node.type}
                        className="group p-3 bg-surface border border-border hover:border-primary transition-all rounded-xl"
                      >
                        <node.icon
                          size={22}
                          strokeWidth={2.2}
                          className="text-neutral group-hover:text-primary mb-2"
                        />
                        <span className="text-[9px] font-black text-neutral uppercase tracking-tight">
                          {node.label}
                        </span>
                      </DraggableNode>
                    </motion.div>
                  ),
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-2 p-2 bg-panel border border-border shadow-xl rounded-2xl pointer-events-auto">
        {CATEGORIES.map((cat) => (
          <ToolbarButton
            key={cat.id}
            icon={cat.icon}
            label={cat.label}
            nodes={NODE_DATA[cat.id]}
            isActive={activeCategory === cat.id}
            onClick={() =>
              setActiveCategory(activeCategory === cat.id ? null : cat.id)
            }
          />
        ))}
        <div className="w-full h-px bg-border/50 my-1" />
        <ToolbarButton
          icon={LucideTrash2}
          onClick={deleteAllNodes}
          tooltip="Clear Canvas"
          color="hover:bg-red-400 text-neutral"
        />
        <ToolbarButton
          icon={Fullscreen}
          tooltip="Take Screenshot"
          onClick={takeScreenshot}
          color="hover:bg-primary text-neutral"
        />
        <ToolbarButton
          icon={Play}
          tooltip="Start Export"
          onClick={handleStartExport}
          color="hover:bg-lime-600 text-primary hover:scale-110"
          isFilled
        />
        <PlatformPopup
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          onSelect={handleExport}
        />
      </div>
    </Panel>
  );
};

const ToolbarButton = ({
  icon: Icon,
  isActive,
  onClick,
  label, // For Category Tooltips
  nodes, // For Previewing inside the tooltip
  tooltip, // For simple actions like "Take Screenshot"
  color = "text-neutral/60",
  isFilled = false,
}: any) => (
  <button
    onClick={onClick}
    style={{ pointerEvents: "auto" }}
    className={`relative p-3 rounded-xl transition-all group outline-none ${isActive ? "bg-primary" : color}`}
  >
    <Icon
      size={22}
      strokeWidth={2.2}
      fill={isFilled ? "currentColor" : "none"}
      className={isActive ? "text-white" : "group-hover:text-neutral"}
    />

    {/* TOOLTIP LOGIC */}
    <AnimatePresence>
      {!isActive && (
        <motion.div
          initial={{ x: 10, scale: 0.95 }}
          animate={{ x: 0, scale: 1 }}
          exit={{ x: 0, scale: 0.95 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="
        absolute right-full mr-4 p-3 rounded-xl
        bg-panel border border-border shadow-2xl
        pointer-events-none z-50 min-w-30

        opacity-0
        group-hover:opacity-100
      "
        >
          {/* Header for Category Tooltip */}
          {label && (
            <span className="text-[9px] font-black text-primary uppercase tracking-tighter border-b border-border/50 pb-1 mb-2 block">
              {label}
            </span>
          )}

          {/* Simple Text Tooltip */}
          {tooltip && (
            <span className="text-[10px] font-bold text-neutral whitespace-nowrap">
              {tooltip}
            </span>
          )}

          {/* Category Preview (The "Insides") */}
          {nodes && (
            <div className="flex flex-col gap-1.5">
              {nodes.map((node: any) => (
                <div
                  key={node.type}
                  className="flex items-center gap-2 opacity-80"
                >
                  <node.icon
                    size={12}
                    strokeWidth={2.5}
                    className="text-neutral"
                  />
                  <span className="text-[10px] font-medium text-neutral lowercase">
                    {node.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>

    {/* Active Indicator Bar */}
    {isActive && (
      <motion.div
        layoutId="active-pill"
        className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-5 bg-neutral rounded-l-full"
      />
    )}
  </button>
);
