'use client'
import useSWR, { mutate } from 'swr'
import { type setEditor, useEditTime } from '@/components/useEditTime'

type TSession = {
	id: string
	type: string
	room: string
	start: string
	end: string
	zh: {
		title: string
	}
	speakers: string[]
}

function GridCell({ children, edit }: { children: React.ReactNode; edit?: () => void }) {
	if (typeof children === 'string') {
		return (
			<div className="grid place-items-center bg-white" onClick={edit}>
				<p>{children}</p>
			</div>
		)
	} else {
		return (
			<div className="grid place-items-center bg-white" onClick={edit}>
				{children}
			</div>
		)
	}
}

function Session({ session, setEditor }: { session: TSession; setEditor: setEditor }) {
	const edit = (field: 'start' | 'end', value: string) => {
		console.log({ id: session.id, field, value })
		setEditor(value)
			.then(time => {
				console.log({ time })

				return fetch(`/api/card/${session.id}`, {
					method: 'POST',
					body: JSON.stringify({
						start: field === 'start' ? time : session.start,
						end: field === 'end' ? time : session.end,
					}),
				})
			})
			.then(res => {
				if (res.ok) {
					return res.json()
				} else {
					throw res.json()
				}
			})
			.then(console.log)
			.then(() => mutate('/api/card'))
			.catch(console.error)
	}

	return (
		<>
			<GridCell>{session.id}</GridCell>
			<GridCell>{session.type}</GridCell>
			<GridCell>{session.room}</GridCell>
			<GridCell edit={() => edit('start', session.start)}>{session.start}</GridCell>
			<GridCell edit={() => edit('end', session.end)}>{session.end}</GridCell>
			<GridCell>{session.zh.title}</GridCell>
			<GridCell>{session.speakers.join(', ')}</GridCell>
		</>
	)
	// return <pre>{JSON.stringify(session, null, 2)}</pre>
}

export default function Page() {
	const { data, error } = useSWR<Record<string, TSession>>('/api/card', url => fetch(url).then(res => res.json()))
	const [Editor, setEditor] = useEditTime()

	if (error) {
		return (
			<>
				<h1>Admin</h1>
				<p>Error: {JSON.stringify(error)}</p>
			</>
		)
	}

	if (!data) return <h1>Loading...</h1>

	return (
		<>
			<Editor />
			<div className="grid grid-cols-7 bg-black gap-[1px] m-4 border border-black">
				<GridCell>ID</GridCell>
				<GridCell>Type</GridCell>
				<GridCell>Room</GridCell>
				<GridCell>Start</GridCell>
				<GridCell>End</GridCell>
				<GridCell>Title</GridCell>
				<GridCell>Speakers</GridCell>
				{Object.values(data).map(session => (
					<Session key={session.id} session={session} setEditor={setEditor} />
				))}
			</div>
		</>
	)
}
