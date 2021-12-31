import { Tab } from '@material-ui/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { StyledTabs } from './styles'

const Tabs = (props) => {
	const { tabsLinks } = props

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
		</div>
	)
}

export default Tabs
