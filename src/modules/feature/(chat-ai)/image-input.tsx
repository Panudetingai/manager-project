import { Message, MessageContent } from "@/components/ai-elements/message";
import { Button } from "@/components/ui/button";
import { FileUIPart, UIMessage } from "ai";
import { XIcon } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface ImagePreviewProps {
  i: string;
  message: UIMessage;
  part: FileUIPart;
}

export default function ImagePreview({ i, message, part }: ImagePreviewProps) {
  const [preview, setPreview] = useState(false);

  return (
    <>
      <Message key={`${message.id}-${i}`} from={message.role}>
        <MessageContent
          onClick={() => setPreview(true)}
          className="p-0 border shadow cursor-zoom-in"
        >
          <motion.img
            width={400}
            height={400}
            src={part.url}
            alt={"file attachment"}
            className="max-w-xs rounded-md"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        </MessageContent>
      </Message>

      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setPreview(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setPreview(false);
          }}
          tabIndex={-1}
          ref={(el) => {
            if (el) el.focus();
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            className="relative z-10 max-h-[90vh] max-w-[90vw]"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              src={part.url}
              alt={"file attachment"}
              className="h-auto w-auto max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl"
            />
            <Button
              type="button"
              aria-label="Close"
              onClick={() => setPreview(false)}
              className="absolute -top-3 h-8 w-8 -right-3 rounded-full bg-black/70 text-white p-2 leading-none hover:bg-black focus:outline-none focus:ring-2 focus:ring-white"
            >
              <XIcon />
            </Button>
          </motion.div>
        </div>
      )}
    </>
  );
}