import { useEffect, useState } from 'react'

export default function useTime() {
	const [time, setTime] = useState<any>(null)

	function updateTime() {
		fetch('/api/time')
			.then(res => res.json())
			.then(setTime)
		.catch(console.error)
	}

	useEffect(() => {
	    updateTime()
	    const i = setInterval(updateTime, 500)
	    return () => {
	        clearInterval(i)
	    }
	}, [])

	return new Date(time?.time || '')
}
