import { ReactNode } from "react"

interface Props{
    children: ReactNode
    disabled?: boolean
    onClick: () => void
}

export default function CheckButton({ children, disabled, onClick }: Props) {
    return <button className="check submit" onClick={onClick} disabled={disabled && true}>{children}</button>
}