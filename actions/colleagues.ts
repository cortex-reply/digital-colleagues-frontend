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

export async function getHumanColleagues(ids: string[]) {
  const payload = await getPayload({ config });

  const { docs: humans } = await payload.find({
    collection: "users",
    where: {
      id: {
        in: ids,
      },
    },
  });

  return { humans };
}

export async function getAgentColleagues(ids: string[]) {
  const payload = await getPayload({ config });

  const { docs: agents } = await payload.find({
    collection: "agents",
    where: {
      id: {
        in: ids,
      },
    },
  });

  return { agents };
}
