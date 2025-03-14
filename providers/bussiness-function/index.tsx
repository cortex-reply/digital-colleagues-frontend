"use client";

import { getBusinessFunctions } from "@/actions/business-function";
import { Function } from "@/payload-types";
import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type BusinessFunctionContextType = {
  businessFunctions: Function[];
  // setBusinessFunctions: Dispatch<SetStateAction<Function[]>>;
  refetch: () => void | Promise<void>;
};

const Context = createContext({} as BusinessFunctionContextType);

export const BusinessFunctionContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [businessFunctions, setBusinessFunctions] = useState<Function[]>([]);

  const fetchBusinessFunctions = useCallback(async () => {
    const functions = await getBusinessFunctions();
    setBusinessFunctions(functions.docs);
  }, []);

  const refetch = useCallback(() => {
    fetchBusinessFunctions();
  }, []);

  useEffect(() => {
    fetchBusinessFunctions();
  }, []);

  return (
    <Context.Provider value={{ businessFunctions, refetch }}>
      {children}
    </Context.Provider>
  );
};

export const useBusinessFunctionContext = () => {
  const context = useContext(Context);

  if (!context) throw new Error("Business function context not found");

  return context;
};
