import { Room } from '@/hooks/useRoom'
import { btn } from '@/varients/btn'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

type Props = {
	room: Room
	close: () => void
}

export default function SetTime({ room, close }: Props) {
	const [minute, setMinute] = useState(Math.floor(room.time / 60))
	const [second, setSecond] = useState(room.time % 60)
	return (
		<div className="fixed h-screen w-screen top-0 left-0 grid place-items-center bg-stone-400/30" onClick={close}>
			<div
				className="p-4 rounded-lg bg-sky-800 text-white flex flex-col gap-4"
				onClick={e => e.stopPropagation()}
			>
				<h1 className="text-3xl text-center">Room {room.id}</h1>
				<div className="grid grid-cols-2 gap-2 place-items-center w-[300px]">
					<input
						type="number"
						value={minute}
						onChange={e => setMinute(e.target.valueAsNumber)}
						className="text-black p-2 rounded w-full"
					/>
					<input
						type="number"
						value={second}
						onChange={e => setSecond(e.target.valueAsNumber)}
						className="text-black p-2 rounded w-full"
						onBlur={() => {
							setMinute(minute => minute + Math.floor(second / 60))
							setSecond(second % 60)
						}}
					/>
					<button
						className={twMerge(btn(), 'w-full')}
						onClick={() => {
							room.setTime(minute * 60 + second)
							close()
						}}
					>
						Set
					</button>
					<button className={twMerge(btn(), 'w-full')} onClick={close}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	)
}
