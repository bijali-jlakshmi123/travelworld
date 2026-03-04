"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addItineraryItem(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const tripId = formData.get("tripId") as string;
  const title = formData.get("title") as string;
  const time = formData.get("time") as string;
  const description = formData.get("description") as string;

  if (!tripId || !title) return { error: "Missing fields" };

  try {
    const existingItems = await prisma.itineraryItem.count({
      where: { tripId },
    });

    await prisma.itineraryItem.create({
      data: {
        tripId,
        title,
        time: time || null,
        description: description || null,
        order: existingItems, // append to bottom
      },
    });

    revalidatePath(`/trips/${tripId}`);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Failed to create item" };
  }
}

export async function reorderItineraryItems(
  items: { id: string; order: number }[],
  tripId: string,
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    // We update each item in a transaction
    await prisma.$transaction(
      items.map((item) =>
        prisma.itineraryItem.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );

    revalidatePath(`/trips/${tripId}`);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Failed to reorder items" };
  }
}

export async function deleteItineraryItem(itemId: string, tripId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await prisma.itineraryItem.delete({
      where: { id: itemId },
    });
    revalidatePath(`/trips/${tripId}`);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Failed to delete" };
  }
}
