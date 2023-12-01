import React, { useEffect, useReducer, useState } from 'react'
import { tv } from 'tailwind-variants'
import useTime from '../../..//hooks/useTime'

type State = 'pause' | 'counting'

function Time({
    time,
    setTime,
    setInitTime,
    state,
}: {
    time: number
    setTime: React.Dispatch<React.SetStateAction<number>>
    setInitTime: React.Dispatch<React.SetStateAction<number>>
    state: State
}) {
    return (
        <input
            type="number"
            value={time}
            onChange={e => {
                if (state === 'counting') return
                setTime(e.target.valueAsNumber)
                setInitTime(e.target.valueAsNumber)
            }}
        />
    )
}

const btn = tv({
    base: 'text-3xl bg-slate-200 rounded-lg py-2 hover:bg-slate-300 active:bg-slate-400 shadow-lg',
    variants: {
        color: {
            normal: '',
            green: 'bg-green-100 hover:bg-green-200 active:bg-green-500 active:text-white',
            red: 'bg-red-100 hover:bg-red-200 active:bg-red-500 active:text-white',
            yellow: 'bg-yellow-100 hover:bg-yellow-200 active:bg-yellow-500 active:text-white',
        },
    },
    defaultVariants: {
        color: 'normal',
    },
})

function Btn({
    children,
    onClick,
    color,
}: {
    children: string
    onClick: () => void
    color?: 'normal' | 'green' | 'red' | 'yellow'
}) {
    return (
        <button className={btn({ color })} onClick={onClick}>
            {children}
        </button>
    )
}

function Row({
    name,
    initTime,
    setInitTime,
    time,
    setTime,
    state,
    setState,
}: {
    name: string
    initTime: number
    setInitTime: React.Dispatch<React.SetStateAction<number>>
    time: number
    setTime: React.Dispatch<React.SetStateAction<number>>
    state: State
    setState: React.Dispatch<React.SetStateAction<State>>
}) {
    return (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-[2fr_4fr]">
            <div className="grid grid-cols-2 gap-6">
                <h2 className="text-center text-3xl">{name}</h2>
                <Time
                    time={time}
                    setTime={setTime}
                    setInitTime={setInitTime}
                    state={state}
                />
            </div>
            <div className="grid grid-cols-4 gap-6">
                <Btn onClick={() => setState('counting')} color={'green'}>
                    開始
                </Btn>
                <Btn onClick={() => setState('pause')} color={'red'}>
                    暫停
                </Btn>
                <Btn onClick={() => setTime(initTime)} color={'yellow'}>
                    重設
                </Btn>
                <Btn onClick={() => { }}>開啟頁面</Btn>
            </div>
        </div>
    )
}

function formatTime(time: Date){
    function to2(n: number){
        if(n < 10) return '0' + n
        else return '' + n
    }
    return `${to2(time.getHours())}:${to2(time.getMinutes())}:${to2(time.getSeconds())}`
}

export default function Page() {
    const [initTime1, setInitTime1] = useState(10)
    const [initTime2, setInitTime2] = useState(10)
    const [initTime3, setInitTime3] = useState(10)
    const [initTime4, setInitTime4] = useState(10)
    const [initTime5, setInitTime5] = useState(10)

    const [time1, setTime1] = useState(0)
    const [time2, setTime2] = useState(0)
    const [time3, setTime3] = useState(0)
    const [time4, setTime4] = useState(0)
    const [time5, setTime5] = useState(0)

    const [state1, setState1] = useState<State>('pause')
    const [state2, setState2] = useState<State>('pause')
    const [state3, setState3] = useState<State>('pause')
    const [state4, setState4] = useState<State>('pause')
    const [state5, setState5] = useState<State>('pause')

    const time = useTime()

    return (
        <div className="min-h-screen w-screen py-[100px] px-[50px] lg:px-[100px] flex flex-col justify-center items-center">
            <div className="w-full grid gap-[50px]">
                <Row
                    name="room1"
                    initTime={initTime1}
                    setInitTime={setInitTime1}
                    time={time1}
                    setTime={setTime1}
                    state={state1}
                    setState={setState1}
                />
                <Row
                    name="room2"
                    initTime={initTime2}
                    setInitTime={setInitTime2}
                    time={time2}
                    setTime={setTime2}
                    state={state2}
                    setState={setState2}
                />
                <Row
                    name="room3"
                    initTime={initTime3}
                    setInitTime={setInitTime3}
                    time={time3}
                    setTime={setTime3}
                    state={state3}
                    setState={setState3}
                />
                <Row
                    name="room4"
                    initTime={initTime4}
                    setInitTime={setInitTime4}
                    time={time4}
                    setTime={setTime4}
                    state={state4}
                    setState={setState4}
                />
                <Row
                    name="room5"
                    initTime={initTime5}
                    setInitTime={setInitTime5}
                    time={time5}
                    setTime={setTime5}
                    state={state5}
                    setState={setState5}
                />
            </div>
            <h1 className="mt-10 text-2xl">現在時間: {formatTime(time)}</h1>
        </div>
    )
}
