import { useState, useRef, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  MiniMap,
  type ReactFlowInstance,
  BackgroundVariant,
} from "@xyflow/react";
import { useStore } from "../components/Store";

import { TextNode } from "../nodes/textNode";
import { ConditionNode } from "../nodes/conditionNode";
import { DataLogNode } from "../nodes/dataLogNode";
import { InputNode } from "../nodes/inputNode";
import { LLMNode } from "../nodes/llmNode";
import { LoopNode } from "../nodes/loopNode";
import { MergeNode } from "../nodes/mergeNode";
import { OutputNode } from "../nodes/outputNode";
import { DelayNode } from "../nodes/delayNode";
import { CustomControls } from "./ControlsPanel";
import Header from "./header";
import { CustomEdge } from "./CustomEdge";
import { restoreFlow } from "../persistence";
import toast from "react-hot-toast";

const nodeTypes = {
  text: TextNode,
  condition: ConditionNode,
  dataLog: DataLogNode,
  customInput: InputNode,
  llm: LLMNode,
  loopNode: LoopNode,
  mergeNode: MergeNode,
  customOutput: OutputNode,
  delayNode: DelayNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export const PipelineUI = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const hasRestored = useRef(false);

  useEffect(() => {
    const savedData = restoreFlow();
    if (
      savedData &&
      savedData.nodes &&
      savedData.nodes.length > 0 &&
      !hasRestored.current
    ) {
      toast.success("Previous session restored!");
      hasRestored.current = true;
    } else if (savedData) {
      // If it was just an empty state, mark as "restored" so we don't check again
      hasRestored.current = true;
    }
  }, []);
  const [instance, setInstance] = useState<ReactFlowInstance | null>(null);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    getNodeID,
  } = useStore();

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const rawData = e.dataTransfer.getData("application/reactflow");
      if (!rawData || !instance) return;

      let type: string;
      try {
        const parsed = JSON.parse(rawData);
        type = parsed.nodeType || parsed.type || rawData;
      } catch {
        type = rawData;
      }

      const position = instance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      const id = getNodeID(type);
      const newNode = {
        id,
        type,
        position,
        data: { label: `${type} node` },
      };

      addNode(newNode);
    },
    [instance, addNode, getNodeID],
  );
  const [isLocked, setIsLocked] = useState(false);
  const proOpts = { hideAttribution: true };

  /* --- AMBER THEME MINIMAP CONFIG --- */
  // We use CSS variables here so it responds to light/dark mode instantly
  const miniMapStyle = {
    backgroundColor: "var(--bg-panel)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
    height: 120,
    width: 160,
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-surface">
      <div ref={reactFlowWrapper} className="grow relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setInstance}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          zoomOnScroll={!isLocked}
          zoomOnPinch={!isLocked}
          zoomOnDoubleClick={false}
          panOnScroll={!isLocked}
          panOnDrag={!isLocked}
          preventScrolling={isLocked}
          proOptions={proOpts}
        >
          {/* Dot Grid using the theme's border color */}
          <Background
            gap={20}
            size={1.5}
            color="var(--brand-neutral)"
            className="opacity-50"
            variant={BackgroundVariant.Dots}
          />
          <Header />
          <CustomControls
            isLocked={isLocked}
            toggleLock={() => setIsLocked(!isLocked)}
          />

          <MiniMap
            style={miniMapStyle}
            /* Nodes in MiniMap use your Primary Orange */
            nodeColor={() => "#FA8112"}
            /* Mask color uses secondary sand with low opacity */
            maskColor="rgba(245, 231, 198, 0.2)"
            nodeStrokeWidth={3}
            pannable
            zoomable
          />
        </ReactFlow>
      </div>
    </div>
  );
};
