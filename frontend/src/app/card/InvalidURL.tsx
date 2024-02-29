'use client'

import { useRouter } from 'next/navigation'
import { FormEventHandler, useState } from 'react'

export function InvalidURL() {
	const [id, setId] = useState('')
	const [room, setRoom] = useState('')
	const router = useRouter()

	const go: FormEventHandler<HTMLFormElement> = e => {
		e.preventDefault()
		console.log({ id, room })
		if (id) router.push(`/card?id=${id.toLowerCase()}`)
		else if (room) router.push(`/card?room=${room.toUpperCase()}`)
	}

	return (
		<>
			<h1>缺少議程 id 或是議程廳</h1>
			<p>
				請在網址後面加上 <code>?id=議程id</code> 或是 <code>?room=議程廳</code>
			</p>
			<form className="flex flex-col gap-4 w-60" onSubmit={go}>
				<input
					type="text"
					placeholder="議程 id"
					value={id}
					onChange={e => setId(e.target.value)}
					className="border-2 border-black"
				/>
				<input
					type="text"
					placeholder="議程廳"
					value={room}
					onChange={e => setRoom(e.target.value)}
					className="border-2 border-black"
				/>
				<button type="submit">前往議程</button>
			</form>
		</>
	)
}
