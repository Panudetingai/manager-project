"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { iconList } from "../const/icon-list";
import {
  FormWorkspaceSchema,
  FormWorkspaceType,
} from "../schema/form-workspace";
import { createWorkspaceAPI } from "../server/workspace-create";

type Props = {
  workspaces:
    | {
        name: string;
        workspace_icon: string | null;
      }[]
    | null
    | undefined;
};

export default function CreateWorkspaceForm({ workspaces }: Props) {
  const router = useRouter();
  const form = useForm<FormWorkspaceType>({
    resolver: zodResolver(FormWorkspaceSchema),
    defaultValues: {
      workspacename: "",
      icon: "File",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createWorkspaceAPI,
    onSuccess: async (data) => {
      window.location.href = `${data.name}`;
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      const isExist = workspaces?.find((ws) => ws.name === value.workspacename);
      if (isExist) {
        form.setError("workspacename", {
          message: "Workspace name already exists",
        });
      } else {
        form.clearErrors("workspacename");
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const handlesubmit = form.handleSubmit((data) => {
    const isExist = workspaces?.find((ws) => ws.name === data.workspacename);
    if (isExist) {
      form.setError("workspacename", {
        message: "Workspace name already exists",
      });
      return;
    }
    mutate(data);
  });

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={handlesubmit}>
        <FormField
          control={form.control}
          name="workspacename"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter workspace name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace Icon</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select workspace icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconList.map((Icon) => (
                      <SelectItem key={Icon.name} value={Icon.value}>
                        <Icon.icon className="h-5 w-5 mr-2 inline" />
                        {Icon.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={form.watch("workspacename") === "" || isPending}
        >
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            "Create Workspace"
          )}
        </Button>
      </form>
    </Form>
  );
}
