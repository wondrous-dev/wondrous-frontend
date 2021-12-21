import React, { useEffect, useState } from 'react'
import Header from '../../../Header'
import { Main, Footer, Container } from './styles'

import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import SideBarComponent from '../../../SideBar'

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

	let provider = null
	let web3 = null
	let accounts = null
	
	const [wallet, setWallet] = useState({})

	const providerOptions = {
		walletconnect: {
			package: WalletConnectProvider,
			options: {
			infuraId: process.env.REACT_APP_INFURA_ID
			}
		},
	}
	
	const connect = async (web3Modal) => {
		provider = await web3Modal.connect()
		return new Web3(provider)
	}

	const showWalletConnect = async () => {
		if(!provider){
			const web3Modal = new Web3Modal({
				cacheProvider: true,
				providerOptions
			})
			web3 = await connect(web3Modal)
		}

		if(!accounts) {
			accounts = await web3.eth.getAccounts()
		}

		const account = accounts[0]
		
		setWallet({
			address: account.slice(0,6) + '...' + account.slice(account.length - 4, account.length),
			wonder: 2551,
		})
	}

	useEffect(() => {
		// Connect wallet.
		showWalletConnect()
	})
	
	return (
		<>
			
			<Header wallet={wallet}/>
			<SideBarComponent listItems={SIDEBAR_LIST_ITEMS} />
			<Main>
				<Container>{children}</Container>
			</Main>
			<Footer />
		</>
	)
}

export default AppLayout
