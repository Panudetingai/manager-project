"use client";
import { CheckCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex justify-center items-center flex-col">
        <CheckCircle size={32} className="text-green-400" />
        <h1 className="text-xl font-medium mb-2">Payment Successful</h1>
        <p className="text-muted-foreground text-sm">
          Payment Successfully Completed! You&apos;re now a member of
          equipment-mvp.
        </p>
        <span className="text-muted-foreground text-sm">
          You Can start using new Feature for equipment-mvp
        </span>
        <Link
          href={"/dashboard"}
          onClick={() => {
            router.back();
          }}
          className="group mt-2 text-sm text-muted-foreground flex items-center gap-[0.2] !no-underline cursor-pointer"
        >
          Go to Dashboard{" "}
          <ChevronRight
            className="mt-[1] transition-all group-hover:translate-x-1"
            size={16}
          />
        </Link>
      </div>
    </div>
  );
}
