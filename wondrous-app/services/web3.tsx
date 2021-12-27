import Web3 from 'web3'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import axios, { AxiosInstance } from 'axios'
// Need Infura API Key for this one:
// import WalletConnectProvider from '@walletconnect/web3-provider'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { IAssetData } from '../types/assets'
import { generateRandomString } from '../utils'

const CHAINS = {
	1: 'eth'
}

// Handler of Web3 State for the app
export const useWonderWeb3 = () => {
	// Some don't need state management
	let web3 = null
	let provider = null

	const [accounts, setAccounts] = useState([])
	const [assets, setAssets] = useState([])
	const [chain, setChain] = useState(null)
	const [wonder, setWonder] = useState({ amount: 0 })
	const [fetching, setFetching] = useState(false)

	let subscribed = false

	const chainName = useMemo(() => {
		return CHAINS[chain] || 'none' 
	}, [chain])

	const address = useMemo(() => {
		return accounts[0] || null
	}, [accounts])

	const addressTag = useMemo(() => {
		if (!address) {
			return ''
		}
		return `${address.slice(0, 6)}...${address.slice(
			address.length - 4,
			address.length
		)}`
	}, [address])

	const wallet = useMemo(() => {
		return {
			accounts,
			address,
			chain,
			wonder,
			addressTag,
			assets,
		}
	}, [accounts, address, addressTag, assets, chain, wonder])

	const [connecting, setConnecting] = useState(false)

	const onConnect = async () => {
		setConnecting(true)
		const web3Modal = new Web3Modal()

		try {
			provider = await web3Modal.connect()
			await subscribeProvider(provider)
			web3 = await initWeb3(provider)
		} catch (e) {
			console.log('Error', e)
		}

		if (web3) {
			const a = await web3.eth.getAccounts()
			const c = await web3.eth.chainId()

			await setAccounts(a)
			await setChain(c)
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
		}
		return null
	}

	const getTokenBalance = async (tokenAddress: string) => {
		return 0
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
				}
			})

			provider.on('chainChanged', async (chainId: number) => {
				setChain(chainId)
			})
			subscribed = true
		}
	}

	const getAccountAssets = async () => {
		if (!fetching && address && chain) {
			setFetching(true)
			try {
				// get account balances
				setAssets(await apiGetAccountAssets(address, chain))
				setFetching(false)
			} catch (error) {
				console.error(error) // tslint:disable-line
				setFetching(false)
			}
		} else {
			console.log('getAccountsAssets() failed.', address)
		}
	}

	const disconnect = async () => {
		await cleanWallet()
		return true
	}

	const cleanWallet = async () => {
		setAccounts([])
		setChain(null)
		setWonder(null)
		setAssets(null)
	}

	useEffect(() => {
		if (accounts.length && chain) {
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
		onConnect,
		disconnect,
		signMessage,
		getTokenBalance,
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

const ethereumApi: AxiosInstance = axios.create({
	baseURL: 'https://ethereum-api.xyz',
	timeout: 30000, // 30 secs
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
})

export async function apiGetAccountAssets(
	address: string,
	chainId: number
): Promise<IAssetData[]> {
	const response = await ethereumApi.get('/account-assets', {
		params: { address, chainId },
	})
	const { result } = response.data
	return result
}
