"use server";

import { getPayload } from "payload";
import config from "@/payload.config";
import { z } from "zod";
import { redirect } from "next/navigation";

const CreateBusinessFunctionSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required." }),
  description: z.string().optional(),
  squad: z.coerce.number(),
  waysOfWorking: z.any(),
});

// CREATE
// creation of business functions
export async function createBusinessFunction(
  prevState: any,
  formData: FormData
) {
  const formEntry = Object.fromEntries(formData);
  const { success, data, error } =
    CreateBusinessFunctionSchema.safeParse(formEntry);

  console.log("error", error);
  console.log("data", data);

  if (!success) {
    return {
      errors: {},
    };
  }

  const payload = await getPayload({ config });

  const docs = await payload.create({
    collection: "functions",
    data: {
      ...data,
    },
  });

  return { status: "success", data: docs };
}

// READ
// gets all business functions
export async function getBusinessFunctions() {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "functions",
  });

  const mappedFunctions = await Promise.all(
    docs.map(async (businessFunc) => {
      const projects = await payload.find({
        collection: "projects",
        where: {
          "businessFunction.id": {
            equals: businessFunc.id,
          },
        },
      });

      return {
        ...businessFunc,
        projectCount: projects.docs.length,
      };
    })
  );

  return { docs: mappedFunctions };
}

// gets business function by id
export async function getBusinessFunctionById(id: string) {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "functions",
    where: {
      id: {
        equals: id,
      },
    },
  });

  if (docs && docs.length > 0) {
    const item = docs[0];
    return { function: item };
  } else return { message: "No function found for the given Id" };
}
