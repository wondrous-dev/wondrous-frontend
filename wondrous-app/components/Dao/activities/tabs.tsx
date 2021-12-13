import React, { useState } from 'react'
import { Tab } from '@material-ui/core'
import { StyledTabs } from './styles'
import { PostCard } from './post'

const tabsContent = [
	<>
		<PostCard />
		<PostCard />
	</>,
	<h1 key="boards">Boards Tab</h1>,
	<h1 key="about">About Tab</h1>,
]

export const TabsActivity = () => {
	const [index, setIndex] = useState(0)

	const handleTabChange = (event, index) => {
		setIndex(index)
	}

	return (
		<div>
			<StyledTabs value={index} onChange={handleTabChange}>
				<Tab label="Activity" />
				<Tab label="Boards" />
				<Tab label="About" />
			</StyledTabs>
			<div>{tabsContent[index]}</div>
		</div>
	)
}
