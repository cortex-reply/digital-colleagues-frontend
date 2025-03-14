"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, ChevronRight, Briefcase } from "lucide-react";
import { useBusinessFunctionContext } from "@/providers/bussiness-function";

export function BusinessFunctionList() {
  const { businessFunctions: functions } = useBusinessFunctionContext();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Business Functions
          </h1>
          <p className="text-muted-foreground">
            Manage your business functions and their projects
          </p>
        </div>
        <Link href="/business-functions/create">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Business Function
          </Button>
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {functions.map((businessFunction) => (
          <Link
            key={businessFunction.id}
            href={`/business-function/${businessFunction.id}`}
            className="block"
          >
            <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle>{businessFunction.name}</CardTitle>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription className="pt-1">
                  {businessFunction.description}
                </CardDescription>
              </CardHeader>
              {typeof businessFunction.squad !== "number" && (
                <CardContent className="pb-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {businessFunction.squad?.colleagues?.length || 0}{" "}
                      {businessFunction.squad?.colleagues?.length &&
                      businessFunction.squad?.colleagues?.length === 1
                        ? "member"
                        : "members"}
                    </span>
                  </div>
                </CardContent>
              )}

              {/* <CardFooter className="border-t bg-muted/50 pt-3">
                <div className="text-sm font-medium">
                  {businessFunction?.projectCount}{" "}
                  {businessFunction?.projectCount &&
                  businessFunction?.projectCount > 1
                    ? "Project"
                    : "Projects"}
                </div>
              </CardFooter> */}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
