import { useEffect, useState } from 'react'

export default function useWsHost() {
	const [ws, setWs] = useState<null | string>(null)

	useEffect(() => {
		const protocal = window.location.protocol === 'https://' ? 'wss://' : 'ws://'
		const host = window.location.host

		setWs(`${protocal}${host}/ws`)
	}, [])

	return ws
}
