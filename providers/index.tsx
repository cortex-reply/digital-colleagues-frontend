"use client";

import { PropsWithChildren } from "react";
import ThemeProvider from "./theme";
import { BusinessFunctionContextProvider } from "./bussiness-function";
import { ProjectContextProvider } from "./projects";
import { SocketProvider } from "./socket";

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
          <ProjectContextProvider>{children}</ProjectContextProvider>
        </BusinessFunctionContextProvider>
      </SocketProvider>
    </ThemeProvider>
  );
};

export default Providers;
