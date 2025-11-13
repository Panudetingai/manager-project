"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useUserVerify } from "../hooks/userverify";

export function VerifyEmailCard() {
  const { mutate: Callback } = useUserVerify();
  const searchParams = useSearchParams();
  const code = searchParams.get("code") as string;
  useEffect(() => {
    Callback(code);
  }, [code, Callback]);

  return (
    <Card className="w-1/3 max-sm:w-2xl">
      <CardHeader>
        <CardTitle className="text-lg flex gap-2 items-center">
          <CheckCircle size={24} />
          Verify Your Email
        </CardTitle>
        <CardDescription className="text-sm">
          We have sent a verification email to your email address. Please check
          your inbox and click on the verification link to complete the process.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href={"/auth/sign-in"} className="w-full cursor-pointer">
          <Button className="w-full" variant={"outline"}>
            Back to Sign In
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
