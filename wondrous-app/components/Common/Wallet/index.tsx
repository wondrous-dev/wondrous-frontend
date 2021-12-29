import { Button } from '../button'
import React, { useCallback, useEffect, useState } from 'react'
import { useWonderWeb3 } from '../../../services/web3'
import Ethereum from '../../Icons/ethereum'
import { Metamask } from '../../Icons/metamask'
import { WonderCoin } from '../../Icons/wonderCoin'
import { PaddedParagraph } from '../text'
import { formatEther } from '@ethersproject/units'

import {
	WalletWrapper,
	ChainWrapper,
	WalletDisplay,
	WonderBalance,
	WalletAddress,
	CurrencySelectorItem,
	CurrencyName,
	CurrencySymbol,
} from './styles'
import { linkWallet, logout, useMe } from '../../Auth/withAuth'
import { DropDown, DropDownItem } from '../dropdown'
import { Matic } from '../../Icons/matic'
import { CURRENCY_KEYS, SUPPORTED_CHAINS } from '../../../utils/constants'

const CHAIN_LOGO = {
	'1': <Ethereum />,
	'137': <Matic />,
}

const CURRENCY_SYMBOL = {
	ETH: <Ethereum />,
	WONDER: <WonderCoin />,
	MATIC: <Matic />,
}

const CURRENCY_UI_ELEMENTS = {
	ETH: { icon: <Ethereum />, label: 'ETH' },
	WONDER: { icon: <WonderCoin />, label: 'WONDER' },
	MATIC: { icon: <Matic />, label: 'MATIC' },
}

const Wallet = () => {
	const wonderWeb3 = useWonderWeb3()
	const [connected, setConnected] = useState(false)
	const [notSupported, setNotSupported] = useState(false)
	const [firstConnect, setFirstConnect] = useState(true)
	const [signedMessage, setSignedMessage] = useState('')
	const [currency, setCurrency] = useState({
		balance: '0.000',
		symbol: 'WONDER',
	})
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

	const displayCurrency = (currencyCode) => {
		if (currencyCode == 'WONDER') {
			const balance =
				parseFloat(formatEther(wonderWeb3.wallet.wonder.balance)).toPrecision(
					4
				) + ' '
			setCurrency({
				balance,
				symbol: currencyCode,
			})
		} else if (wonderWeb3.wallet.assets) {
			const selectedCurrency = wonderWeb3.wallet.assets.find(
				(c) => c.symbol == currencyCode
			)
			if (selectedCurrency && selectedCurrency.balance) {
				const balance =
					parseFloat(formatEther(selectedCurrency.balance)).toPrecision(4) + ' '
				setCurrency({
					balance,
					symbol: selectedCurrency.symbol,
				})
			}
		}
	}

	useEffect(() => {
		if (user && user.activeEthAddress && !wonderWeb3.subscribed) {
			connectWallet()
		}
	}, [connectWallet, user])

	// Detect Chain
	useEffect(() => {
		setNotSupported(!SUPPORTED_CHAINS[wonderWeb3.chain])
	}, [wonderWeb3.chain])

	// Change Currency when the Chain changes
	useEffect(() => {
		if (wonderWeb3.wallet.assets && wonderWeb3.wallet.assets.length) {
			displayCurrency(wonderWeb3.wallet.assets[0].symbol)
		}
	}, [wonderWeb3.wallet.assets])

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
					wonderWeb3.wallet.address !== user.activeEthAddress
				) {
					// Wallet has changed, and doesn't match user's
					// registered. SignOut.
					logout()
				}
			} else if (!firstConnect) {
				setConnected(false)
				// No wallet, maybe unlinked?
				if (!user.email) {
					// Sign out, no other means of identification left
					// TODO: Email is not brought on the current Session
					//       management.
					// logout()
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

	const Balance = () => {
		return (
			<WonderBalance>
				{currency ? currency.balance : 0}
				&nbsp;
				{CURRENCY_SYMBOL[currency.symbol]}
			</WonderBalance>
		)
	}

	const CurrencyDropdownItem = ({ currency }) => {
		const { icon: currencyIcon, label: currencyLabel } =
			CURRENCY_UI_ELEMENTS[currency]
		return (
			<DropDownItem
				key={`wallet-currency-${currency}`}
				onClick={() => displayCurrency(currency)}
			>
				<CurrencySelectorItem>
					<CurrencySymbol>{currencyIcon}</CurrencySymbol>
					<CurrencyName>{currencyLabel}</CurrencyName>
				</CurrencySelectorItem>
			</DropDownItem>
		)
	}

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
	} else if (notSupported) {
		return (
			<WalletWrapper>
				<WalletDisplay>Chain Not Supported</WalletDisplay>
			</WalletWrapper>
		)
	} else {
		return (
			<WalletWrapper>
				<ChainWrapper>{CHAIN_LOGO[wonderWeb3.wallet.chain]}</ChainWrapper>
				<WalletDisplay>
					<DropDown DropdownHandler={Balance}>
						<CurrencyDropdownItem currency={CURRENCY_KEYS.WONDER} />
						{wonderWeb3.chainName && (
							<CurrencyDropdownItem currency={wonderWeb3.chainName} />
						)}
					</DropDown>
					<WalletAddress>
						{wonderWeb3.wallet.addressTag || 'loading...'}
					</WalletAddress>
				</WalletDisplay>
			</WalletWrapper>
		)
	}
}

export default Wallet
