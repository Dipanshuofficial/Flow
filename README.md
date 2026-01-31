# Ostrich Flow

**Visual node-based workflow builder for AI and automation pipelines**

Ostrich Flow is a full-stack monorepo containing a visual workflow editor (React + TypeScript) and a FastAPI backend service for workflow transpilation and execution. Build complex workflows using a drag-and-drop canvas, then export them to popular automation platforms like n8n, Make, and Zapier.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Ostrich Flow provides a complete visual workflow design and execution platform:

### Frontend (Client)
A React-based canvas editor built on XY Flow that allows users to:
- Drag and drop 9 different node types onto an interactive canvas
- Connect nodes with animated edges to build data pipelines
- Export workflow graphs as JSON for backend processing
- Capture workflow diagrams as PNG screenshots
- Toggle between light and dark themes

### Backend (Server)
A FastAPI service deployed on Cloudflare Workers that:
- Validates workflow DAG structure (cycle detection, orphan nodes)
- Transpiles workflows to platform-specific formats (n8n, Make, Zapier)
- Provides RESTful API endpoints for workflow export
- Returns downloadable JSON configuration files

### Supported Node Types

| Node | Purpose | Handles |
|------|---------|---------|
| Input | Entry point for data | 1 output |
| Output | Final result capture | 1 input |
| LLM | AI model processing | System + Prompt inputs, Response output |
| Text | Template with variable substitution | 1 output |
| Condition | Branching logic (True/False paths) | 1 input, 2 outputs |
| Merge | Join multiple paths | Multiple inputs, 1 output |
| Loop | Iteration control | 1 input, 1 output |
| Delay | Temporal pause (milliseconds) | 1 input, 1 output |
| DataLog | Debugging and logging | 1 input, 1 output |

---

## Architecture

### Frontend Architecture

```
App
├── ToastProvider (global notification context)
├── ReactFlowProvider (XY Flow canvas context)
│   ├── PipelineToolbar (node palette + controls)
│   │   ├── Category buttons (General, I/O, Logic, Flow)
│   │   ├── DraggableNode wrappers
│   │   ├── Clear canvas button
│   │   └── Screenshot capture button
│   └── PipelineUI (main workflow canvas)
│       ├── ReactFlow canvas with nodes and edges
│       ├── CustomEdge (animated connections)
│       ├── ControlsPanel (node property inspector)
│       └── PlatformPopup (export destination selector)
```

**State Management**
Zustand store manages all UI state:
- Node and edge collections
- ID counters per node type
- Selected nodes and edges
- Error states for validation

**Persistence**
Workflow state is automatically persisted to LocalStorage and restored on page load, including viewport position.

### Backend Architecture

```
FastAPI Application
├── / (root endpoint - health check)
├── /health (health status)
└── /export/{platform} (workflow transpilation)
    ├── Validation layer (DAG checks)
    └── Driver selection
        ├── N8NDriver
        ├── MakeDriver
        └── ZapierDriver
```

**Driver Pattern**
The backend uses an abstract base class pattern for platform-specific transpilation:
- `BaseDriver`: Abstract interface defining `generate()` method
- Platform drivers: Implement platform-specific JSON generation
- Validation: Pre-export DAG validation (cycles, orphans, empty pipelines)

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2 | UI framework |
| TypeScript | 5.9 | Type-safe development |
| Vite | 7.2 | Build tool and dev server |
| TailwindCSS | 4.1 | Utility-first styling |
| XY Flow | 12.10 | Node graph canvas library |
| Zustand | 5.x | State management |
| Framer Motion | 12.x | Smooth animations |
| Bun | 1.x | Package manager |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.11+ | Runtime language |
| FastAPI | 0.128 | Web framework |
| Pydantic | 2.12 | Data validation |
| Uvicorn | 0.40 | ASGI server (local dev) |
| Cloudflare Workers | - | Production deployment |

---

## Quick Start

### Prerequisites

1. **Bun** (for frontend):
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Python 3.11+** (for backend)

3. **Wrangler CLI** (for Cloudflare deployment):
   ```bash
   npm install -g wrangler
   ```

### Frontend Setup

```bash
cd client

# Install dependencies
bun install

# Start development server
bun run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd server

# Install Python dependencies
pip install -r requirements.txt

# Start local development server
python main.py
# Or: uvicorn main:app --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`

### Running Both Together

For full-stack development:

```bash
# Terminal 1 - Frontend
cd client && bun run dev

# Terminal 2 - Backend
cd server && python main.py
```

The frontend is pre-configured to communicate with `http://localhost:8000` for API calls.

---

## Project Structure

```
ostrich-flow/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── App.tsx             # Root application component
│   │   │   ├── BaseNode.tsx        # Reusable node component
│   │   │   ├── ControlsPanel.tsx   # Node inspector panel
│   │   │   ├── CustomEdge.tsx      # Animated edge component
│   │   │   ├── DraggableNode.tsx   # Drag-and-drop wrapper
│   │   │   ├── PlatformPopup.tsx   # Export platform selector
│   │   │   ├── Store.tsx           # Zustand state management
│   │   │   ├── Toolbar.tsx         # Node palette
│   │   │   └── Ui.tsx              # Main canvas component
│   │   ├── nodes/                   # Node type implementations
│   │   │   ├── conditionNode.tsx
│   │   │   ├── dataLogNode.tsx
│   │   │   ├── delayNode.tsx
│   │   │   ├── inputNode.tsx
│   │   │   ├── llmNode.tsx
│   │   │   ├── loopNode.tsx
│   │   │   ├── mergeNode.tsx
│   │   │   ├── outputNode.tsx
│   │   │   └── textNode.tsx
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── ToastProvider.tsx
│   │   │   ├── useScreenshot.ts
│   │   │   └── useTheme.ts
│   │   ├── utils/                   # Utility functions
│   │   │   ├── icons.ts
│   │   │   └── submit.ts
│   │   ├── persistence/             # LocalStorage persistence
│   │   │   ├── index.ts
│   │   │   ├── scheduler.ts
│   │   │   └── snapshot.ts
│   │   ├── theme/                   # Theme provider
│   │   │   └── themeProvider.tsx
│   │   ├── styles/                  # CSS files
│   │   │   └── baseNode.css
│   │   └── main.tsx                 # Application entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── eslint.config.js
│   └── tailwind.config.ts
│
├── server/                          # Backend FastAPI service
│   ├── drivers/                     # Platform transpilation drivers
│   │   ├── __init__.py
│   │   ├── base_driver.py          # Abstract driver interface
│   │   ├── make_driver.py          # Make.com driver
│   │   ├── n8n_driver.py           # n8n driver
│   │   └── zapier_driver.py        # Zapier driver
│   ├── main.py                      # FastAPI application
│   ├── schemas.py                   # Pydantic data models
│   ├── validator.py                 # Pipeline validation logic
│   ├── requirements.txt             # Python dependencies
│   ├── runtime.txt                  # Python version spec
│   └── wrangler.jsonc               # Cloudflare Workers config
│
└── README.md
```

---

## API Documentation

The backend exposes a RESTful API for workflow export.

### Endpoints

#### Health Check
```
GET /
GET /health
```

Returns API status and version information.

**Response:**
```json
{
  "message": "Ostrich Flow API is running",
  "version": "1.0.0",
  "docs": "/docs"
}
```

#### Export Workflow
```
POST /export/{platform}
```

Transpiles a React Flow workflow to the specified platform format.

**Path Parameters:**
- `platform`: Target platform (`n8n`, `make`, `zapier`)

**Request Body:**
```json
{
  "nodes": [
    {
      "id": "input-1",
      "type": "input",
      "position": {"x": 0, "y": 0},
      "data": {}
    }
  ],
  "edges": [
    {
      "id": "e1-2",
      "source": "input-1",
      "target": "llm-1",
      "sourceHandle": null,
      "targetHandle": null
    }
  ]
}
```

**Response:**
Returns a downloadable JSON file with platform-specific configuration.

**Error Responses:**
- `400 Bad Request`: Invalid workflow (empty, cycles, or orphans)
- `400 Bad Request`: Unsupported platform
- `500 Internal Server Error`: Processing error

### Interactive Documentation

When running the backend locally, access the interactive API docs at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## Development

### Frontend Development

#### Available Scripts

```bash
cd client

# Start development server with hot reload
bun run dev

# Type check and build for production
bun run build

# Run ESLint
bun run lint

# Fix ESLint issues automatically
bun run lint -- --fix

# Preview production build locally
bun run preview
```

#### Code Style Guidelines

**TypeScript:**
- Strict mode enabled - no implicit `any`, strict null checks
- Use `type` imports: `import type { NodeProps } from "@xyflow/react"`
- Explicit return types on exported functions
- No unused locals or parameters

**Imports (ordered):**
1. External libraries (React, etc.)
2. External type imports
3. Internal absolute imports
4. Internal relative imports
5. Internal type imports

**Naming:**
- Components: PascalCase (`TextNode`, `BaseNode`)
- Hooks: camelCase with `use` prefix (`useStore`, `useTheme`)
- Types/Interfaces: PascalCase (`NodeHandle`, `StoreState`)
- Files: PascalCase for components, camelCase for utilities

**Styling:**
- TailwindCSS v4 with CSS custom properties
- Brand colors via CSS variables: `--brand-primary`, `--brand-neutral`
- Utility classes: `bg-panel`, `border-border`, `text-primary`

### Backend Development

#### Python Code Style

**Type Hints:**
All function signatures must include type hints:
```python
from typing import List, Dict, Any

def generate(self, nodes: List[RFNode], edges: List[RFEdge]) -> Dict[str, Any]:
    ...
```

**Pydantic v2:**
Use `ConfigDict` for model configuration:
```python
from pydantic import BaseModel, ConfigDict

class PipelineRequest(BaseModel):
    nodes: List[RFNode]
    edges: List[RFEdge]
    
    model_config = ConfigDict(json_schema_extra={...})
```

**Imports (ordered):**
1. Standard library imports
2. Third-party imports
3. Local module imports

**Driver Pattern:**
New platform drivers must:
1. Inherit from `BaseDriver` (ABC)
2. Implement `generate(nodes, edges) -> Dict[str, Any]`
3. Return platform-specific JSON structure

#### Local Development

```bash
cd server

# Install dependencies
pip install -r requirements.txt

# Run development server
python main.py

# Server will start on http://localhost:8000
```

The server includes CORS configuration for local development, allowing requests from `http://localhost:5173`.

---

## Deployment

### Frontend Deployment

The frontend is a static Vite application that can be deployed to any static hosting service:

```bash
cd client
bun run build
```

This creates a `dist/` directory with optimized assets ready for deployment to:
- Vercel
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront
- GitHub Pages

### Backend Deployment (Cloudflare Workers)

The backend is configured for Cloudflare Workers deployment using Wrangler:

1. **Login to Wrangler:**
   ```bash
   wrangler login
   ```

2. **Configure secrets (if needed):**
   ```bash
   wrangler secret put SECRET_NAME
   ```

3. **Deploy:**
   ```bash
   cd server
   wrangler deploy
   ```

The `wrangler.jsonc` file configures:
- Python Workers compatibility
- Entry point (`main:app`)
- Compatibility date (2026-01-26)

### Environment Variables

**Frontend (`.env.local`):**
```bash
# API endpoint for workflow export
VITE_API_ENDPOINT=https://your-api.workers.dev
```

**Backend (Wrangler secrets):**
```bash
# Set via: wrangler secret put SECRET_NAME
# Available in Python: os.environ.get("SECRET_NAME")
```

---

## Contributing

We welcome contributions to Ostrich Flow. Please follow these guidelines:

### Development Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make changes:**
   - Follow code style guidelines
   - Add type hints to Python code
   - Use explicit types in TypeScript

3. **Test locally:**
   ```bash
   # Frontend
   cd client && bun run lint && bun run build
   
   # Backend
   cd server && python -m py_compile main.py schemas.py validator.py
   ```

4. **Commit with clear messages:**
   ```bash
   git commit -m "feat: add new node type for webhook triggers"
   ```

5. **Push and create pull request:**
   ```bash
   git push origin feat/your-feature-name
   ```

### Pull Request Checklist

- [ ] TypeScript compiles without errors (`bun run build`)
- [ ] ESLint passes (`bun run lint`)
- [ ] Python files compile without syntax errors
- [ ] No console warnings in browser
- [ ] Backend health check passes
- [ ] Manual testing completed

### Contribution Areas

- **UI/UX**: Node design improvements, canvas interactions, accessibility
- **Features**: New node types, additional export platforms, workflow templates
- **Backend**: New platform drivers, validation rules, API endpoints
- **Documentation**: Examples, guides, API documentation
- **Bug Fixes**: Edge cases, error handling, performance optimizations

### Code Review

All PRs require review before merging. Reviewers will check:
- Code style consistency
- Type safety
- Error handling
- Performance implications
- Documentation updates

---

## License

MIT License - see LICENSE file for details.

---

## Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Check existing documentation
- Review the API documentation at `/docs` when running locally

---

**Built with React, FastAPI, and XY Flow.**
