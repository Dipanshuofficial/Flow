// persistence/snapshot.ts
export interface FlowSnapshot {
  nodes: any[];
  edges: any[];
  viewport?: { x: number; y: number; zoom: number };
}

export const serialize = (state: any): FlowSnapshot => ({
  nodes: state.nodes,
  edges: state.edges,
  viewport: state.viewport,
});

export const deserialize = (raw: FlowSnapshot) => raw;
