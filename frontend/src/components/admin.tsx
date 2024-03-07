import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useLocalStorage } from 'usehooks-ts'

export function Admin({ children }: { children: React.ReactNode }) {
	const [token, setToken] = useLocalStorage('token', '')
	const [valid, setValid] = useState(false)
	const [invalid, setInvalid] = useState(false)

	useEffect(() => {
		verify(token)
	}, [])

	const verify = (token: string) => {
		fetch('/api/verify', {
			method: 'post',
			body: token,
		})
			.then(res => {
				if (res.ok) {
					setValid(true)
					setInvalid(false)
				} else {
					setInvalid(true)
					setValid(false)
				}
			})
			.catch(console.error)
	}

	if (valid) return children

	return (
		<div className="h-screen w-screen bg-teal-900 grid place-items-center">
			<form
				onSubmit={e => {
					e.preventDefault()
					verify(token)
				}}
				className="p-8 bg-white rounded-lg flex flex-col gap-4"
			>
				<h1 className="text-3xl text-center">Token</h1>
				<input
					className={twMerge(
						'outline-none border-2 p-2 rounded-lg',
						invalid ? 'border-red-500' : 'border-gray-300 focus:border-teal-500',
					)}
					value={token}
					onChange={e => setToken(e.target.value)}
				/>
				<button type="submit">Confirm</button>
			</form>
		</div>
	)
}
