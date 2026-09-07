import { PRIORITY } from '../../constants/formWish'
import './WishFilters.css'

interface Props {
	selectedPriorities: number[]
	selectedLabels: string[]
	labels: string[]
	onTogglePriority: (priority: number) => void
	onToggleLabel: (label: string) => void
}

export default function WishFilters({
	selectedPriorities,
	selectedLabels,
	labels,
	onTogglePriority,
	onToggleLabel,
}: Props) {
	return (
		<section className="wish-filters">
			<div className="wish-filters__group">
				<h3 className="wish-filters__label">Prioridades</h3>
				<div className="wish-filters__options" role="group" aria-label="Prioridades">
					{PRIORITY.map((priority) => {
						const isSelected = selectedPriorities.includes(priority.value)

						return (
							<button
								key={priority.value}
								type="button"
								className={`wish-filters__button ${isSelected ? 'is-selected' : ''}`}
								aria-pressed={isSelected}
								onClick={() => onTogglePriority(priority.value)}
							>
								{priority.text}
							</button>
						)
					})}
				</div>
			</div>

			<div className="wish-filters__group">
				<h3 className="wish-filters__label">Etiquetas</h3>
				<div className="wish-filters__options" role="group" aria-label="Etiquetas">
					{labels.map((label) => {
						const isSelected = selectedLabels.includes(label)

						return (
							<button
								key={label}
								type="button"
								className={`wish-filters__button ${isSelected ? 'is-selected' : ''}`}
								aria-pressed={isSelected}
								onClick={() => onToggleLabel(label)}
							>
								{label}
							</button>
						)
					})}
				</div>
			</div>
		</section>
	)
}

