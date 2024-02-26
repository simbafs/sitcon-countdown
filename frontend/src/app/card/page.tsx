"use client"

import useQuery from "@/hooks/useQuery"
import useSWR from 'swr'

export type Subtitle = {
    type: string
    title: string
    start: string
    end: string
    talker: string
}

export default function Page() {
    const sessionId = useQuery('id')
    const { data, error } = useSWR<Subtitle>(`/api/subtitle/${sessionId}`, url => fetch(url).then(res => res.json()))

    if (error) return <>
        <h1>Error</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
    </>

    if (!data) return <h1>Loading...</h1>

    // return <pre>{JSON.stringify(data, null, 2)}</pre>
    return <div className="flex flex-col gap-4">
        <h2 className="text-[8vw]">{data.type}</h2>
        <h1 className="text-[10vw]">{data.title}</h1>
        <p className="text-[6vw]">{data.start}-{data.end}</p>
        <p className="text-[6vw] text-right">--{data.talker}</p>

    </div>
}
