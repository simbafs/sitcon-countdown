import { type State, COUNTING } from '@/hooks/useRoom'

export default function Time({ time, setTime, state }: { time: number; setTime: (n: number) => void; state: State }) {
	return (
		<input
			type="number"
			value={time}
			onChange={e => {
				if (state === COUNTING) return
				setTime(e.target.valueAsNumber)
			}}
		/>
	)
}
