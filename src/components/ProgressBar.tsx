interface Props {
    percentage: number
}

export default function ProgressBar({ percentage }: Props) {
    return (
        <>
            <div className="progress-bar">
                <div className="progress" style={{width: percentage + '%'}}>
                    <div className="progress-shine"></div>
                </div>
            </div>
        </>
    )
}