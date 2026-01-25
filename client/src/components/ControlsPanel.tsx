import {
  useViewport,
  Controls,
  ControlButton,
  useReactFlow,
} from "@xyflow/react";
import { Lock, Moon, Sun, Unlock } from "lucide-react";
import { useTheme } from "../theme/themeProvider";

export const CustomControls = ({
  isLocked,
  toggleLock,
}: {
  isLocked: boolean;
  toggleLock: () => void;
}) => {
  const { zoom } = useViewport();
  const { zoomTo } = useReactFlow();
  const zoomPercentage = Math.round(zoom * 10) * 10;
  const { theme, toggle } = useTheme();

  return (
    <Controls
      showZoom={!isLocked}
      showFitView={!isLocked}
      showInteractive={!isLocked}
      /* We use flex-col to fix alignment and force panel colors */
      className="bg-panel shadow-2xl border-border rounded-xl p-1 flex flex-col gap-1"
    >
      {/* Zoom Display: Styled for high-contrast industrial look */}
      <ControlButton
        title="Zoom Level"
        className="flex items-center justify-center py-2 border-b border-border mb-1"
        onClick={() => {
          zoomTo(1);
        }}
      >
        <span className="text-[10.5px] font-black text-neutral opacity-80 font-mono">
          {zoomPercentage}%
        </span>
      </ControlButton>

      {/* Note: We apply 'rounded-lg!' directly to ControlButtons 
          to override the XYFlow internal 'rounded-sm' 
      */}
      <ControlButton
        onClick={toggleLock}
        title={isLocked ? "Unlock Canvas" : "Lock Canvas"}
        className={`transition-colors rounded-lg border-none ${
          isLocked
            ? "text-white"
            : "bg-panel text-neutral dark:hover:bg-pink-700"
        }`}
      >
        {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
      </ControlButton>

      <ControlButton
        onClick={toggle}
        title="Toggle Theme"
        className="bg text-neutral dark:hover:bg-pink-700 hover:bg-pink-500 transition-colors rounded-lg border-none"
      >
        {theme === "light" ? (
          <Moon size={14} className="" />
        ) : (
          <Sun size={14} className="" />
        )}
      </ControlButton>
    </Controls>
  );
};
