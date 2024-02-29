'use client'

import useQuery from '@/hooks/useQuery'
import useSWR from 'swr'
import { useEffect } from 'react'
import x from '@/img/x.svg'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'
import { InvalidURL } from './InvalidURL'

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
	const api_url = sessionId != '' ? `/api/card/${sessionId}` : `/api/card/room/${room}`
	const { data, error } = useSWR<Card>(api_url, url => fetch(url).then(res => res.json()), {
		refreshInterval: 500,
	})

	useEffect(() => console.log(data), [data])

	if (room == '' && sessionId == '') return <InvalidURL />

	if (error)
		return (
			<>
				<h1>Error</h1>
				<pre>{JSON.stringify(error, null, 2)}</pre>
			</>
		)

	if (!data) return <h1>Loading...</h1>

	const speaker = data.speakers.join('、')

	return (
		<div className="w-screen h-screen bg-transparent overflow-hidden">
			<div className="aspect-[1.8/1] w-[70vw] bg-[#f7f6f6] flex flex-col shadow-[18px_18px_50px_0px_rgba(0,0,0,0.1)]">
				<div className="bg-[#406096] h-[6vw] flex justify-end items-center">
					<Image src={x} width={18} height={18} alt="Close" className="h-[4vw] w-[4vw] mr-[2vw]" />
				</div>
				<div className="px-[6vw] py-[2vw] grow flex flex-col">
					<h1 className="text-[#9f3b24] text-[5vw]">{data.zh.title}</h1>
					<div className="flex flex-wrap grow items-center">
						<h2 className="text-[#383839] text-[4vw]">
							{data.start}-{data.end}
						</h2>
						<span className="grow" />
						<h2 className={twMerge("text-[#383839]", speaker.length > 60 ? 'text-[3vw]' : 'text-[4vw]')}>{speaker}</h2>
					</div>
				</div>
			</div>
		</div>
	)
}
