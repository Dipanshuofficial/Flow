import { createWithEqualityFn } from "zustand/traditional";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Connection,
  MarkerType,
} from "@xyflow/react";
// Store.ts
import { restoreFlow, persistFlow } from "../persistence";

const restored = restoreFlow();

// 📝 1. Define the Shape of the Store
interface StoreState {
  nodes: Node[];
  edges: Edge[];
  nodeIDs: Record<string, number>; // Track ID counts per type
  getNodeID: (type: string) => string;
  addNode: (node: Node) => void;
  deleteNode: (nodeId: string) => string;
  deleteAllNodes: () => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  updateNodeField: (nodeId: string, fieldName: string, fieldValue: any) => void;
  deleteEdge: (edgeId: string) => void;
  updateEdgeLabel: (edgeId: string, label: string) => void;
  updateEdgeAnimation: (edgeId: string, animated: boolean) => void;
  errorNodeId: string | null;
  setNodeError: (id: string | null) => void;
}

// 🏗️ 2. Create the Store with Types
export const useStore = createWithEqualityFn<StoreState>((set, get) => ({
  nodes: restored?.nodes ?? [],
  edges: restored?.edges ?? [],
  viewport: restored?.viewport,
  nodeIDs: {},
  isExecuting: false,
  executionContext: {},
  errorNodeId: null,

  setNodeError: (id) => set({ errorNodeId: id }),
  // 🆔 ID Generator: Like a ticket dispenser 🎟️
  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  // ➕ Adding Nodes: Pushing a new block onto the stack 🧱
  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },
  // Inside your useStore (Zustand)
  // 🗑️ Delete Node: Removing a block and its connections ✂️
  deleteNode: (nodeId) => {
    set((state) => ({
      // Remove the node itself
      nodes: state.nodes.filter((node) => node.id !== nodeId),

      // Remove any edges connected to this node (Source or Target)
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId,
      ),
    }));
    persistFlow(get);
    return `Node ${nodeId} and its connections were removed.`;
  },
  deleteAllNodes: () => {
    set(() => ({
      nodes: [],
      edges: [],
      nodeIDs: {},
      executionContext: {},
      isExecuting: false,
    }));
    persistFlow(get);
  },
  // 🔄 Change Handlers: Keeping the UI in sync with the state 📡
  onNodesChange: (changes) => {
    // Clear error if any node is moved or removed
    if (get().errorNodeId) set({ errorNodeId: null });

    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    // Clear error if an edge is deleted (which could break a cycle)
    if (get().errorNodeId) set({ errorNodeId: null });

    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  // 🤝 The Handshake: Establishing a link between nodes 🔌
  onConnect: (connection: Connection) => {
    set({ errorNodeId: null });
    set({
      edges: addEdge(
        {
          ...connection,
          type: "custom",
          animated: false,
          style: { stroke: "#FA8112", strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: "#FA8112",
          },
          data: { label: "" },
        },
        get().edges,
      ),
    });
  },

  // ✏️ Field Updater: Surgical precision update 🎯
  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, [fieldName]: fieldValue },
          };
        }
        return node;
      }),
    });
  },

  // 🗑️ Delete Edge: Remove a connection
  deleteEdge: (edgeId) => {
    set({
      edges: get().edges.filter((edge) => edge.id !== edgeId),
    });
  },

  // 🏷️ Update Edge Label
  updateEdgeLabel: (edgeId, label) => {
    set({
      edges: get().edges.map((edge) => {
        if (edge.id === edgeId) {
          return {
            ...edge,
            data: { ...edge.data, label },
          };
        }
        return edge;
      }),
    });
  },

  updateEdgeAnimation: (edgeId, animated) => {
    set({
      edges: get().edges.map((edge) => {
        if (edge.id === edgeId) {
          return {
            ...edge,
            animated,
            style: {
              ...edge.style,
              stroke: animated ? "#3b82f6" : "#FA8112",
            },
          };
        }
        return edge;
      }),
    });
  },
}));
useStore.subscribe((state) => {
  // Pass the current state to our debounced persistence function
  persistFlow(state);
});
