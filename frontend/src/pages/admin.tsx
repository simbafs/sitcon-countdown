import useRoom, { type Room, type RoomData } from '@/hooks/useRoom'
import Btn from '@/components/Btn'
import Time from '@/components/Time'
import useWebSocket from 'react-use-websocket'
import { useEffect, useState } from 'react'
import useWsHost from '@/hooks/useWsHost'

function Row({ name, room }: { name: string; room: Room }) {
	return (
		<div className="grid gap-4 grid-cols-1 lg:grid-cols-[2fr_4fr]">
			<div className="grid grid-cols-2 gap-6">
				<h2 className="text-center text-3xl">{name}</h2>
				<Time room={room}/>
			</div>
			<div className="grid grid-cols-4 gap-6">
				<Btn onClick={room.start} color={'green'}>
					開始
				</Btn>
				<Btn onClick={room.pause} color={'red'}>
					暫停
				</Btn>
				<Btn onClick={room.reset} color={'yellow'}>
					重設
				</Btn>
				<Btn onClick={() => {}}>開啟頁面</Btn>
			</div>
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
		<div className="min-h-screen w-screen py-[100px] px-[50px] lg:px-[100px] flex flex-col justify-center items-center">
			<div className="w-full grid gap-[50px]">
				<Row name="room0" room={room0} />
				<Row name="room1" room={room1} />
				<Row name="room2" room={room2} />
				<Row name="room3" room={room3} />
				<Row name="room4" room={room4} />
			</div>
			<h1 className="mt-10 text-2xl">現在時間: {formatTime(time)}</h1>
		</div>
	)
}
