import { Tab } from '@material-ui/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { StyledTabs } from './styles'

const tabsLinks = [
	{
		href: '/profile/boards',
		label: 'Boards',
	},
	{
		href: '/profile/activities',
		label: 'Activity',
	},
	{
		href: '/profile/about',
		label: 'About',
	},
]

const Tabs = (props) => {
	const { children } = props

	const router = useRouter()

	const { pathname } = router

	return (
		<div>
			<StyledTabs value={pathname}>
				{tabsLinks.map((tab) => (
					<Link
						// @ts-ignore
						value={tab.href}
						key={tab.href}
						href={tab.href}
					>
						<a>
							<Tab label={tab.label} />
						</a>
					</Link>
				))}
			</StyledTabs>
			<div>{children}</div>
		</div>
	)
}

export default Tabs
