import { websocket } from "@/services";
import { CollectionAfterChangeHook } from "payload";

export const broadcastTaskChange: CollectionAfterChangeHook = async ({
  doc,
  req: { payload },
  operation,
}) => {
  const io = websocket.getIO();

  io?.emit(`tasks`, {
    operation,
    doc,
  });

  return doc;
};
