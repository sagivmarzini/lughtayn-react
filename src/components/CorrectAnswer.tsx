interface Props {
    show: boolean
    isCorrect: boolean
    taatik?: string
    arabic?: string
}

export default function CorrectAnswer({ show, taatik, arabic, isCorrect }: Props) {
    return (
        <div className={`correct-answer-container ${show ? 'show' : ''} ${isCorrect ? 'correct' : 'incorrect'}`}>
            <h3>התשובה הנכונה:</h3>
            <div className="correct-answer">
                <p className="taatik">{taatik}</p>
                <p className="arabic">{arabic}</p>
            </div>
        </div>
    )
}