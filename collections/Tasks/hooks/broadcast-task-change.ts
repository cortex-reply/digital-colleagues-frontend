import { getId } from "@/lib/utils";
import { websocket } from "@/services";
import { CollectionAfterChangeHook } from "payload";

export const broadcastTaskChange: CollectionAfterChangeHook = async ({
  doc,
  req: { payload },
  operation,
}) => {
  const io = websocket.getIO();

  const projectId = getId(doc.project);

  io?.emit(`project/${projectId}/task`, {
    operation,
    doc,
  });

  return doc;
};
