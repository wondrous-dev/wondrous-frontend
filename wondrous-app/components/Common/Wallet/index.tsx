import { Button } from '../button'
import React, { useCallback, useEffect, useState } from 'react'
import { useWonderWeb3 } from '../../../services/web3'
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
import { linkWallet, logout, useMe } from '../../Auth/withAuth'

const Wallet = () => {
	const wonderWeb3 = useWonderWeb3()
	const [connected, setConnected] = useState(false)
	const [firstConnect, setFirstConnect] = useState(true)
	const [signedMessage, setSignedMessage] = useState('')
	const user = useMe()

	const connectWallet = useCallback(
		async (event = {}) => {
			await wonderWeb3.onConnect()
			setFirstConnect(false)
		},
		[wonderWeb3]
	)

	const signMessage = useCallback(async () => {
		const message =
			'Sign this message to link your wallet to your Wonder account.'
		const signature = await wonderWeb3.signMessage(message)
		if (signature === false) {
			// User didn't sign
			// TODO: Toast logic here.
		} else if (signature) {
			setSignedMessage(signature)
			return true
		}
		return false
	}, [wonderWeb3])

	const linkUserWithWallet = useCallback(async () => {
		await signMessage()
		const result = await linkWallet(wonderWeb3.address, signedMessage)
		if (result) {
			// Wallet linked successfully. Send to backend
		} else {
			// Error with wallet link. Disconnect wallet
			await wonderWeb3.disconnect()
			setConnected(false)
		}
		return true
	}, [signMessage, signedMessage, wonderWeb3])

	useEffect(() => {
		if (user && user.activeEthAddress && !wonderWeb3.subscribed) {
			connectWallet()
		}
	}, [connectWallet, user])

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
				}
			} else if (!firstConnect) {
				setConnected(false)
				// No wallet, maybe unlinked?
				if (!user.username) {
					// Sign out, no other means of identification left
					logout()
				}
			}
		}
	}, [
		wonderWeb3.wallet,
		wonderWeb3.connecting,
		connectWallet,
		firstConnect,
		user,
		linkUserWithWallet,
	])

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
