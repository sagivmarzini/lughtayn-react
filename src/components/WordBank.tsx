import Word from "./Word"

interface Props {
    words?: string[]
    onWordClick: (word: string) => void
}

export default function WordBank({ words, onWordClick }: Props) {
    return <div className="word-bank">
        {words && words.map((word, wordIndex) => {
                return <Word word={word} onClick={() => onWordClick(word)} key={wordIndex}></Word>
            })}
    </div>
}