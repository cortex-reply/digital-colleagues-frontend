"use client";

import { PropsWithChildren } from "react";
import ThemeProvider from "./theme";
import { BusinessFunctionContextProvider } from "./bussiness-function";
import { ProjectContextProvider } from "./projects";
import { SocketProvider } from "./socket";
import { EpicContextProvider } from "./epics";

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SocketProvider>
        <BusinessFunctionContextProvider>
          <ProjectContextProvider>
            <EpicContextProvider>{children}</EpicContextProvider>
          </ProjectContextProvider>
        </BusinessFunctionContextProvider>
      </SocketProvider>
    </ThemeProvider>
  );
};

export default Providers;
