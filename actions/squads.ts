"use server";

import { getPayload } from "payload";
import config from "@/payload.config";

export async function getSquads() {
  const payload = await getPayload({ config });

  const { docs: squads } = await payload.find({
    collection: "squads",
  });

  return { squads };
}
