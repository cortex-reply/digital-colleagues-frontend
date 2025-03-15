"use server";

import { getPayload } from "payload";
import config from "@/payload.config";

export async function getColleagues() {
  const payload = await getPayload({ config });

  const { docs: colleagues } = await payload.find({
    collection: "colleagues",
  });

  return { colleagues };
}
