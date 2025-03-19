"use server";

import { getPayload } from "payload";
import config from "@/payload.config";
import { getId } from "@/lib/utils";

export async function getSquads() {
  const payload = await getPayload({ config });

  const { docs: squads } = await payload.find({
    collection: "squads",
  });

  return { squads };
}
export async function getSquadById(squadId: number) {
  const payload = await getPayload({ config });

  const squad = await payload.findByID({
    collection: "squads",
    id: squadId,
    depth: 4,
  });

  return { squad };
}

export async function addSquadMember(squadId: string, colleagueId: string) {
  const payload = await getPayload({ config });

  const {
    docs: [squad],
  } = await payload.find({
    collection: "squads",
    where: {
      id: {
        equals: squadId,
      },
    },
  });

  if (squad) {
    const currColleagues: number[] = squad.colleagues
      ? [...squad.colleagues.map((el) => getId(el, "number") as number)]
      : [];
    const updatedSquad = await payload.update({
      collection: "squads",
      where: {
        id: {
          equals: squad.id,
        },
      },
      data: {
        colleagues: [...currColleagues, parseInt(colleagueId)],
      },
    });
    return { status: "success", squad: updatedSquad };
  }
}

// UPDATE
// remove a squad member
export async function removeSquadMember(squadId: string, colleagueId: string) {
  const payload = await getPayload({ config });

  const {
    docs: [squad],
  } = await payload.find({
    collection: "squads",
    where: {
      id: {
        equals: squadId,
      },
    },
  });

  if (squad) {
    const updatedSquad = await payload.update({
      collection: "squads",
      where: {
        id: {
          equals: squad.id,
        },
      },
      data: {
        colleagues: squad.colleagues?.filter((el) =>
          typeof el === "number"
            ? el.toString() !== colleagueId
            : el.id.toString() !== colleagueId
        ),
      },
    });

    return { status: "success", squad: updatedSquad };
  }
}
