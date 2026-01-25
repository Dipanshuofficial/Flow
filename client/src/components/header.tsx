import { Panel, useReactFlow } from "@xyflow/react";
import { motion } from "framer-motion";
import { useEffect } from "react";

const Header = () => {
  const { getNodes, fitView } = useReactFlow();

  const handleSmartCenter = () => {
    fitView({
      nodes: getNodes(),
      duration: 800,
      padding: 0.2,
      minZoom: 0.8,
      maxZoom: 1,
    });
  };
  useEffect(() => {
    // We use a small timeout to ensure the nodes are fully rendered
    // on the canvas before the camera tries to find them.
    const timer = setTimeout(() => {
      handleSmartCenter();
    }, 50); // 50ms is usually enough

    return () => clearTimeout(timer); // Cleanup
  }, []); // <--- Empty dependency array [] means "run once on reload"
  return (
    <Panel position="top-left" className="m-6 select-none pointer-events-none">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleSmartCenter}
        className={`
          
          group flex items-center gap-3 py-2.5 px-5 
          pointer-events-auto cursor-pointer
          
          
          bg-panel/80 backdrop-blur-xl border border-border/50 
          shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl
          
          
          before:absolute before:inset-0 before:rounded-2xl 
          before:border-t before:border-white/10 before:pointer-events-none
        `}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_var(--color-primary)]" />

        <span className="text-sm font-black tracking-tighter text-neutral/90 antialiased uppercase">
          Ostrich <span className="text-primary/80">Flow</span>
        </span>

        <div className="ml-2 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] text-neutral/40 font-mono">
          CENTER
        </div>
      </motion.div>
    </Panel>
  );
};

export default Header;
