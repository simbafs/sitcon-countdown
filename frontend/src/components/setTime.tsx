import { Room } from "@/hooks/useRoom"
import { btn } from "@/varients/btn"
import { useState } from "react"

type Props = {
    room: Room
    close: () => void
}

export default function SetTime({ room, close }: Props) {
    const [time, setTime] = useState(room.time)
    return <div
        className="fixed h-screen w-screen top-0 left-0 grid place-items-center bg-stone-400/30"
        onClick={close}
    >
        <div
            className="p-4 rounded-lg bg-sky-800 text-white flex flex-col gap-4"
            onClick={e => e.stopPropagation()}
        >
            <h1 className="text-3xl text-center">Room {room.id}</h1>
            <input
                type="number"
                value={time}
                onChange={e => {
                    console.log(e.target.value, e.target.valueAsNumber)
                    setTime(e.target.valueAsNumber)
                }}
                className="text-black p-2 rounded"
            />
            <div className="grid grid-cols-2 gap-2">
                <button
                    className={btn()}
                    onClick={() => {
                        room.setTime(time)
                        close()
                    }}>Set</button>
                <button
                    className={btn()}
                    onClick={close}>Cancel</button>
            </div>
        </div>
    </div>
}
