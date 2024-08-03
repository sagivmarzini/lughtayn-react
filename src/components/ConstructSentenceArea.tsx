import Word from "./Word"

interface Props {
    words?: string[]
    onWordClick: (word: string) => void
}

export default function ConstructSentenceArea({ words, onWordClick }: Props) {
    return (
        <div className="construct-sentence">
            {words && words.map((word, wordIndex) => {
                return <Word word={word} onClick={() => onWordClick(word)} key={wordIndex}></Word>
            })}
        </div>
    )
}