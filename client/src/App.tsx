import { PipelineToolbar } from "./components/Toolbar";
import { PipelineUI } from "./components/Ui";
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ToastProvider } from "./hooks/ToastProvider";

const App = () => {
  return (
    <div className="h-screen w-full scroll-smooth">
      <ToastProvider />
      <ReactFlowProvider>
        <PipelineToolbar />
        <PipelineUI />
      </ReactFlowProvider>
    </div>
  );
};

export default App;
