'use client'

import { useRouter } from 'next/navigation'
import { FormEventHandler, useState } from 'react'

export function InvalidURL() {
	const [id, setId] = useState('')
	const router = useRouter()

	const go: FormEventHandler<HTMLFormElement> = e => {
		e.preventDefault()
		if (id) router.push(`/countdown?id=${id.toLowerCase()}`)
	}

	return (
		<>
			<h1>缺少議程廳編號</h1>
			<p>
				請在網址後面加上 <code>?id=議程廳編號</code>
			</p>
			<form className="flex flex-col gap-4 w-60" onSubmit={go}>
				<input
					type="text"
					placeholder="議程 id"
					value={id}
					onChange={e => setId(e.target.value)}
					className="border-2 border-black"
				/>
				<button type="submit">前往議程</button>
			</form>
		</>
	)
}
