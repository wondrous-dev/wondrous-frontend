import React, { useEffect } from 'react'
import { Logo } from '../../ci'
import { Header, Main, Footer, Container } from './styles'
import { signOut } from 'next-auth/react'

import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'

const AppLayout = ({ children }) => {

	let provider = null;
	let web3 = null;
	let accounts = null;

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
		console.log(accounts)
	}

	useEffect(() => {
		// Connect wallet.
		showWalletConnect()
	})
	
	return (
		<>
			<Header>
				<Logo />
				<button onClick={() => signOut()}>Logout</button>
			</Header>
			<Main>
				<Container>{children}</Container>
			</Main>
			<Footer />
		</>
	)
}

export default AppLayout
