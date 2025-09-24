import Cardlistuser from "@/modules/overview/components/card-list-user";

type Params = {
  params: {
    project: Promise<string>;
  };
};

export default async function Page({ params }: Params) {
  const { project } = await params;
  return (
    <div className="flex items-center ">
      <Cardlistuser />
    </div>
  );
}
