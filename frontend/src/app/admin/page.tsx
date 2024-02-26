'use client'
import useRoom, { COUNTING, PAUSE, type Room, type RoomData } from '@/hooks/useRoom'
import useWebSocket from 'react-use-websocket'
import { useEffect, useState } from 'react'
import useWsHost from '@/hooks/useWsHost'
import { btn } from '@/varients/btn'
import Link from 'next/link'
import SetTime from '@/components/setTime'
import toTime from '@/utils/toTime'
import { Admin } from '@/components/admin'

function Row({ name, room }: { name: string; room: Room }) {
	const [open, setOpen] = useState(false)
	return (
		<div className="grid gap-4 grid-cols-1 lg:grid-cols-[2fr_4fr]">
			<div className="grid grid-cols-2 gap-6">
				<h2 className="text-center text-3xl">{name}</h2>
				<p>{toTime(room.time)}</p>
			</div>
			<div className="grid grid-cols-5 gap-6">
				<button
					className={btn({ color: room.state === PAUSE ? 'green' : 'normal' })}
					onClick={room.start}
					disabled={room.state === COUNTING}
				>
					開始
				</button>
				<button
					className={btn({ color: room.state === COUNTING ? 'red' : 'normal' })}
					onClick={room.pause}
					disabled={room.state === PAUSE}
				>
					暫停
				</button>
				<button className={btn({ color: 'yellow' })} onClick={room.reset}>
					重設
				</button>
				<button className={btn({ color: 'yellow' })} onClick={() => setOpen(true)}>
					設定時間
				</button>
				<Link className={btn()} href={`/?id=${room.id}`} target="_blank">
					開啟頁面
				</Link>
			</div>
			{open && <SetTime room={room} close={() => setOpen(false)} />}
		</div>
	)
}

function formatTime(time: number) {
	const timeO = new Date(time)
	function to2(n: number) {
		if (n < 10) return '0' + n
		else return '' + n
	}
	return `${to2(timeO.getHours())}:${to2(timeO.getMinutes())}:${to2(timeO.getSeconds())}`
}

export default function Page() {
	const [time, setTime] = useState(0)
	const room0 = useRoom(0)
	const room1 = useRoom(1)
	const room2 = useRoom(2)
	const room3 = useRoom(3)
	const room4 = useRoom(4)

	const rooms = [room0, room1, room2, room3, room4]

	const { lastMessage } = useWebSocket(useWsHost(), {
		shouldReconnect: () => true,
	})

	// update room with pooling or websocket
	useEffect(() => {
		if (!lastMessage) return
		const data = JSON.parse(lastMessage.data) as { rooms: RoomData[]; serverTime: number }
		for (let i in data.rooms) {
			rooms[i].updateRoom(data.rooms[i])
		}
		setTime(data.serverTime)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lastMessage])

	return (
		<Admin>
			<div className="min-h-screen w-screen py-[100px] px-[50px] lg:px-[100px] flex flex-col justify-center items-center">
				<div className="w-full grid gap-[50px]">
					<Row name="Room 0" room={room0} />
					<Row name="Room 1" room={room1} />
					<Row name="Room 2" room={room2} />
					<Row name="Room 3" room={room3} />
					<Row name="Room 4" room={room4} />
				</div>
				<h1 className="mt-10 text-2xl">現在時間: {formatTime(time)}</h1>
			</div>
		</Admin>
	)
}
