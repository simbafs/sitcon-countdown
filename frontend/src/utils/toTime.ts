import to2 from './to2'

export default function toTime(time: number) {
	return `${to2(Math.floor(time / 60))}:${to2(time % 60)}`
}
