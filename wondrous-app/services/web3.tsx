import Web3 from 'web3'
import Web3Modal from 'web3modal'
import { BigNumber, ethers } from 'ethers'
import ENS, { getEnsAddress } from '@ensdomains/ensjs'
import axios, { AxiosInstance } from 'axios'
// Need Infura API Key for this one:
// import WalletConnectProvider from '@walletconnect/web3-provider'
import { useEffect, useMemo, useState } from 'react'

import { IAssetData } from '../types/assets'
import {
	CURRENCY_KEYS,
	SUPPORTED_CHAINS,
	SUPPORTED_CURRENCIES,
} from '../utils/constants'

import { ERC20abi } from './contracts/erc20.abi'
import { formatEther } from 'ethers/lib/utils'
import { AbiItem } from 'web3-utils'

// TODO: Define Contract Address for WONDER Token for wallet balance
const WONDER_CONTRACT = '0x00'

// Handler of Web3 State for the app
export const useWonderWeb3 = () => {
	// Some don't need state management

	const [accounts, setAccounts] = useState([])
	const [assets, setAssets] = useState(null)
	const [chain, setChain] = useState(null)
	const [ensName, setENSName] = useState(null)

	const [fetching, setFetching] = useState(false)
	const [subscribed, setSubscribed] = useState(false)

	const chainName = useMemo(() => {
		return SUPPORTED_CHAINS[chain] || 'none'
	}, [chain])

	const address = useMemo(() => {
		return accounts[0] || null
	}, [accounts])

	const addressTag = useMemo(() => {
		if (!address) {
			return ''
		}
		if (ensName) {
			return ensName
		} else {
			return `${address.slice(0, 6)}...${address.slice(
				address.length - 4,
				address.length
			)}`
		}
	}, [address, ensName])

	const wallet = useMemo(() => {
		return {
			accounts,
			address,
			chain,
			addressTag,
			assets,
		}
	}, [accounts, address, addressTag, assets, chain])

	const [connecting, setConnecting] = useState(false)

	const onConnect = async () => {
		setConnecting(true)
		const web3Modal = new Web3Modal()

		try {
			const provider = await web3Modal.connect()
			await subscribeProvider(provider)
			const web3 = await initWeb3(provider)
			if (web3) {
				const a = await web3.eth.getAccounts()
				const c = await web3.eth.chainId()

				// Gate Keeper for Usupported chains
				if (!SUPPORTED_CHAINS[c]) {
					disconnect()
					setConnecting(false)
					return false
				}

				setAccounts(a)
				setChain(c)
			}
		} catch (e) {
			console.log('Error', e)
		}

		setConnecting(false)
	}

	const signMessage = async (message: string) => {
		if (!connecting) {
			setConnecting(true)
			try {
				const web3Modal = new Web3Modal()
				const provider = await web3Modal.connect()
				const prov = new ethers.providers.Web3Provider(provider)
				const signer = await prov.getSigner()

				// Now sign message
				const signedMessage = await signer.signMessage(message)
				setConnecting(false)
				return signedMessage
			} catch (error) {
				// Error Signed message
				console.log(error)
				setConnecting(false)
				return false
			}
		} else {
			setConnecting(false)
			return false
		}
	}

	const subscribeProvider = async (provider: any) => {
		if (!provider.on) {
			return
		}
		if (!subscribed) {
			provider.on('disconnect', async () => {
				// Wallet closed.
				await cleanWallet()
			})

			provider.on('accountsChanged', async (acc: string[]) => {
				if (acc.length === 0) {
					// Disconnected
					await cleanWallet()
				} else {
					setAccounts(acc)
					// Refresh Assets
				}
			})

			provider.on('chainChanged', async (chainId: number) => {
				setChain(parseInt(chainId + ''))
			})
			setSubscribed(true)
		}
	}

	const getChainCurrencies = () => {
		const supportedCurrencies = []
		if (chain) {
			SUPPORTED_CURRENCIES.map((c) => {
				if (c.chains.includes(chain)) {
					supportedCurrencies.push(c)
				}
			})
		}
		return supportedCurrencies
	}

	const getNativeChainBalance = async () => {
		const web3 = new Web3(window.ethereum)
		const balance = await web3.eth.getBalance(address)
		const balanceFormatted =
			parseFloat(formatEther(balance)).toPrecision(4) + ' '
		return balanceFormatted
	}

	const getTokenBalance = async (token) => {
		if (!fetching && address && chain && token.contracts[chain] !== '') {
			setFetching(true)
			const web3 = new Web3(window.ethereum)
			const usdcContract = new web3.eth.Contract(
				ERC20abi as AbiItem[],
				token.contracts[chain]
			)
			const balanceRaw = await usdcContract.methods.balanceOf(address).call()
			const decimals = await usdcContract.methods.decimals().call()
			const bnBalance = await BigNumber.from(balanceRaw)
			const balance = bnBalance.div(10 ** decimals)
			setFetching(false)
			return parseFloat(balance.toString()).toPrecision(4)
		} else {
			console.log('getAccountsAssets() failed.', address)
			return '0.000'
		}
	}

	const getAccountAssets = async () => {
		if (!fetching && address && chain) {
			setFetching(true)
			const chainAssets = {}

			// Get supported currencies for this chain
			const currencies = getChainCurrencies()

			currencies.map(async (c) => {
				let balance = '0.000'
				if (c.contracts) {
					balance = await getTokenBalance(c)
				} else {
					balance = await getNativeChainBalance()
				}
				chainAssets[c.symbol] = {
					balance,
					symbol: c.symbol,
				}
			})

			// Reset Assets based on Chain
			setAssets(chainAssets)
			setFetching(false)
		} else {
			console.log('getAccountsAssets() failed.', address)
		}
	}

	// If the wallet has an ENS Name, represent it
	// instead of the address.
	const getENSName = async () => {
		const web3Modal = new Web3Modal()
		const provider = await web3Modal.connect()
		const prov = new ethers.providers.Web3Provider(provider)

		const ens = new ENS({ provider: prov, ensAddress: getEnsAddress('1') })
		// If chain supports ENS...
		try {
			let name = await ens.getName(address)
			setENSName(name.name)
		} catch (err) {
			// Chain not supported. No problem
			setENSName(null)
		}

		return true
	}

	const getNativeTokenSymbol = () => {
		return SUPPORTED_CHAINS[chain]
	}

	const disconnect = () => {
		cleanWallet()
		return true
	}

	const cleanWallet = async () => {
		setAccounts([])
		setChain(null)
		setAssets(null)
	}

	useEffect(() => {
		if (accounts.length && chain) {
			getENSName()
			getAccountAssets()
		}
	}, [accounts, chain])

	return {
		connecting,
		wallet,
		address,
		assets,
		chain,
		chainName,
		subscribed,
		onConnect,
		disconnect,
		signMessage,
		getNativeTokenSymbol,
	}
}

// TODO: TO helpers
function initWeb3(provider: any) {
	const web3: any = new Web3(provider)

	web3.eth.extend({
		methods: [
			{
				name: 'chainId',
				call: 'eth_chainId',
				outputFormatter: web3.utils.hexToNumber,
			},
		],
	})

	return web3
}
