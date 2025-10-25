import { motion } from "motion/react";

export default function ChatEmpty() {
  return (
    <div className="flex flex-col items-start gap-2">
      <motion.h1
        className="text-2xl font-semibold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        Welcome to the Chat!
      </motion.h1>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 , transition: { delay: 0.1 } }}
        exit={{ opacity: 0, y: -20 }}
        className="text-lg text-muted-foreground"
      >
        How can I help you today?
      </motion.h2>
    </div>
  );
}
