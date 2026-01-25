import React, { type DragEvent, type ReactNode } from "react";

interface DraggableNodeProps {
  type: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const DraggableNode: React.FC<DraggableNodeProps> = ({
  type,
  children,
  className,
}) => {
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    const appData = { nodeType };

    // Set cursor state visually
    (event.target as HTMLDivElement).style.cursor = "grabbing";

    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(appData),
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragEnd = (event: DragEvent<HTMLDivElement>) => {
    (event.target as HTMLDivElement).style.cursor = "grab";
  };

  return (
    <div
      /* Combined logic:
         - Default styles use your Sand (secondary) and Orange (primary)
         - bg-surface and border-border ensure it looks right in the sidebar
         - hover:border-primary adds that safety orange glow on hover
      */
      className={`
        flex flex-col items-center justify-center 
        p-4 rounded-xl transition-all cursor-grab
        bg-surface border-2 border-border text-neutral
        hover:border-primary hover:shadow-lg
        ${className}
      `}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={onDragEnd}
      draggable
    >
      <div className="flex flex-col items-center gap-2 pointer-events-none">
        {children}
      </div>
    </div>
  );
};
