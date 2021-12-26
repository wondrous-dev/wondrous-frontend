import { Button } from '../button'
import React, { useEffect, useState } from 'react'
import { WonderWeb3 } from '../../../services/web3'
import Ethereum from '../../Icons/ethereum'
import { Metamask } from '../../Icons/metamask'
import { WonderCoin } from '../../Icons/wonderCoin'
import { PaddedParagraph } from '../text'

import {
	WalletWrapper,
	ChainWrapper,
	WalletDisplay,
	WonderBalance,
	WalletAddress,
} from './styles'
import { logout, useMe } from '../../Auth/withAuth'

const Wallet = () => {
	const wonderWeb3 = WonderWeb3()
	const [connected, setConnected] = useState(false)
	const [firstConnect, setFirstConnect] = useState(true)
	const user = useMe()

	console.log(user)

	const connectWallet = async (event = {}) => {
		await wonderWeb3.onConnect()
		setFirstConnect(false)
	}

	useEffect(() => {
		if (user && user.active_eth_address) {
			connectWallet()
		}
	}, [])

	// Bind to the Web3 wallet to monitor changes (i.e user unlinks wallet)
	useEffect(() => {
		// Don't listen to anything before the connection to the
		// wallet is done.
		if (!wonderWeb3.connecting) {
			// Enable the wallet.
			if (wonderWeb3.wallet['address']) {
				// Change the UI now.
				setConnected(true)
				if (
					user.address &&
					wonderWeb3.wallet.address !== user.active_eth_address
				) {
					// Wallet has changed, and doesn't match user's
					// registered. SignOut.
					logout()
				} else if (!user.active_eth_address) {
					// User without wallet has linked a wallet
					// lets add it to the session

					// TODO: User Link Wallet on backend (with prompt "are you sure?")
					user.active_eth_address = wonderWeb3.wallet.address
				}
			} else if (!firstConnect) {
				setConnected(false)
				// No wallet, maybe unlinked?
				if (!user.username) {
					// Sign out, no other means of identification left
					logout()
				} else {
					console.log('Removing from Session')
					// Clean Wallet from Session
					user.active_eth_address = null
				}
			}
		}
	}, [wonderWeb3.wallet, wonderWeb3.connecting, connectWallet, firstConnect, user])

	if (!connected) {
		return (
			<WalletWrapper>
				<Button
					highlighted="true"
					onClick={connectWallet}
					style={{ width: '270px', minHeight: '40px' }}
				>
					<Metamask height="18" width="17" />
					<PaddedParagraph padding="0 10px">Connect MetaMask</PaddedParagraph>
				</Button>
			</WalletWrapper>
		)
	} else {
		return (
			<WalletWrapper>
				<ChainWrapper>
					{wonderWeb3.wallet.chain == 1 ? (
						<Ethereum />
					) : (
						<>{wonderWeb3.wallet.chain}</>
					)}
				</ChainWrapper>
				<WalletDisplay>
					<WonderBalance>
						{wonderWeb3.wallet.wonder ? wonderWeb3.wallet.wonder.amount : 0}
						&nbsp;
						<WonderCoin />
					</WonderBalance>
					<WalletAddress>
						{wonderWeb3.wallet.addressTag || 'loading...'}
					</WalletAddress>
				</WalletDisplay>
			</WalletWrapper>
		)
	}
}

// export async function getServerSideProps(context) {
// 	const session = await getSession({ req: context.req })
// 	return {
// 		props: { session },
// 	}
// }

export default Wallet
