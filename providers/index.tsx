"use client";

import { PropsWithChildren } from "react";
import ThemeProvider from "./theme";
import { BusinessFunctionContextProvider } from "./bussiness-function";
import { ProjectContextProvider } from "./projects";

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <BusinessFunctionContextProvider>
        <ProjectContextProvider>{children}</ProjectContextProvider>
      </BusinessFunctionContextProvider>
    </ThemeProvider>
  );
};

export default Providers;
