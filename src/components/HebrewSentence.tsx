import { ReactNode } from "react"

interface Props {
    children: ReactNode;
}

export default function HebrewSentence({ children }: Props) {
    return <div className="sentence">{children}</div>
}