import { tv } from 'tailwind-variants'

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

export default function Btn({
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
