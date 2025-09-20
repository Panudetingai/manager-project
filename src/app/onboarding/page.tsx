import FormOnboard from "@/modules/manager/onboarding/form";
import appConfig from "../../../config/app.config";

export const generateMetadata = async () => {
  return {
    title: `Onboarding | ${appConfig.name}`,
  }
}

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 flex-col space-y-8">
        <FormOnboard />
    </div>
  )
}
