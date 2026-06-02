import { cookies } from "next/headers";
import { getPlace, PLACE_COOKIE, type Place } from "@/lib/places";

/** The visitor's currently selected metro, or null if none chosen yet. */
export async function currentPlace(): Promise<Place | null> {
  const slug = (await cookies()).get(PLACE_COOKIE)?.value;
  return getPlace(slug) ?? null;
}
