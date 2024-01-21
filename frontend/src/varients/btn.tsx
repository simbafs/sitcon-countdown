import { tv } from 'tailwind-variants'

export const btn = tv({
	base: 'text-3xl rounded-lg p-2 shadow-lg text-center text-black',
	variants: {
		color: {
			normal: 'bg-slate-200 hover:bg-slate-300 active:bg-slate-400',
			green: 'bg-green-100 hover:bg-green-200 active:bg-green-500 active:text-white',
			red: 'bg-red-100 hover:bg-red-200 active:bg-red-500 active:text-white',
			yellow: 'bg-yellow-100 hover:bg-yellow-200 active:bg-yellow-500 active:text-white',
		},
	},
	defaultVariants: {
		color: 'normal',
	},
})
