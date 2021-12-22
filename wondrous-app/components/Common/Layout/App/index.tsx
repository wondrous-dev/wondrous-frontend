import React, { useEffect, useState } from 'react'
import Header from '../../../Header'
import { Main, Footer, Container } from './styles'
import SideBarComponent from '../../../SideBar'

import { WonderWeb3 } from '../../../../services/web3'

const SIDEBAR_LIST_ITEMS = [
	{
		id: 1,
		icon: '/images/sidebar/first.png',
		path: '/',
	},
	{
		id: 2,
		icon: '/images/sidebar/second.png',
		path: '/',
	},
	{
		id: 3,
		icon: '/images/sidebar/third.png',
		path: '/',
	},
]

const AppLayout = ({ children }) => {
	return (
		<>
			<Header />
			<SideBarComponent listItems={SIDEBAR_LIST_ITEMS} />
			<Main>
				<Container>{children}</Container>
			</Main>
			<Footer />
		</>
	)
}

export default AppLayout
