"use client";

import type React from "react";

import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { Colleague, Squad, User } from "@/payload-types";
import { getSquads } from "@/actions/squads";
import { useBusinessFunctionContext } from "@/providers/bussiness-function";
import { useRouter } from "next/navigation";
import RichTextEditor, { Wrapper } from "../rich-text";
import FormMessage from "../form/message";
import useFormErrors from "@/hooks/useFormError";
import { cn } from "@/lib/utils";
import { MultiSelect } from "../ui/multiSelect";
import { getColleagues } from "@/actions/colleagues";

interface CreateBusinessFunctionProps {
  onComplete?: () => void;
}

const fields = ["name", "description", "waysOfWorking", "squad"];
type FieldValues = (typeof fields)[number];

export function CreateBusinessFunction({
  onComplete,
}: CreateBusinessFunctionProps) {
  const [state, formAction] = useActionState(createBusinessFunction, {} as any);
  const [colleagues, setColleagues] = useState<Colleague[]>([]);
  const [selectedColleagues, setSelectedColleagues] = useState<string[]>([]);
  const [waysOfWorking, setWaysOfWorking] = useState<any>();

  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  const { setError, getFieldErrors, clearAllErrors, fieldHasErrors } =
    useFormErrors<FieldValues>(fields);
  const router = useRouter();

  const { refetch } = useBusinessFunctionContext();

  const getAllColleagues = useCallback(async () => {
    const res = await getColleagues();
    setColleagues(res.colleagues);
  }, []);

  useEffect(() => {
    getAllColleagues();
  }, []);

  useEffect(() => {
    if (state && state.status === "success") {
      refetch();
      if (onComplete) onComplete();
      else router.push("/");
    } else if (state.errors) {
      const keys = Object.keys(state.errors).filter((el) =>
        fields.includes(el)
      );

      clearAllErrors();

      for (const key of keys) {
        setError(key, state.errors[key]);
      }

      if (state.data?.description && descriptionInputRef.current)
        descriptionInputRef.current.value = state.data.description;
      if (state.data?.name && nameInputRef.current)
        nameInputRef.current.value = state.data.name;
    }
  }, [state]);

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      formData.set("waysOfWorking", JSON.stringify(waysOfWorking));
      formData.set("colleagues", JSON.stringify(selectedColleagues));
      formAction(formData);
    },
    [waysOfWorking, selectedColleagues]
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Business Function</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className={cn(fieldHasErrors("name") && "text-red-500")}
            >
              Name
            </Label>
            <Input
              id="name"
              name="name"
              className={cn(fieldHasErrors("name") && "border-red-500")}
              ref={nameInputRef}
            />
            {fieldHasErrors("name") && (
              <FormMessage message={getFieldErrors("name")[0]} />
            )}
            {/* <FormMessage>Error here</FormMessage> */}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              ref={descriptionInputRef}
              id="description"
              name="description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="waysOfWorking">Ways of Working</Label>
            <Wrapper>
              <RichTextEditor
                name={"waysOfWorking"}
                value={waysOfWorking}
                setValue={setWaysOfWorking}
              />
            </Wrapper>
            {/* <Textarea
              id="waysOfWorking"
              name="waysOfWorking"
              placeholder="This will be replaced with a rich text editor later"
              rows={6}
            /> */}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="colleagues"
              className={cn(fieldHasErrors("colleagues") && "text-red-500")}
            >
              Colleagues
            </Label>
            <MultiSelect
              options={colleagues
                .filter((el) => el.human && typeof el.human !== "number")
                .map((el) => ({
                  label: (el.human as User)?.name,
                  value: el.id.toString(),
                }))}
              onValueChange={(change) => {
                setSelectedColleagues(change);
              }}
            />
            {fieldHasErrors("colleagues") && (
              <FormMessage message={getFieldErrors("colleagues")[0]} />
            )}
            {/* <Select name="squad">
              <SelectTrigger
                className={cn(fieldHasErrors("squad") && "border-red-500")}
              >
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
             */}
          </div>
          <Button type="submit">Create Business Function</Button>
        </form>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
