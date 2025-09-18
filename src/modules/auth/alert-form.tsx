import { XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const SignInAlert = () => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex w-full max-w-md items-start gap-4 rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm dark:border-red-800 dark:bg-red-900/20"
    >
      <div className="flex-shrink-0">
        <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-red-800 dark:text-red-200">
              Sign in failed
            </p>
            <p className="mt-1 text-xs text-red-700 dark:text-red-300">
              Please check your credentials and try again.
            </p>
          </div>
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
          >
            Sign Up
          </Link>
          <button
            onClick={() => toast.dismiss()}
            className="inline-flex items-center rounded-md border border-red-200 bg-white px-3 py-1 text-xs text-red-700 hover:bg-red-50 dark:border-red-800 dark:bg-transparent dark:text-red-300"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
const AlertForm = {
    SignInAlert,
}

export default AlertForm;
