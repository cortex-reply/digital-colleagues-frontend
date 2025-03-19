"use server";

import { getPayload } from "payload";
import config from "@/payload.config";
import { z } from "zod";

const CreateBusinessFunctionSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required." }),
  description: z.string().optional(),
  // colleagues: z.string().array(),
  colleagues: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return val; // If parsing fails, let Zod handle the validation error
      }
    }
    return val;
  }, z.array(z.string())),
  // squad: z.coerce.number(),
  waysOfWorking: z.any(),
});

// CREATE
// creation of business functions
export async function createBusinessFunction(
  prevState: any,
  formData: FormData
) {
  const payload = await getPayload({ config });
  const formEntry = Object.fromEntries(formData);
  const { success, data, error } =
    CreateBusinessFunctionSchema.safeParse(formEntry);

  if (!success) {
    return {
      errors: error.flatten().fieldErrors,
      data: formEntry,
    };
  }

  // const { docs: squads, totalDocs: squadCount } = await payload.find({
  //   collection: "squads",
  //   where: { id: { equals: data.squad } },
  // });

  // if (squadCount === 0)
  //   return { errors: { squad: ["Squad is required"] }, data: formEntry };

  const { docs: colleagues } = await payload.find({
    collection: "colleagues",
    where: {
      id: {
        in: data.colleagues,
      },
    },
  });

  // create a squad
  const squad = await payload.create({
    collection: "squads",
    data: {
      name: `${data.name}-squad`,
      description: `Squad for function ${data.name}`,
      colleagues: colleagues,
    },
  });

  const docs = await payload.create({
    collection: "functions",
    data: {
      ...data,
      squad,
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
      const projects = await payload.count({
        collection: "projects",
        where: {
          "businessFunction.id": {
            equals: businessFunc.id,
          },
        },
      });

      return {
        ...businessFunc,
        projectCount: projects.totalDocs,
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
    depth: 3,
  });

  if (docs && docs.length > 0) {
    const item = docs[0];
    const { totalDocs: projectCount } = await payload.count({
      collection: "projects",
      where: {
        "businessFunction.id": {
          equals: item.id,
        },
      },
    });

    return { function: { ...item, projectCount: projectCount } };
  } else return { message: "No function found for the given Id" };
}
