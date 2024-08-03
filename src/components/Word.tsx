interface Props {
    word: string
    onClick: (word: string) => void
}

export default function Word({ word, onClick }: Props) {
    return <button className="word" onClick={() => onClick(word)}>{word}</button>
}