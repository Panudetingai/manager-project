import { VerifyEmailCard } from "@/modules/auth/verify-email/components/card-verify-email";

export default function page() {
  return (
    <div className="flex flex-col justify-center items-center h-svh">
      <VerifyEmailCard />
    </div>
  );
}
