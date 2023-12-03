import { COUNTING, type Room } from '@/hooks/useRoom'

export default function Time({ room }: { room: Room }) {
	return (
		<input
			type="number"
			readOnly={room.state === COUNTING ? true : false}
			value={room.time}
			onChange={e => {
				if (room.state === COUNTING) return

				room.setTime(e.target.valueAsNumber)
			}}
		/>
	)
}
