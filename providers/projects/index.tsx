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
};

const Context = createContext({} as ProjectContextType);

export const ProjectContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [functionId, setFunctionId] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const params = useParams();
  const paramFunctionId = params.id;

  useEffect(() => {
    if (paramFunctionId && typeof paramFunctionId === "string")
      setFunctionId(parseInt(paramFunctionId));
  }, [paramFunctionId]);

  const fetchFunctionProjects = useCallback(async () => {
    if (!functionId) return;
    const res = await getProjectsByBusinessFunctionId(functionId.toString());
    setProjects(res.docs);
  }, [functionId]);

  const refetch = useCallback(async () => {
    await fetchFunctionProjects();
  }, [fetchFunctionProjects]);

  useEffect(() => {
    fetchFunctionProjects();
  }, [functionId]);
  return (
    <Context.Provider value={{ projects, functionId, refetch }}>
      {children}
    </Context.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(Context);

  if (!context) throw new Error("Business function context not found");

  return context;
};
