"use client"
import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"

export type setEditor = (value: string) => Promise<string>

function to2(n: number) {
    if (n < 10) return `0${n}`
    return `${n}`
}

export function useEditTime() {
    const [value, setValue] = useState("")
    const [close, setClose] = useState<((value: string) => void) | undefined>(undefined)

    const Editor = () => {
        const time = value.split(':').map(Number)
        const [hour, setHour] = useState(time[0])
        const [min, setMin] = useState(time[1])

        // on esc pressed, close the editor
        useEffect(() => {
            const handler = (e: KeyboardEvent) => {
                if (e.key === 'Escape') close?.(value)
            }
            window.addEventListener('keydown', handler)
            return () => window.removeEventListener('keydown', handler)
        }, [])

        return <div
            className={twMerge(value == "" ? 'hidden' : 'grid', 'fixed top-0 left-0 h-screen w-screen bg-black/50 place-items-center')}
            onClick={() => close?.(value)}
        >
            <form
                className="rounded-lg bg-white flex flex-col gap-4 w-80 items-center py-16 px-8"
                onClick={e => e.stopPropagation()}
                onSubmit={e => {
                    e.preventDefault()
                    const m = hour || 0
                    const s = min || 0
                    close?.(`${to2(m + Math.floor(s / 60))}:${to2(s % 60)}`)
                }}
            >
                <h1>Set Time</h1>
                <div className="flex gap-4 w-fulla">
                    <input
                        className="w-full border-gray-500 border-2 rounded-lg p-1 outline-none focus:border-blue-500"
                        type="number"
                        value={to2(hour) || ''}
                        onChange={e => setHour(e.target.valueAsNumber)}
                    />:
                    <input
                        className="w-full border-gray-500 border-2 rounded-lg p-1 outline-none focus:border-blue-500"
                        type="number"
                        value={to2(min) || ''}
                        onChange={e => setMin(e.target.valueAsNumber)}
                    />
                </div>
                <div className="flex gap-4 w-full">
                    <button
                        className="rounded-md bg-gray-500 text-white p-2 font-bold w-full"
                        onClick={() => close?.(value)}
                        type="button"
                    >Cancel</button>
                    <button
                        className="rounded-md bg-blue-500 text-white p-2 font-bold w-full"
                        type="submit"
                    >Save</button>

                </div>


            </form>
        </div>
    }

    const setEditor = async (value: string) => {
        setValue(value)
        return new Promise<string>((res) => {
            console.log('in promise', res)
            setClose(() => (val: string) => {
                setValue('')
                res(val)
            })
        })
    }

    return [Editor, setEditor] as const
}
