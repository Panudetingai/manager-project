import ChatBox from "@/modules/feature/chat-box";

export default async function Page() {
  return (
    <div className="flex flex-col max-w-4xl mx-auto w-full max-sm:w-full">
      <ChatBox />
    </div>
  );
}
