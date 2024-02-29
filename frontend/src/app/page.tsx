import Link from "next/link"

type Page = {
    name: string
    link: string
} | {
    name: string
    children: Page[]
}

const pages: Page[] = [
    {
        name: '倒數計時',
        children: [
            { name: '設定頁面', link: '/countdown/admin' },
            { name: 'R0', link: '/countdown?id=0' },
            { name: 'R1', link: '/countdown?id=1' },
            { name: 'R2', link: '/countdown?id=2' },
            { name: 'R3', link: '/countdown?id=3' },
            { name: 'S', link: '/countdown?id=4' },
        ]
    }, {
        name: '字卡',
        children: [
            { name: '設定頁面', link: '/card/admin' },
            { name: 'R0', link: '/card?room=R0' },
            { name: 'R1', link: '/card?room=R1' },
            { name: 'R2', link: '/card?room=R2' },
            { name: 'R3', link: '/card?room=R3' },
            { name: 'S', link: '/card?room=S' },
        ]
    }

]

function LinkTree({ pages }: { pages: Page[] }) {
    return <ul className="list-disc ml-4">
        {pages.map(page => {
            if ('link' in page) {
                return <li key={page.link}>
                    <Link href={page.link}>{page.name}</Link>
                </li>
            } else {
                return <li key={page.name}>
                    {page.name}
                    <LinkTree pages={page.children} />
                </li>
            }
        })}
    </ul>
}

export default function Page() {
    return <div className="flex flex-col mt-10 mx-20">
        <LinkTree pages={pages} />
    </div>
}
