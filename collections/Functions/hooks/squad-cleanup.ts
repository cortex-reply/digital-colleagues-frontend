import { getId } from "@/lib/utils";
import { Function } from "@/payload-types";
import { CollectionAfterDeleteHook } from "payload";

export const squadCleanup: CollectionAfterDeleteHook<Function> = async ({
  doc,
  req,
}) => {
  if (doc.squad) {
    const squadId = getId(doc.squad);
    await req.payload.delete({
      collection: "squads",
      where: {
        id: {
          equals: squadId,
        },
      },
    });

    req.payload.logger.info(`Removed squad for - ${doc.name}`);
  }
};
