import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import React from "react";

interface FormMessageProps {
  message: string;
}

// The name might be conflicting with ShadCN FormMessage but the usage should be clear
const FormMessage: React.FC<FormMessageProps> = ({ message }) => {
  return (
    <span className={cn("text-sm font-medium text-red-500")}>{message}</span>
  );
};

export default FormMessage;
