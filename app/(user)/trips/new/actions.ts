"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTrip(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to create a trip" };
  }

  const title = formData.get("title") as string;
  const destination = formData.get("destination") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const notes = formData.get("notes") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!title || !destination || !startDate || !endDate) {
    return { error: "Missing required fields" };
  }

  try {
    const trip = await prisma.trip.create({
      data: {
        userId: session.user.id,
        title,
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        notes: notes || null,
        imageUrl: imageUrl || null,
      },
    });
  } catch (err) {
    console.error(err);
    return { error: "Failed to create trip" };
  }

  revalidatePath("/trips");
  redirect("/trips");
}
