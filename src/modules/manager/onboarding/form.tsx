"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserClient } from "@/lib/supabase/getUser-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import pathsConfig from "../../../../config/app.router";
import { steps } from "./const/onboard-const";
import { descriptiontype, onboardSchema } from "./schema/onboard-schema";
import { submitOnboarding } from "./server/api";

export default function OnboardForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUserClient,
    staleTime: Infinity,
  });

  const form = useForm<descriptiontype>({
    resolver: zodResolver(onboardSchema),
    defaultValues: {
      name: "",
      email: "",
      social: "",
      workspaceName: "workspace",
      companyDomain: "",
      teamSize: "",
      role: "",
      preferredLanguage: "",
      primaryUseCase: "",
    },
  });

  // mutation submit
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: submitOnboarding,
    onSuccess: () => {
      router.push(
        pathsConfig.app.workspaceDashboard.replace(
          "[workspace]",
          form.getValues("workspaceName")
        )
      );
    },
  });

  // set default name and email from user
  useEffect(() => {
    if (user) {
      form.setValue("name", user.user_metadata.full_name || "");
      form.setValue("email", user.email || "");
    }
  }, [user, form]);

  // watch form value change
  useEffect(() => {
    const subscription = form.watch(() => {
      setIsFormValid(checkedValidation());
    });

    setIsFormValid(checkedValidation());
    return () => subscription.unsubscribe();
  }, [form, currentStep]); // eslint-disable-line react-hooks/exhaustive-deps

  // submit form
  const handleSubmit = form.handleSubmit((value) => {
    mutate(value);
  });

  // get current step
  const onboard = useMemo(() => {
    return steps[currentStep];
  }, [currentStep]);

  // check validation from current step
  const checkedValidation = () => {
    const values = form.getValues();
    const fields = onboard.field.map((f) => f.name);
    for (const field of fields) {
      if (!values[field as keyof descriptiontype]) {
        return false;
      }
    }
    const option = onboard.option?.map((o) => o.name) || [];
    if (option.length > 0) {
      if (!values["social"]) {
        return false;
      }
    }
    return true;
  };

  // Next Step
  const onboardNext = () => {
    if (!checkedValidation()) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
      return;
    }
    handleSubmit();
  };

  if (isLoading) {
    return <LoaderCircle className="animate-spin" />;
  }

  return (
    <div>
      <Card className="w-sm max-w-sm duration-300 transition-all">
        <CardHeader>
          <CardTitle>{onboard.title}</CardTitle>
          <CardDescription>{onboard.desc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form className="space-y-4">
              {onboard.field.map((f) => (
                <div key={f.name} className="space-y-4">
                  <FormField
                    control={form.control}
                    name={f.name as keyof descriptiontype}
                    render={({ field: controllerField }) => (
                      <FormItem>
                        <FormLabel>{f.label ?? f.name}</FormLabel>
                        <FormControl>
                          <Input
                            {...controllerField}
                            placeholder={f.placeholder}
                            disabled={isPending || isSuccess}
                            type={f.type}
                            onChange={(e) =>
                              form.setValue(
                                f.name as keyof descriptiontype,
                                e.target.value
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {f.name === "email" &&
                    onboard.option &&
                    onboard.option.length > 0 && (
                      <FormField
                        control={form.control}
                        name="social"
                        key="social"
                        render={({ field: controllerField }) => (
                          <FormItem>
                            <FormLabel>Social Media</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) => {
                                  controllerField.onChange(value);
                                  form.setValue("social", value);
                                }}
                                value={controllerField.value}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a social media platform" />
                                </SelectTrigger>
                                <SelectContent>
                                  {onboard.option?.map((o, i) => (
                                    <SelectItem
                                      key={i}
                                      value={o.name}
                                      onSelect={() => {
                                        controllerField.onChange(o.name);
                                      }}
                                    >
                                      {o.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                </div>
              ))}
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button
            onClick={onboardNext}
            disabled={!checkedValidation() || isPending}
            className="w-full cursor-pointer"
          >
            {isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <>
                {isSuccess ? (
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-6 h-6 mb-[0.2]" />
                    <span className="">Completed</span>
                  </div>
                ) : (
                  <>{currentStep < steps.length - 1 ? "Next" : "Finish"}</>
                )}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="flex items-center justify-center space-x-2 mt-6">
        {steps.map((_, index) => (
          <Button
            disabled={!isFormValid}
            onClick={() => {
              setCurrentStep(index);
            }}
            key={index}
            className={`h-2 rounded-full transition-all !p-0 duration-300 ${
              index === currentStep ? "w-8 bg-primary" : "w-4 bg-gray-300"
            }`}
          ></Button>
        ))}
      </div>
    </div>
  );
}
