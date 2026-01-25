# Ostrich Flow

> **Visual node-based workflow builder for AI and automation pipelines.** Design complex workflows in the browser, then send to your backend for execution.

![Status](https://img.shields.io/badge/status-beta-yellow)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/typescript-5.9-blue)
![React](https://img.shields.io/badge/react-19-61dafb?logo=react)
![Bun](https://img.shields.io/badge/package%20manager-bun-f471f5)

---

## Overview

Ostrich Flow is a **visual node-based workflow editor** built with React and XY Flow. Drag nodes onto a canvas, connect them to build complex pipelines, and export the graph structure as JSON to your backend. The frontend handles UI and serialization—your backend (FastAPI, Node.js, etc.) handles execution.

### Core Use Cases

- **AI Workflow Builders**: Visualize and chain LLM calls with conditional branching
- **ETL/Data Pipelines**: Model data transformations before implementing
- **Decision Trees**: Build rule-based routing logic
- **Business Process Modeling**: Design multi-step workflows
- **Integration Orchestration**: Visualize API chains and data flows

---

## Key Features

| Feature                  | Description                                                      |
| ------------------------ | ---------------------------------------------------------------- |
| **Drag-and-Drop Canvas** | XY Flow-powered interactive graph editor                         |
| **9 Node Types**         | Input, Output, LLM, Condition, Merge, Loop, Delay, DataLog, Text |
| **Graph Serialization**  | Export nodes/edges as JSON for backend processing                |
| **Cycle Detection**      | Validate DAG structure before submission                         |
| **Custom Edges**         | Animated connections with visual feedback                        |
| **Theme Support**        | Dark/light mode with CSS variables                               |
| **Screenshot Export**    | Capture workflow diagrams as PNG images                          |
| **Type-Safe**            | Full TypeScript with React Flow types                            |
| **Toast Notifications**  | User feedback via React Hot Toast & Sonner                       |

---

## Tech Stack

### **Frontend**

- **React 19** — Latest UI framework
- **TypeScript 5.9** — Type-safe development
- **Vite 7** — Fast build tool with SWC transpilation
- **TailwindCSS 4** — Utility-first styling
- **XY Flow 12** — Professional node graph library
- **Framer Motion** — Smooth animations
- **React Hot Toast & Sonner** — Toast notifications
- **Lucide React** — Consistent icon library
- **html-to-image** — Screenshot capture

### **Package Manager & Dev Tools**

- **Bun** — Fast package manager and runtime
- **ESLint 9** — Code quality with React Hooks & TypeScript plugins
- **TypeScript ESLint** — Strict linting

### **Planned: Backend Integration**

- **FastAPI** — Python web framework for workflow execution
- **WebSocket Support** — Real-time updates to frontend

---

## Technical Architecture

### State Management: Zustand Store

All UI state (nodes, edges, selected items) lives in [src/components/Store.tsx](src/components/Store.tsx) using Zustand:

```typescript
interface StoreState {
  nodes: Node[]; // XY Flow node definitions
  edges: Edge[]; // Connections between nodes
  nodeIDs: Record<string, number>; // ID counter per node type

  // Methods
  getNodeID: (type: string) => string;
  addNode: (node: Node) => void;
  deleteNode: (nodeId: string) => void;
  deleteAllNodes: () => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  updateNodeField: (nodeId, fieldName, value) => void;
  deleteEdge: (edgeId: string) => void;
  updateEdgeLabel: (edgeId, label) => void;
  updateEdgeAnimation: (edgeId, animated) => void;
}
```

**Why Zustand?**

- Minimal boilerplate for graph state mutations
- Real-time UI updates without external polling
- Single source of truth for serialization

### Component Structure

```
App
├── ToastProvider (global notification context)
├── ReactFlowProvider (XY Flow context)
│   ├── PipelineToolbar (node palette + controls)
│   │   ├── Category buttons (General, I/O, Logic, Flow)
│   │   ├── DraggableNode wrappers
│   │   ├── Clear canvas button
│   │   └── Screenshot button
│   └── PipelineUI (main workflow area)
│       ├── ReactFlow canvas
│       │   ├── Nodes (rendered from store)
│       │   ├── CustomEdge (animated connections)
│       │   └── Controls
│       ├── ControlsPanel (node inspector)
│       └── SubmitButton (serialize & send to backend)
```

### Node Types & Handles

Each node is a React component that accepts `NodeProps` from XY Flow:

| Node Type     | Handles (In/Out)           | Purpose                               |
| ------------- | -------------------------- | ------------------------------------- |
| **Input**     | Output only                | User input or API payload entry point |
| **Output**    | Input only                 | Final workflow result                 |
| **LLM**       | System + Prompt → Response | AI model processing                   |
| **Condition** | Input → True/False paths   | Branching logic                       |
| **Merge**     | Multiple inputs → Output   | Join multiple paths                   |
| **Loop**      | Input → Output             | Iteration control (max configurable)  |
| **Delay**     | Input → Output             | Temporal pause (milliseconds)         |
| **DataLog**   | Input → Output             | Debugging/logging intermediate values |
| **Text**      | Output only                | Static text content                   |

### Data Flow: From Canvas to Backend

```
1. User drags nodes and connects them
   ↓
2. Store updates with nodes[] and edges[]
   ↓
3. User clicks "Submit Pipeline"
   ↓
4. SubmitButton serializes graph:
   - Collects nodes from ReactFlow
   - Collects edges from ReactFlow
   - POSTs to backend: { nodes, edges }
   ↓
5. Backend validates DAG, executes workflow
   ↓
6. Response returns to frontend
   ↓
7. Toast notification shows result
```

### Backend Integration

The frontend currently sends workflow graphs to a backend endpoint:

```typescript
// SubmitButton.tsx
fetch("http://localhost:8000/pipelines/parse", {
  method: "POST",
  body: JSON.stringify({ nodes, edges }),
});
```

The backend receives the full graph and is responsible for:

- Validating the DAG structure
- Resolving node dependencies
- Executing nodes in correct order
- Handling variable substitution
- Managing timeouts and retries
- Returning results

---

## Quick Start

### Prerequisites

Install **Bun** (3x faster than npm):

```bash
curl -fsSL https://bun.sh/install | bash
```

### Installation

```bash
# Clone and install
git clone <your-repo-url>
cd ostrich-flow
bun install

# Start dev server
bun run dev
```

Visit [http://localhost:5173](http://localhost:5173).

### Your First Workflow

1. Click **General** in the toolbar → Drag an **LLM** node onto the canvas
2. Click **I/O** → Drag an **Input** node and **Output** node
3. Connect: Input → LLM → Output (drag from handles)
4. Click **Submit Pipeline** button
5. Check your backend logs (should receive nodes/edges JSON)

### Build for Production

```bash
bun run build
```

Output goes to `dist/` (optimized and minified).

---

## Configuration

### Environment Variables

Create `.env.local`:

```bash
# Backend endpoint for "Submit Pipeline"
VITE_API_ENDPOINT=http://localhost:8000

# Optional: API key for external services
VITE_LLM_API_KEY=your_key_here
```

### Node Palette Customization

Edit [src/components/Toolbar.tsx](src/components/Toolbar.tsx) to add/remove node types:

```typescript
const NODE_DATA: Record<CategoryId, NodeDefinition[]> = {
  General: [
    { type: "llm", label: "LLM", icon: Cpu },
    { type: "text", label: "Text", icon: Type },
    // Add custom node types here
  ],
  // ... more categories
};
```

### Styling

All colors and themes are defined in CSS variables. Edit `src/index.css` for custom theming.

---

## Project Structure

```
ostrich-flow/
├── src/
│   ├── components/
│   │   ├── Store.tsx              # Zustand state (core)
│   │   ├── Ui.tsx                 # Main canvas wrapper
│   │   ├── ControlsPanel.tsx       # Node property editor
│   │   ├── Toolbar.tsx             # Node palette + controls
│   │   ├── DraggableNode.tsx       # Draggable node wrapper
│   │   ├── CustomEdge.tsx          # Animated edge renderer
│   │   ├── BaseNode.tsx            # Reusable node component
│   │   ├── SubmitButton.tsx        # Send workflow to backend
│   │   └── header.tsx              # Header component
│   │
│   ├── nodes/                      # Node type implementations
│   │   ├── inputNode.tsx
│   │   ├── outputNode.tsx
│   │   ├── llmNode.tsx
│   │   ├── conditionNode.tsx
│   │   ├── mergeNode.tsx
│   │   ├── loopNode.tsx
│   │   ├── delayNode.tsx
│   │   ├── dataLogNode.tsx
│   │   └── textNode.tsx
│   │
│   ├── hooks/
│   │   ├── useTheme.ts             # Dark/light mode hook
│   │   ├── useScreenshot.ts        # Capture canvas as image
│   │   └── ToastProvider.tsx       # Notification context
│   │
│   ├── theme/
│   │   └── themeProvider.tsx       # Theme logic
│   │
│   ├── utils/
│   │   └── icons.ts                # Icon mapping
│   │
│   ├── styles/
│   │   └── baseNode.css            # Node styling
│   │
│   ├── App.tsx                     # Root component
│   ├── main.tsx                    # Vite entry point
│   └── index.css                   # Global styles
│
├── public/                         # Static files
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── eslint.config.js
└── package.json
```

### Key Files

| File                                                               | Purpose                         |
| ------------------------------------------------------------------ | ------------------------------- |
| [src/components/Store.tsx](src/components/Store.tsx)               | Zustand state management        |
| [src/components/SubmitButton.tsx](src/components/SubmitButton.tsx) | Backend integration point       |
| [src/components/Toolbar.tsx](src/components/Toolbar.tsx)           | Node palette definition         |
| [src/nodes/\*.tsx](src/nodes/)                                     | Individual node implementations |

---

## Development

### Commands

```bash
# Development with hot reload
bun run dev

# Type check
bun run build

# Lint code
bun run lint

# Fix lint issues
bun run lint --fix

# Preview production build
bun run preview
```

### Code Style

- **TypeScript**: Strict mode enabled in `tsconfig.json`
- **ESLint**: React Hooks plugin + TypeScript ESLint
- **Components**: PascalCase (e.g., `LLMNode`)
- **Functions**: camelCase (e.g., `getNodeID`)
- **CSS**: TailwindCSS utilities + custom CSS variables

---

## Contributing

We welcome contributions! Here's how:

### Setup

```bash
bun install
bun run dev
```

### Workflow

1. Create a feature branch:

   ```bash
   git checkout -b feat/your-feature
   ```

2. Make changes and test locally

   ```bash
   bun run lint --fix
   bun run build
   ```

3. Commit with clear messages:

   ```bash
   git commit -m "feat: add custom node type support"
   ```

4. Push and open a pull request:
   ```bash
   git push origin feat/your-feature
   ```

### PR Checklist

- [ ] TypeScript compiles without errors
- [ ] ESLint passes (`bun run lint`)
- [ ] No console warnings
- [ ] Components are documented
- [ ] Manual testing completed

### Contribution Areas

- 🎨 **UI/UX**: Node design, canvas interactions, accessibility
- 🔧 **Features**: New node types, backend integrations, export formats
- 📖 **Docs**: Examples, guides, API documentation
- 🐛 **Bugs**: Edge cases, error handling, performance
- 🧪 **Testing**: Unit tests, integration tests

---

## Roadmap

- [ ] **v0.1**: Core node-based editor (current)
- [ ] **v0.2**: FastAPI backend integration example
- [ ] **v0.3**: Custom node creation UI
- [ ] **v0.4**: Workflow templates & examples
- [ ] **v0.5**: Team collaboration features
- [ ] **v1.0**: Production-ready marketplace

---

## License

MIT — See [LICENSE](LICENSE) for details.

---


**Built with React, Bun, and XY Flow.**
