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

	return <div className="w-screen h-screen bg-transparent overflow-hidden">
		<div className="aspect-[1.8/1] w-[80vw] bg-[#f7f6f6] flex flex-col shadow-[18px_18px_50px_0px_rgba(0,0,0,0.1)]">
			<div className="bg-[#406096] h-[6vw] flex justify-end">
				<div className="bg-white aspect-square grid place-items-center m-[1vw]">
					<p className="text-[#484747] text-[3vw]">X</p>
				</div>
			</div>
			<div className="px-[6vw] py-[2vw] grow flex flex-col">
				<h1 className="text-[#9f3b24] text-[6vw]">{data.zh.title}</h1>
				<div className="flex flex-wrap grow items-center">
					<h2 className="text-[#383839] text-[5vw]">{data.start}-{data.end}</h2>
					<span className="grow" />
					<h2 className="text-[#383839] text-[5vw]">{data.speakers.join('、')}</h2>

				</div>
			</div>
		</div>
	</div>
}
