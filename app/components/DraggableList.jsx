"use client";

import { useState, useRef, useCallback } from "react";
import { GripVertical } from "lucide-react";

/**
 * DraggableList
 * Wraps any list of items and makes them reorderable via drag-and-drop.
 *
 * Props:
 *   items       – array of items (must have a unique `id` field)
 *   onReorder   – (newItems) => void  called when order changes
 *   renderItem  – (item, index, { dragHandleProps, isDragging }) => ReactNode
 */
const DraggableList = ({ items, onReorder, renderItem }) => {
  const [dragIndex, setDragIndex] = useState(null);   // index being dragged
  const [overIndex, setOverIndex] = useState(null);   // index being hovered over
  const dragNode = useRef(null);

  const handleDragStart = useCallback((e, index) => {
    setDragIndex(index);
    dragNode.current = e.currentTarget;

    // Ghost image: slightly transparent clone
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));

    // Small delay so React state update doesn't cancel the drag
    requestAnimationFrame(() => {
      if (dragNode.current) dragNode.current.style.opacity = "0.4";
    });
  }, []);

  const handleDragEnter = useCallback((e, index) => {
    e.preventDefault();
    if (index !== dragIndex) setOverIndex(index);
  }, [dragIndex]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback((e, dropIndex) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) return;

    const newItems = [...items];
    const [moved] = newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, moved);
    onReorder(newItems);
  }, [dragIndex, items, onReorder]);

  const handleDragEnd = useCallback(() => {
    if (dragNode.current) dragNode.current.style.opacity = "1";
    dragNode.current = null;
    setDragIndex(null);
    setOverIndex(null);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((item, index) => {
        const isDragging = dragIndex === index;
        const isOver = overIndex === index && dragIndex !== index;

        const dragHandleProps = {
          draggable: false, // handle itself isn't draggable; parent row is
          onMouseDown: () => {}, // visual affordance only
          style: {
            cursor: "grab",
            color: "var(--text3)",
            display: "flex",
            alignItems: "center",
            padding: "4px 2px",
            borderRadius: 4,
            transition: "color 0.15s",
            flexShrink: 0,
          },
          onMouseEnter: (e) => { e.currentTarget.style.color = "var(--accent)"; },
          onMouseLeave: (e) => { e.currentTarget.style.color = "var(--text3)"; },
        };

        return (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            style={{
              position: "relative",
              transition: "transform 0.15s ease",
              outline: isOver
                ? "2px solid var(--accent)"
                : "2px solid transparent",
              borderRadius: "var(--radius)",
              transform: isOver
                ? dragIndex !== null && index < dragIndex
                  ? "translateY(-4px)"
                  : "translateY(4px)"
                : "translateY(0)",
            }}
          >
            {/* Drop indicator line above */}
            {isOver && dragIndex > index && (
              <div
                style={{
                  position: "absolute",
                  top: -7,
                  left: 12,
                  right: 12,
                  height: 2,
                  borderRadius: 2,
                  background: "var(--accent)",
                  zIndex: 10,
                  boxShadow: "0 0 8px var(--accent)",
                }}
              />
            )}

            {/* Drop indicator line below */}
            {isOver && dragIndex < index && (
              <div
                style={{
                  position: "absolute",
                  bottom: -7,
                  left: 12,
                  right: 12,
                  height: 2,
                  borderRadius: 2,
                  background: "var(--accent)",
                  zIndex: 10,
                  boxShadow: "0 0 8px var(--accent)",
                }}
              />
            )}

            {/* Drag handle overlay — sits in top-left, not blocking card content */}
            <div
              {...dragHandleProps}
              title="Drag to reorder"
              style={{
                ...dragHandleProps.style,
                position: "absolute",
                top: "50%",
                left: -22,
                transform: "translateY(-50%)",
                opacity: isDragging ? 0 : undefined,
                zIndex: 5,
              }}
            >
              <GripVertical size={14} />
            </div>

            {renderItem(item, index, { dragHandleProps, isDragging, isOver })}
          </div>
        );
      })}
    </div>
  );
};

export default DraggableList;
