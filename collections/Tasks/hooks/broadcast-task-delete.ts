import { getId } from "@/lib/utils";
import { websocket } from "@/services";
import { CollectionAfterDeleteHook } from "payload";

export const broadcastTaskDelete: CollectionAfterDeleteHook = async ({
  doc,
  req: { payload },
}) => {
  const io = websocket.getIO();

  const projectId = getId(doc.project);

  io?.emit(`project/${projectId}/task`, {
    operation: "delete",
    doc,
  });

  return doc;
};
