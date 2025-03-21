"use client";

import { getProjectsByBusinessFunctionId } from "@/actions/projects";
import { Function, Project } from "@/payload-types";
import { useParams } from "next/navigation";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type ProjectContextType = {
  projects: Project[];
  functionId: number | null;
  // setFunctionId: Dispatch<SetStateAction<number | null>>;
  refetch: () => void;
  fetching: boolean;
};

const Context = createContext({} as ProjectContextType);

export const ProjectContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [functionId, setFunctionId] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [fetching, setFetching] = useState(false);
  const params = useParams();
  const paramFunctionId = params.id as string;

  useEffect(() => {
    if (paramFunctionId && typeof paramFunctionId === "string")
      setFunctionId(parseInt(paramFunctionId));
  }, [paramFunctionId]);

  const fetchFunctionProjects = useCallback(async () => {
    if (!functionId) return;
    setFetching(true);
    try {
      const res = await getProjectsByBusinessFunctionId(functionId.toString());
      setProjects(res.docs);
    } catch (err) {
      console.error("Error fetching projects", err);
    } finally {
      setFetching(false);
    }
  }, [functionId]);

  const refetch = useCallback(async () => {
    await fetchFunctionProjects();
  }, [fetchFunctionProjects]);

  useEffect(() => {
    fetchFunctionProjects();
  }, [functionId]);
  return (
    <Context.Provider value={{ projects, functionId, refetch, fetching }}>
      {children}
    </Context.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(Context);

  if (!context) throw new Error("Business function context not found");

  return context;
};
