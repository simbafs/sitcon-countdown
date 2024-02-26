'use client'

import useQuery from '@/hooks/useQuery'
import useSWR from 'swr'
import { useEffect } from 'react'

export type Card = {
	type: string
	zh: {
		title: string
	}
	start: string
	end: string
	speakers: string[]
}

export default function Page() {
	const sessionId = useQuery('id')
	const room = useQuery('room')
	const api_url = sessionId != "" ? `/api/card/${sessionId}` : `/api/card/room/${room}`
	const { data, error } = useSWR<Card>(api_url, url => fetch(url).then(res => res.json()), {
		refreshInterval: 500,
	})

	useEffect(() => console.log(data), [data])

	if (error)
		return (
			<>
				<h1>Error</h1>
				<pre>{JSON.stringify(error, null, 2)}</pre>
			</>
		)

	if (!data) return <h1>Loading...</h1>

	// return <pre>{JSON.stringify(data, null, 2)}</pre>
	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-[8vw]">{data.type}</h2>
			<h1 className="text-[10vw]">{data.zh.title}</h1>
			<p className="text-[6vw]">
				{data.start}-{data.end}
			</p>
			{data.speakers.map(speaker => (
				<p key={speaker} className="text-[6vw]">
					{speaker}
				</p>
			))}
		</div>
	)
}
