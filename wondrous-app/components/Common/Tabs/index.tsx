import { Tab } from '@material-ui/core'
import Link from 'next/link'
import React from 'react'
import { StyledTabs } from './styles'

/**
 * Tabs generator
 * @param tabs ({ label: String, action: () => {} })
 * @returns 
 */

const Tabs = ({ selected, tabs = [] }) => {
	return (
		<StyledTabs value={selected}>
			{tabs.map((tab) => (<Tab value={tab.name} key={tab.name} label={tab.label} onClick={tab.action}/>)
			)}
		</StyledTabs>
	)
}

export default Tabs
