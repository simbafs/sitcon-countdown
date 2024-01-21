import { COUNTING, type Room } from '@/hooks/useRoom'

export default function Time({ room }: { room: Room }) {
	return (
		<input
			type="number"
			readOnly={room.state === COUNTING}
			value={room.time}
			onChange={e => {
				if (room.state === COUNTING) return
				console.log(e.target.value, e.target.valueAsNumber, room.state)

				room.setTime(e.target.valueAsNumber)
			}}
		/>
	)
}
