import { useEffect, useReducer, useState } from 'react'

export const PAUSE = 0
export const COUNTING = 1

export type State = typeof PAUSE | typeof COUNTING

type room = {
	inittime: number
	time: number
	state: State
}

export default function useRoom(id: number) {
	const [room, updateRoom] = useReducer(
		(state: room, action: Partial<room>) => {
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

	// update room with pooling or websocket

	return {
		...room,
		start() {
			updateRoom({ state: COUNTING })
		},
		pause() {
			updateRoom({ state: PAUSE })
		},
		setTime(n: number) {
			if (room.state !== PAUSE) return
			room.time = room.inittime = n
		},
		reset() {
			room.time = room.inittime
		},
	}
}

export type Room = ReturnType<typeof useRoom>
