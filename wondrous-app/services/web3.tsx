import Web3 from 'web3'
import Web3Modal from 'web3modal'
import axios, { AxiosInstance } from 'axios'
// Need Infura API Key for this one:
// import WalletConnectProvider from '@walletconnect/web3-provider'
import { useState } from 'react'

import { IAssetData } from '../types/assets'

// Handler of Web3 State for the app
export const WonderWeb3 = () => {
	// Some don't need state management
	let web3 = null
	let provider = null
	let accounts = []
	let address = null
	let addressTag = null
	let assets = []
	let chain = null
	let network = null
	let fetching = false
	let subscribed = false

	let wonder = 0

	const [wallet, setWallet] = useState({
		accounts: null,
		address: null,
		chain: null,
		wonder: null,
		addressTag: null,
		network: null,
		assets: null,
	})
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
			accounts = await web3.eth.getAccounts()
			address = accounts[0]
			addressTag =
				accounts[0].slice(0, 6) +
				'...' +
				accounts[0].slice(accounts[0].length - 4, accounts[0].length)
			network = await web3.eth.net.getId()
			chain = await web3.eth.chainId()
			await getAccountAssets()

			await setWallet({
				accounts,
				address,
				addressTag,
				network,
				wonder,
				chain,
				assets,
			})
		}

		setConnecting(false)
	}

	const getTokenBalance = async (tokenAddress: string) => {
		return 0
	}

	const subscribeProvider = async (provider: any) => {
		if (!provider.on) {
			return
		}
		if (!subscribed) {
			provider.on('close', () => {
				console.log('Wallet Closed')
			})

			provider.on('accountsChanged', async (accounts: string[]) => {
				if (accounts.length === 0) {
					// Disconnected
					await cleanWallet()
				} else {
					address = accounts[0]
					addressTag =
						accounts[0].slice(0, 6) +
						'...' +
						accounts[0].slice(accounts[0].length - 4, accounts[0].length)
					await getAccountAssets()
				}
			})

			provider.on('chainChanged', async (chainId: number) => {
				chain = chainId
				await getAccountAssets()
			})

			provider.on('networkChanged', async (networkId: number) => {
				network = networkId
				await getAccountAssets()
			})
			subscribed = true
		}
	}

	const getAccountAssets = async () => {
		const address = accounts[0]
		if (!fetching && address) {
			fetching = true
			try {
				// get account balances
				assets = await apiGetAccountAssets(address, chain)
				fetching = false
			} catch (error) {
				console.error(error) // tslint:disable-line
				fetching = false
			}
			await setWallet({
				accounts,
				address,
				addressTag,
				network,
				wonder,
				chain,
				assets,
			})
		} else {
			console.log('getAccountsAssets() failed.', address)
		}
	}

	const cleanWallet = async () => {
		accounts = []
		address = null
		addressTag = null
		network = null
		chain = null
		wonder = null
		assets = []

		await setWallet({
			accounts,
			address,
			addressTag,
			network,
			wonder,
			chain,
			assets,
		})
	}

	return {
		connecting,
		wallet,
		address,
		assets,
		chain,
		network,
		onConnect,
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

const api: AxiosInstance = axios.create({
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
	const response = await api.get(
		`/account-assets?address=${address}&chainId=${chainId}`
	)
	const { result } = response.data
	return result
}
