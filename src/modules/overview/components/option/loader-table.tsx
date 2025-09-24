import { LoaderCircle } from "lucide-react";

export default function LoaderTable() {
  return (
    <div className="flex justify-center items-center h-52">
      <LoaderCircle className="animate-spin" />
    </div>
  );
}
