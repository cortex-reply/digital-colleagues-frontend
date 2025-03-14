"use server";

import { getPayload } from "payload";
import config from "@/payload.config";
import { z } from "zod";
import { Task } from "@/payload-types";

const createTaskSchema = z.object({
  name: z.string().trim().min(1, { message: "Title is required." }),
  description: z.string().optional(),
  status: z.enum(["backlog", "todo", "inProgress", "done", "cancelled"]),
  projectId: z.string(),
  epic: z.string(),
  // waysOfWorking: z.string(),
});

// CREATE
// creation of task
export async function createTask(prevState: any, formData: FormData) {
  const formEntry = Object.fromEntries(formData);
  const { success, data, error } = createTaskSchema.safeParse(formEntry);

  console.log("error", error);

  if (!success) {
    return {
      errors: {},
    };
  }

  const payload = await getPayload({ config });

  try {
    const newTask = await payload.create({
      collection: "tasks",
      data: {
        ...data,
        project: parseInt(data.projectId),
        epic: parseInt(data.epic),
        dateLogged: new Date().toString(),
      },
    });
    return { status: "success", task: newTask };
  } catch (err) {
    console.error("error", err);
  }
}

export async function updateTaskStatus(status: Task["status"], taskId: number) {
  const payload = await getPayload({ config });

  const { docs, errors } = await payload.update({
    collection: "tasks",
    where: {
      id: {
        equals: taskId,
      },
    },
    data: {
      status,
    },
  });

  if (errors && Array.isArray(errors) && errors.length > 0)
    return { errors: errors.map((el) => el.message) };

  return { task: docs[0] };
}

// // READ
// gets business function by id
export async function getProjectTasks(projectId: string) {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "tasks",
    where: {
      "project.id": {
        equals: projectId,
      },
    },
  });

  if (docs && docs.length > 0) {
    return { tasks: docs };
  } else return { message: "No tasks found for the given Id" };
}
