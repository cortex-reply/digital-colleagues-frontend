"use client";

import {
  getBusinessFunctionById,
  getBusinessFunctions,
} from "@/actions/business-function";
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

type ExtendedBusinessFunctionType = Function & { projectCount?: number };

export type BusinessFunctionContextType = {
  businessFunctions: ExtendedBusinessFunctionType[];
  // setBusinessFunctions: Dispatch<SetStateAction<Function[]>>;
  refetch: () => void | Promise<void>;
  updateBusinessFunction: (
    id: number,
    data?: Partial<ExtendedBusinessFunctionType>
  ) => void;
};

const Context = createContext({} as BusinessFunctionContextType);

export const BusinessFunctionContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [businessFunctions, setBusinessFunctions] = useState<
    ExtendedBusinessFunctionType[]
  >([]);

  const fetchBusinessFunctions = useCallback(async () => {
    const functions = await getBusinessFunctions();
    setBusinessFunctions(functions.docs as ExtendedBusinessFunctionType[]);
  }, []);

  const updateBusinessFunction = useCallback(
    async (id: number, data?: Partial<ExtendedBusinessFunctionType>) => {
      if (data) {
        setBusinessFunctions((prev) => {
          const copy = [...prev].map((el) => {
            if (el.id !== id) return el;
            return {
              ...el,
              ...data,
            };
          });

          return copy;
        });
      } else {
        const res = await getBusinessFunctionById(id.toString());
        if (res.function) {
          setBusinessFunctions((prev) => {
            const copy = [...prev].map((el) => {
              if (el.id !== id) return el;
              return res.function;
            });

            return copy;
          });
        }
      }
    },
    []
  );

  const refetch = useCallback(() => {
    fetchBusinessFunctions();
  }, []);

  useEffect(() => {
    fetchBusinessFunctions();
  }, []);

  return (
    <Context.Provider
      value={{ businessFunctions, refetch, updateBusinessFunction }}
    >
      {children}
    </Context.Provider>
  );
};

export const useBusinessFunctionContext = () => {
  const context = useContext(Context);

  if (!context) throw new Error("Business function context not found");

  return context;
};
