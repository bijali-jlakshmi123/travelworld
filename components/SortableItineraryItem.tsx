"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Clock, MapPin, Trash2 } from "lucide-react";

interface SortableItineraryItemProps {
  id: string;
  item: {
    id: string;
    title: string;
    time: string | null;
    description: string | null;
  };
  onDelete: (id: string) => void;
}

export function SortableItineraryItem({
  id,
  item,
  onDelete,
}: SortableItineraryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group bg-white border ${
        isDragging
          ? "border-blue-400 shadow-xl opacity-75 ring-2 ring-blue-500/20"
          : "border-gray-200 shadow-sm hover:border-blue-300"
      } rounded-xl p-4 flex gap-4 transition-colors`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-center text-gray-400 hover:text-blue-600 cursor-grab active:cursor-grabbing p-1 -ml-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <GripVertical className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1">
              {item.title}
            </h3>
            {item.time && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 mt-1">
                <Clock className="w-3.5 h-3.5" />
                {item.time}
              </div>
            )}
          </div>

          <button
            onClick={() => onDelete(item.id)}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 shrink-0"
            aria-label="Delete item"
            title="Delete item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {item.description && (
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}
