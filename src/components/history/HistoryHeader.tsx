import './HistoryHeader.css'

interface Props {
	hasHistory: boolean
	onClearHistory: () => void
}

export default function HistoryHeader({
	hasHistory,
	onClearHistory,
}: Props) {
	return (
		<header className="history-header">
			<h2 className="history-header__title">Historial</h2>

			<button
				type="button"
				className="history-header__clear-button"
				onClick={onClearHistory}
				disabled={!hasHistory}
			>
				Vaciar historial
			</button>
		</header>
	)
}
