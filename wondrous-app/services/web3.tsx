import Web3 from 'web3'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import ENS, { getEnsAddress } from '@ensdomains/ensjs'
import axios, { AxiosInstance } from 'axios'
// Need Infura API Key for this one:
// import WalletConnectProvider from '@walletconnect/web3-provider'
import { useEffect, useMemo, useState } from 'react'

import { IAssetData } from '../types/assets'
import { SUPPORTED_CHAINS } from '../utils/constants'

// TODO: Define Contract Address for WONDER Token for wallet balance
const WONDER_CONTRACT = '0x00'

// Handler of Web3 State for the app
export const useWonderWeb3 = () => {
	// Some don't need state management

	const [accounts, setAccounts] = useState([])
	const [assets, setAssets] = useState([])
	const [chain, setChain] = useState(null)
	const [ensName, setENSName] = useState(null)
	
	// Keep this Balance aside of Assets to manage separately
	const [wonder, setWonder] = useState({ balance: 0, symbol: 'WONDER' })
	
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
		if(ensName) {
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
			const provider = await web3Modal.connect()
			await subscribeProvider(provider)
			const web3 = await initWeb3(provider)
			if (web3) {
				const a = await web3.eth.getAccounts()
				const c = await web3.eth.chainId()

				// Gate Keeper for Usupported chains
				if(!SUPPORTED_CHAINS[c]) {
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
			return false
		}
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
				setChain(parseInt(chainId + ''))
			})
			setSubscribed(true)
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
				setFetching(false)
			}
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
		
		const ens = new ENS({ provider: prov, ensAddress: getEnsAddress('1') });
		// If chain supports ENS...
		try {
			let name = await ens.getName(address)
			setENSName(name.name)
		} catch(err) {
			// Chain not supported. No problem
			setENSName(null)
		}
		
		return true
	}

	const getWonderBalance = async () => {
		if (!fetching && address && chain) {
			setFetching(true)
			try {
				// get account balances
				const wonderBalance = await apiGetWonderBalance(address, chain)
				setWonder({
					balance: wonderBalance.balance,
					symbol: wonderBalance.symbol,
				})
				setFetching(false)
			} catch (error) {
				console.error(error) // tslint:disable-line
				setFetching(false)
			}
		} else {
			console.log('getAccountsAssets() failed.', address)
		}
	}

	const disconnect = () => {
		cleanWallet()
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
			// TODO: Define WONDER token contract to get balance of account.
			// getWonderBalance()
			getENSName()
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


export async function apiGetWonderBalance(
	address: string,
	chainId: number
): Promise<IAssetData[]> {
	const response = await ethereumApi.get('/token-balance', {
		params: { address, chainId, WONDER_CONTRACT },
	})
	const { result } = response.data
	return result
}
