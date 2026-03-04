"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createLocation(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to add a location" };
  }

  const name = formData.get("name") as string;
  const country = formData.get("country") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const visited = formData.get("visited") === "on";

  if (!name || !country) {
    return { error: "Name and Country are required fields" };
  }

  let lat = null;
  let lng = null;

  try {
    const query = encodeURIComponent(`${name}, ${country}`);
    const geocodeRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
      {
        headers: { "User-Agent": "TravelNextJsApp/1.0" },
      },
    );

    if (geocodeRes.ok) {
      const data = await geocodeRes.json();
      if (data && data.length > 0) {
        lat = parseFloat(data[0].lat);
        lng = parseFloat(data[0].lon);
      }
    }
  } catch (geoErr) {
    console.error("Geocoding failed via Nominatim:", geoErr);
  }

  try {
    await prisma.location.create({
      data: {
        userId: session.user.id,
        name,
        country,
        description: description || null,
        imageUrl: imageUrl || null,
        visited,
        lat,
        lng,
      },
    });
  } catch (err) {
    console.error(err);
    return { error: "Failed to add location. Please try again." };
  }

  revalidatePath("/locations");
  redirect("/locations");
}
