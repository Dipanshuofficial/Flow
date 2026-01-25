import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Infinity } from "lucide-react";
import { useTheme } from "../theme/themeProvider"; // Ensure this path is correct

const N8NIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className="w-6 h-6"
  >
    <path d="M4 4h16v16H4zM12 4v16M4 12h16" />
  </svg>
);

interface PlatformPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}

export const PlatformPopup = ({
  isOpen,
  onClose,
  onSelect,
}: PlatformPopupProps) => {
  // 1. Get the current theme string ('dark' or 'light')
  const { theme } = useTheme();

  const platforms = [
    {
      id: "n8n",
      label: "n8n",
      icon: N8NIcon,
      hoverClass: "group-hover:border-primary hover:bg-secondary ",
    },
    {
      id: "zapier",
      label: "Zapier",
      icon: Zap,
      hoverClass: "group-hover:border-primary hover:bg-secondary ",
    },
    {
      id: "make",
      label: "Make",
      icon: Infinity,
      hoverClass: "group-hover:border-primary hover:bg-secondary",
    },
  ];

  if (typeof document === "undefined") return null;

  return ReactDOM.createPortal(
    /* 2. CRITICAL FIX: Wrap the portal content in a div that applies the current 'theme' class.
       This ensures the CSS variables (bg-panel, text-main) resolve correctly 
       even though the Portal renders outside the main app root.
    */
    <div className={theme}>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-2000"
            />

            {/* Modal Container */}
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-2001">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                // Using semantic color variables defined in your index.css
                className="w-full max-w-sm bg-panel border border-border shadow-2xl rounded-3xl p-6 pointer-events-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-black text-neutral opacity-50 uppercase tracking-widest">
                    Select Destination
                  </span>
                  <button
                    onClick={onClose}
                    className="p-1.5 text-primary hover:bg-secondary rounded-full transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {platforms.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelect(p.id);
                        onClose();
                      }}
                      className={`
                        flex flex-col items-center gap-3 p-4 rounded-2xl transition-all group
                        bg-transparent border border-transparent
                        ${p.hoverClass}
                      `}
                    >
                      {/* Icon Box */}
                      <div className="w-12 h-12 flex items-center justify-center bg-surface border border-border rounded-xl transition-colors text-neutral group-hover:border-current">
                        <p.icon />
                      </div>

                      {/* Label */}
                      <span className="text-[10px] font-bold uppercase text-neutral group-hover:text-main transition-colors">
                        {p.label}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
};
