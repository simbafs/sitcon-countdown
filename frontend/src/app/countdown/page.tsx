'use client'
import useQuery from '@/hooks/useQuery'
import { type RoomData } from '@/hooks/useRoom'
import useWsHost from '@/hooks/useWsHost'
import toTime from '@/utils/toTime'
import useWebSocket from 'react-use-websocket'

export default function Home() {
	const roomid = useQuery('id')
	const { lastMessage } = useWebSocket(useWsHost(), {
		shouldReconnect: () => true,
	})

	function getTime(msg: MessageEvent, roomid: number) {
		const data = JSON.parse(msg.data) as { rooms: RoomData[]; serverTime: number }
		return toTime(data.rooms[roomid]?.time)
	}

	if (!roomid || isNaN(+roomid)) {
		return (
			<>
				<h1>choose a room id by add querystring `id=0`</h1>
			</>
		)
	}

	if (!lastMessage) {
		return (
			<>
				<h1>Loading...</h1>
			</>
		)
	}

	return <div className="w-screen h-screen grid place-items-center">
		<h1 className="text-[35vw] leading-[0.8]">{getTime(lastMessage, +roomid)}</h1>
	</div>
}
