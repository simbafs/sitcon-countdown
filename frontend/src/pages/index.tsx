import useQuery from '@/hooks/useQuery'
import { type RoomData } from '@/hooks/useRoom'
import useWebSocket from 'react-use-websocket'

export default function Home() {
	const roomid = useQuery('id')[0]
	const { lastMessage } = useWebSocket('ws://localhost:3000/ws', {
		shouldReconnect: () => true,
	})

	function getTime(msg: MessageEvent, roomid: number) {
		const data = JSON.parse(msg.data) as { rooms: RoomData[]; serverTime: number }
		return data.rooms[roomid]?.time
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

	return (
		<>
			<h1 className="text-[50vw] leading-[0.8]">{getTime(lastMessage, +roomid)}</h1>
		</>
	)
}
