import toast, { Toaster, resolveValue } from "react-hot-toast";
import { X } from "lucide-react";

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-center" // Moves toast to top center
      containerStyle={{
        top: 40,
      }}
      toastOptions={{
        duration: 4000,
      }}
    >
      {(t) => (
        <div
          className={`
            relative flex items-center min-w-[320px] max-w-md
            bg-(--bg-panel) border border-(--border-color) 
            rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]
            node-entrance-anim overflow-hidden
          `}
          style={{
            opacity: t.visible ? 1 : 0,
          }}
        >
          {/* ⏳ Time-remaining Green Overlay */}
          <div
            className="absolute bottom-0 left-0 h-0.75 bg-green-500 shadow-[0_0_10px_#22c55e]"
            style={{
              animation: t.visible
                ? `shrink ${t.duration}ms linear forwards`
                : "none",
            }}
          />

          <div className="flex p-4 w-full items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Status Indicator Dot */}
              <div
                className={`w-2 h-2 rounded-full ${
                  t.type === "error" ? "bg-red-500" : "bg-(--brand-primary)"
                } animate-pulse`}
              />

              <div className="text-(--text-base) font-medium tracking-tight">
                {resolveValue(t.message, t)}
              </div>
            </div>

            {/* ✖ Creative Close Button */}
            <button
              onClick={() => toast.dismiss(t.id)}
              className={`
                group relative p-1.5 rounded-lg border border-transparent
                hover:border-(--border-color) hover:bg-(--bg-surface)
                transition-all duration-200 active:scale-90
              `}
            >
              <X
                size={14}
                className="text-(--brand-neutral) group-hover:text-(--brand-primary)"
              />
              <div className="absolute inset-0 rounded-lg bg-(--brand-primary) opacity-0 group-hover:opacity-5 blur-md" />
            </button>
          </div>
        </div>
      )}
    </Toaster>
  );
};
