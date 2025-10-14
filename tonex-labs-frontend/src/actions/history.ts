"use server";

import { db } from "~/server/db";

export async function deleteHistoryItem(id: string) {
  try {
    await db.generatedAudioClip.delete({ where: { id } });
    return { success: true };
  } catch (e) {
    console.error("Delete failed:", e);
    return { success: false };
  }
}