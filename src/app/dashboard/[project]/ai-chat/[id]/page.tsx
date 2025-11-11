import ChatBox from "@/modules/feature/chat-box";

interface PageParams {
  params: {
    id: Promise<string>;
  };
}

export default async function Page({params}: PageParams) {
  const {id} = await params;
  return (
    <div className="flex flex-col max-w-4xl mx-auto w-full max-sm:w-full">
      <ChatBox params={{
        id: id,
      }} />
    </div>
  );
}
