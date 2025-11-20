import { Button } from "@/components/ui/button";
import { Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function AppToggleMode() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant={"ghost"}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="rotate-0 scale-100 transition-all hover:text-yellow-500 dark:-rotate-90 dark:scale-0" />
      <Sun className="absolute rotate-90 scale-0 transition-all hover:text-yellow-500 dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
