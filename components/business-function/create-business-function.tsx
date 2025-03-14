"use client";

import type React from "react";

import { useActionState, useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBusinessFunction } from "@/actions/business-function";
import { Squad } from "@/payload-types";
import { getSquads } from "@/actions/squads";
import { useBusinessFunctionContext } from "@/providers/bussiness-function";
import { useRouter } from "next/navigation";

interface CreateBusinessFunctionProps {
  onComplete?: () => void;
}

export function CreateBusinessFunction({
  onComplete,
}: CreateBusinessFunctionProps) {
  const [state, formAction] = useActionState(createBusinessFunction, {} as any);
  const [squads, setSquads] = useState<Squad[]>([]);
  const router = useRouter();

  const { refetch } = useBusinessFunctionContext();

  const getAllSquads = useCallback(async () => {
    const res = await getSquads();
    setSquads(res.squads);
  }, []);

  useEffect(() => {
    getAllSquads();
  }, []);

  useEffect(() => {
    if (state && state.status === "success") {
      refetch();
      onComplete?.();
    }
  }, [state]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Business Function</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="waysOfWorking">Ways of Working</Label>
            <Textarea
              id="waysOfWorking"
              name="waysOfWorking"
              placeholder="This will be replaced with a rich text editor later"
              rows={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="squad">Squad</Label>
            <Select name="squad">
              <SelectTrigger>
                <SelectValue placeholder="Select a squad" />
              </SelectTrigger>
              <SelectContent>
                {squads.map((squad) => (
                  <SelectItem key={squad.id} value={squad.id.toString()}>
                    {squad.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Create Business Function</Button>
        </form>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
