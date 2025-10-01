import BillingLayout from "@/modules/manager/billing/components/billing-layout";

interface PageProps {
  params: Promise<{ project: string }>;
}

export default async function page({ params }: PageProps) {
  const { project } = await params;
  return (
    <div className="flex p-4 rounded-md flex-col w-full max-w-5xl mx-auto">
        <BillingLayout team={project} />
    </div>
  )
}
