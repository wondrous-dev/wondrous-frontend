import React from 'react'
import { Tab } from '@material-ui/core'
import Link from 'next/link'
import { useRouter } from "next/router"

import Boards from "../boards/boards";
import About from "../about/about";

import {StyledTabs} from "./styles";

const tabsLinks = [
	{
		href: '/dao/activities',
		label: 'Activity',
	},
	{
		href: '/dao/boards',
		label: 'Boards',
	},
	{
		href: '/dao/about',
		label: 'About',
	},
];

const Tabs = (props) => {
	const {children} = props;

	const router = useRouter();

	const { pathname } = router;

	return (
		<div>
			<StyledTabs value={pathname}>
				{tabsLinks.map(tab => (
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
			<div>
				{children}
			</div>
		</div>
	)
}

export default Tabs