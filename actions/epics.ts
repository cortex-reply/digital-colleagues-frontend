"use server";

import { getPayload } from "payload";
import config from "@/payload.config";
import { z } from "zod";

const createEpicSchema = z.object({
  name: z.string().trim().min(1, { message: "Title is required." }),
  description: z.string().optional(),
  projectId: z.string(),
});

// CREATE
// creation of an epic
export async function createEpic(prevState: any, formData: FormData) {
  const formEntry = Object.fromEntries(formData);
  const { success, data, error } = createEpicSchema.safeParse(formEntry);

  if (!success) {
    return {
      errors: {},
    };
  }

  const payload = await getPayload({ config });

  try {
    const project = await payload.findByID({
      collection: "projects",
      id: data.projectId,
    });

    if (!project) return { message: "Project not found", statusCode: 400 };

    const newEpic = await payload.create({
      collection: "epics",
      data: {
        ...data,
        project,
      },
    });
    return { status: "success", epic: newEpic };
  } catch (err) {
    console.error("err", error);
  }
}

// // READ
// gets epics for the current project ID
export async function getProjectEpics(projectId: string) {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "epics",
    where: {
      "project.id": {
        equals: projectId,
      },
    },
  });

  if (docs && docs.length > 0) {
    return { epics: docs };
  } else return { message: "No epics found for the given Id" };
}
