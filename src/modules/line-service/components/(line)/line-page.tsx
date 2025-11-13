"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useWorkspaceState } from "@/modules/manager/store/workspace-state";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormSetup, FormSetupType } from "../../schema/form";
import {
  useCreateLineServiceEnvDB,
  useGetLineServiceEnvDB,
} from "../hooks/useLineservice";

export default function LinePage() {
  const [Enable, setEnable] = useState(false);
  const createLineServiceEnvDB = useCreateLineServiceEnvDB();
  const { workspaceId } = useWorkspaceState();
  const getLineServiceEnvDB = useGetLineServiceEnvDB({
    workspaceId: workspaceId || "",
    category: "LINE",
  });

  const [View, setView] = useState({
    channelId: false,
    channelSecret: false,
  });

  const form = useForm<FormSetupType>({
    resolver: zodResolver(FormSetup),
    defaultValues: {
      channelId:
        (getLineServiceEnvDB.data &&
          getLineServiceEnvDB.data.env.data.channelId) ||
        "",
      channelSecret:
        (getLineServiceEnvDB.data &&
          getLineServiceEnvDB.data.env.data.channelSecret) ||
        "",
    },
  });

  const handleSubmit = (data: FormSetupType) => {
    createLineServiceEnvDB.mutate(
      {
        id: getLineServiceEnvDB.data ? getLineServiceEnvDB.data.id : "",
        env: JSON.parse(JSON.stringify({ data })),
        category: "LINE",
        workspaceId: workspaceId,
      },
      {
        onError: (error) => {
          console.error("Error creating LINE service env DB:", error);
        },
        onSuccess: () => {
          setEnable(false);
          setView({
            channelId: false,
            channelSecret: false,
          });
          toast.success("LINE social account settings saved successfully!");
        },
      }
    );
  };

  useEffect(() => {
    if (getLineServiceEnvDB.data && getLineServiceEnvDB.data.env) {
      form.reset({
        channelId: getLineServiceEnvDB.data.env.data.channelId,
        channelSecret: getLineServiceEnvDB.data.env.data.channelSecret,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getLineServiceEnvDB.data?.env]);

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">LINE Social Account Settings</h1>
        <p className="text-muted-foreground text-sm">
          Here you can configure your LINE social account settings for your
          project.
        </p>
      </div>
      <div className="flex space-x-2 items-center">
        <Switch checked={Enable} onCheckedChange={setEnable}>
          Enable LINE Integration
        </Switch>
        <Label className="text-muted-foreground font-semibold">
          Enable or disable LINE social account integration for this project.
        </Label>
      </div>
      <div className="flex flex-col space-y-4 w-full max-w-2xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="channelId"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormLabel
                    className={`${
                      Enable ? "text-primary" : "text-muted-foreground"
                    } w-36`}
                  >
                    Channel ID :
                  </FormLabel>
                  <FormControl>
                    <Input
                      autoFocus={Enable}
                      {...field}
                      placeholder="Enter your LINE Channel ID"
                      disabled={!Enable}
                      type={View.channelId ? "text" : "password"}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    size={"icon"}
                    disabled={!Enable}
                    onClick={() =>
                      setView((prev) => ({
                        ...prev,
                        channelId: !prev.channelId,
                      }))
                    }
                  >
                    {View.channelId ? <EyeIcon /> : <EyeOff />}
                  </Button>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="channelSecret"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormLabel
                    className={`${
                      Enable ? "text-primary" : "text-muted-foreground"
                    } w-36`}
                  >
                    Channel Secret :
                  </FormLabel>
                  <FormControl>
                    <Input
                      autoFocus={Enable}
                      {...field}
                      placeholder="Enter your LINE Channel Secret"
                      disabled={!Enable}
                      type={View.channelSecret ? "text" : "password"}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    size={"icon"}
                    disabled={!Enable}
                    onClick={() =>
                      setView((prev) => ({
                        ...prev,
                        channelSecret: !prev.channelSecret,
                      }))
                    }
                  >
                    {View.channelSecret ? <EyeIcon /> : <EyeOff />}
                  </Button>
                </FormItem>
              )}
            />

            <div className="w-full justify-end items-end flex">
              <Button
                type="submit"
                className="mt-4"
                disabled={
                  form.watch("channelId") === "" ||
                  form.watch("channelSecret") === "" ||
                  !Enable ||
                  createLineServiceEnvDB.isPending
                }
              >
                {createLineServiceEnvDB.isPending ? <Loader2 className="animate-spin" /> : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
