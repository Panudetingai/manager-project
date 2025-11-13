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
import { useSearchParams } from "next/navigation";
import { createClient } from "../../../../../utils/supabase/client";

import Link from "next/link";
import { useEffect } from "react";

export function VerifyEmailCard() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    const verifyEmail = async () => {
      if (code) {
        const supabase = createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          code
        );
        if (!data.session) return console.error("No session data", error);

        const { error: accountError } = await supabase.from("account").upsert([
          {
            id: data.session.user.id,
            email: data.session.user.email,
            username: data.session.user.user_metadata.full_name,
            avatar_url: data.session.user.user_metadata.avatar_url,
            updated_at: new Date().toISOString(),
          },
        ]);
        if (accountError) throw new Error(accountError.message);
      }
    };
    verifyEmail();
  }, [code]);

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
