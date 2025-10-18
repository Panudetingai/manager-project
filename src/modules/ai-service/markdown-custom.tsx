import Markdown from "react-markdown"

interface MarkdownCustomtype {
    children: string | null | undefined,
}

export default function MarkdownCustom({children}: MarkdownCustomtype) {
  return (
    <Markdown>
        {children}
    </Markdown>
  )
}
