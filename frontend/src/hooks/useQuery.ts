import { useRouter } from 'next/router'

export default function useQuery(key: string) {
	const router = useRouter()

	let value = router.query[key]

	if (!value) return []

	if (!Array.isArray(value)) value = [value]

	return value
}
