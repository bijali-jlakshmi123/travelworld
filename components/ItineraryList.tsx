"use client";

import { useState, useEffect, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItineraryItem } from "./SortableItineraryItem";
import {
  reorderItineraryItems,
  deleteItineraryItem,
} from "@/app/trips/[id]/actions";
import { MapPin } from "lucide-react";

export type ItineraryItemType = {
  id: string;
  title: string;
  time: string | null;
  description: string | null;
  order: number;
};

interface ItineraryListProps {
  initialItems: ItineraryItemType[];
  tripId: string;
}

export function ItineraryList({ initialItems, tripId }: ItineraryListProps) {
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();

  // Sync state if initialItems change drastically from outside
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require dragging a few pixels to activate (prevents accidental drags when clicking)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && over) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Map new items to an ordering payload to send to the server
        const reorderedPayload = newItems.map((item, index) => ({
          id: item.id,
          order: index,
        }));

        startTransition(async () => {
          await reorderItineraryItems(reorderedPayload, tripId);
        });

        return newItems;
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this stop?")) {
      setItems(items.filter((item) => item.id !== id));
      startTransition(async () => {
        await deleteItineraryItem(id, tripId);
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center bg-gray-50/50">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
          <MapPin className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Your itinerary is empty
        </h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          Start adding places, flights, or activities to build your perfect trip
          plan. Then, drag to rearrange them!
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${isPending ? "opacity-75 relative" : ""}`}>
      {isPending && (
        <div className="absolute top-0 right-0 p-2 z-10 text-blue-600 text-xs font-bold animate-pulse">
          Saving order...
        </div>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableItineraryItem
              key={item.id}
              id={item.id}
              item={item}
              onDelete={handleDelete}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
