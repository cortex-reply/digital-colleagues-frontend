"use server";

import { BasePayload, getPayload } from "payload";
import config from "@/payload.config";
import { z } from "zod";
import { Task } from "@/payload-types";

const createTaskSchema = z.object({
  name: z.string().trim().min(1, { message: "Title is required." }),
  description: z.string().optional(),
  status: z.enum(["backlog", "todo", "inProgress", "done", "cancelled"], {
    message: "Invalid value",
  }),
  projectId: z.string(),
  epic: z.string(),
});

// CREATE
// creation of task
export async function createTask(prevState: any, formData: FormData) {
  const formEntry = Object.fromEntries(formData);
  const { success, data, error } = createTaskSchema.safeParse(formEntry);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      data: formEntry,
    };
  }

  const payload = await getPayload({ config });

  const { totalDocs: epicCount } = await payload.count({
    collection: "epics",
    where: {
      id: {
        equals: data.epic,
      },
    },
  });

  if (epicCount === 0) {
    return {
      errors: {
        epic: ["Epic is required"],
      },
      data: formEntry,
    };
  }

  try {
    // getting the last index for the current status
    const {
      docs: [{ index: lastIndex }],
    } = await payload.find({
      collection: "tasks",
      where: {
        status: {
          equals: data.status,
        },
      },
      sort: ["-index"],
      limit: 1,
      depth: 0,
    });

    const newTask = await payload.create({
      collection: "tasks",
      data: {
        ...data,
        project: parseInt(data.projectId),
        epic: parseInt(data.epic),
        dateLogged: new Date().toString(),
        index: (lastIndex || 0) + 1,
      },
    });
    return { status: "success", task: newTask };
  } catch (err) {
    console.error("error", err);
  }
}

export async function updateTaskIndex(
  taskId: number,
  prevIndex: number,
  index: number,
  status: Task["status"]
) {
  const payload = await getPayload({ config });

  // we have to get the items before updating the list
  // if the item moved up we add the index of each item that comes after it
  if (prevIndex > index) {
    const { docs } = await payload.find({
      collection: "tasks",
      where: {
        and: [
          {
            index: {
              greater_than_equal: index,
            },
          },
          {
            index: {
              not_equals: prevIndex,
            },
          },
          {
            status: {
              equals: status,
            },
          },
        ],
      },
    });

    for (const { id, index: currIdx } of docs) {
      await payload.update({
        collection: "tasks",
        where: {
          id: {
            equals: id,
          },
        },
        data: {
          index: typeof currIdx === "number" ? currIdx + 1 : 0,
        },
      });
    }
  }

  // if the item moved down we add the index of each item that comes before it
  if (prevIndex < index) {
    const { docs } = await payload.find({
      collection: "tasks",
      where: {
        and: [
          {
            index: {
              less_than_equal: index,
            },
          },
          {
            index: {
              not_equals: prevIndex,
            },
          },
          {
            status: {
              equals: status,
            },
          },
        ],
      },
    });
    for (const { id, index: currIdx } of docs) {
      await payload.update({
        collection: "tasks",
        where: {
          id: {
            equals: id,
          },
        },
        data: {
          index: typeof currIdx === "number" ? currIdx - 1 : 0,
        },
      });
    }
  }

  await payload.update({
    collection: "tasks",
    where: {
      id: {
        equals: taskId,
      },
    },
    data: {
      status,
      index,
    },
  });

  return { status: "success" };
}

export async function updateTaskInfo(
  taskId: number,
  data: Partial<Pick<Task, "name" | "description" | "status" | "closureDate">>
) {
  const payload = await getPayload({ config });

  const { docs, errors } = await payload.update({
    collection: "tasks",
    where: {
      id: {
        equals: taskId,
      },
    },
    data: {
      ...data,
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
