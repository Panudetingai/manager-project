import Chatlayout from "@/modules/feature/layout/chat-layout";

interface PageParams {
  params: {
    id: Promise<string>;
  };
}

export default async function Page({params}: PageParams) {
  const {id} = await params;
  return (
      <Chatlayout params={{id}} />
  );
}
