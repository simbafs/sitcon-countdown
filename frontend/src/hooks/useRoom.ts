import { useEffect, useReducer } from 'react'
import useWebSocket from 'react-use-websocket'

export const PAUSE = 0
export const COUNTING = 1

export type State = typeof PAUSE | typeof COUNTING

export type RoomData = {
	inittime: number
	time: number
	state: State
}

export default function useRoom(id: number) {
	const [room, updateRoom] = useReducer(
		(state: RoomData, action: Partial<RoomData>) => {
			return {
				...state,
				...action,
			}
		},
		{
			inittime: 10,
			time: 0,
			state: 0,
		}
	)

	// init room
	useEffect(() => {
		fetch(`/api/room/${id}`)
			.then(res => res.json())
			.then(data => updateRoom(data.room as Room))
			.catch(console.error)
	}, [id])

	return {
		...room,
		id,
		updateRoom,
		start() {
			fetch(`/api/room/${id}`, {
				method: 'post',
				body: JSON.stringify({
					...room,
					state: COUNTING,
				}),
			}).then(res => {
				if (res.ok) updateRoom({ state: COUNTING })
			})
		},
		pause() {
			fetch(`/api/room/${id}`, {
				method: 'post',
				body: JSON.stringify({
					...room,
					state: PAUSE,
				}),
			}).then(res => {
				if (res.ok) updateRoom({ state: PAUSE })
			})
		},
		setTime(n: number) {
			if (room.state !== PAUSE) return
			room.time = room.inittime = n
			fetch(`/api/room/${id}`, {
				method: 'post',
				body: JSON.stringify({
					...room,
					time: n,
					inittime: n,
				})
			})
		},
		reset() {
			fetch(`/api/room/${id}`, {
				method: 'post',
				body: JSON.stringify({
					...room,
					time: room.inittime,
					state: PAUSE,
				}),
			}).then(res => {
				if (res.ok) {
					updateRoom({
						time: room.inittime,
						state: PAUSE,
					})
				}
			})
		},
	}
}

export type Room = ReturnType<typeof useRoom>
