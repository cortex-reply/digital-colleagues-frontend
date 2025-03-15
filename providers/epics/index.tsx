"use client";

import { getProjectEpics } from "@/actions/epics";
import { Epic, Function } from "@/payload-types";
import { useParams } from "next/navigation";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSocket } from "../socket";

export type EpicContextType = {
  epics: Epic[];
  projectId: number | null;
  // setprojectId: Dispatch<SetStateAction<number | null>>;
  refetch: () => void;
};

const Context = createContext({} as EpicContextType);

export const EpicContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [projectId, setProjectId] = useState<number | null>(null);
  const [epics, setEpics] = useState<Epic[]>([]);
  const { socket } = useSocket();
  const params = useParams();
  const paramProjectId = params.projectId;

  useEffect(() => {
    if (paramProjectId && typeof paramProjectId === "string")
      setProjectId(parseInt(paramProjectId));
  }, [paramProjectId]);

  useEffect(() => {
    socket?.on(`project/${paramProjectId}/epic`, (message) => {
      setEpics((prev) => {
        if (!prev) return [];

        let mappedEpics: Epic[] = [];
        if (message.operation === "update") {
          mappedEpics = prev.map((el) => {
            if (el?.id !== message.doc?.id) return el;
            return message.doc;
          });
        } else if (message.operation === "delete") {
          mappedEpics = prev.filter((el) => el.id !== message.doc?.id);
        } else if (message) {
          mappedEpics = [...prev, message.doc];
        }
        return [...mappedEpics];
      });
    });

    return () => {
      socket?.off(`project/${paramProjectId}/task`);
    };
  }, [socket, paramProjectId]);

  const fetchProjectEpics = useCallback(async () => {
    if (!projectId) {
      setEpics([]);
      return;
    }
    const res = await getProjectEpics(projectId.toString());
    if (res.epics) setEpics(res.epics);
  }, [projectId]);

  const refetch = useCallback(async () => {
    await fetchProjectEpics();
  }, [fetchProjectEpics]);

  useEffect(() => {
    fetchProjectEpics();
  }, [projectId]);
  return (
    <Context.Provider value={{ epics, projectId, refetch }}>
      {children}
    </Context.Provider>
  );
};

export const useEpicContext = () => {
  const context = useContext(Context);

  if (!context) throw new Error("Business function context not found");

  return context;
};
