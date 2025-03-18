"use server";

import { getPayload } from "payload";
import config from "@/payload.config";
import { z } from "zod";

const createProjectSchema = z.object({
  functionId: z.string(),
  name: z.string().trim().min(1, { message: "Name is required." }),
  description: z.string().optional(),
  workInstructions: z
    .string()
    .min(1, { message: "Work instruction is required" }),
});

// CREATE
// creation of a project
export async function createProject(prevState: any, formData: FormData) {
  const formEntry = Object.fromEntries(formData);
  const { success, data, error } = createProjectSchema.safeParse(formEntry);

  if (!success) {
    return {
      errors: {},
    };
  }

  const payload = await getPayload({ config });

  try {
    const foundFunction = await payload.findByID({
      collection: "functions",
      id: data.functionId,
    });

    if (!foundFunction)
      return { error: { message: "function not found", status: 400 } };

    await payload.create({
      collection: "projects",
      data: {
        ...data,
        workInstructions: null,
        businessFunction: foundFunction,
      },
    });

    return { status: "success" };
  } catch (err) {
    console.error("err", error);
  }
}

// READ
// gets all business functions
export async function getProjectsByBusinessFunctionId(functionId: string) {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "projects",
    where: {
      "businessFunction.id": {
        equals: functionId,
      },
    },
  });

  return { docs };
}

// gets business function by id
export async function getProjectById(id: string) {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "projects",
    where: {
      id: {
        equals: id,
      },
    },
  });

  if (docs && docs.length > 0) {
    const item = docs[0];
    const { docs: tasks } = await payload.find({
      collection: "tasks",
      where: {
        "project.id": {
          equals: item.id,
        },
      },
    });

    return { project: { ...item, tasks } };
  } else return { message: "No function found for the given Id" };
}
