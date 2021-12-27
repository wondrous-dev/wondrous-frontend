import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'

import apollo from '../../services/apollo'
import {
	GET_LOGGED_IN_USER,
	GET_LOGGED_IN_WAITLIST_USER,
	WHOAMI,
} from '../../graphql/queries'
import { LOGIN_MUTATION, LOGIN_WALLET_MUTATION } from '../../graphql/mutations'

const MyContext = React.createContext(null)

export const useMe = () => {
	return useContext(MyContext)
}

export const emailSignin = async (email: string, password: string) => {
	try {
		const {
			data: {
				emailSignin: { user, token },
			},
		} = await apollo.mutate({
			mutation: LOGIN_MUTATION,
			variables: {
				email: email,
				password: password,
			},
		})

		if (user) {
			// Set Apollo with Session
			await storeAuthHeader(token, user)
			return true
		}
		return 'Incorrect Email and Password combination'
	} catch (err) {
		return 'Incorrect Email and Password combination'
	}
}

export const walletSignin = async (
	web3Address: string,
	signedMessage: string
) => {
	try {
		const {
			data: {
				signinWithWeb3: { user, token },
			},
		} = await apollo.mutate({
			mutation: LOGIN_WALLET_MUTATION,
			variables: {
				web3Address,
				signedMessage,
			},
		})

		if (user) {
			// Set Apollo with Session
			await storeAuthHeader(token, user)
			return true
		}
		return 'Sign up with this wallet address first.'
	} catch (err) {
		return 'Sign up with this wallet address first.'
	}
}

export const getAuthHeader = () => {
	return localStorage.getItem('wonderToken') || null
}

export const getWaitlistAuthHeader = () => {
	return localStorage.getItem('waitlistToken') || null
}

export const linkWallet = async (address, signedMessage) => {
	// TODO: send wallet and signed message to backend
	//		 to link with user (current session).
	return true
}

export const storeAuthHeader = async (token, user) => {
	localStorage.setItem('wonderToken', token)
	if (user) {
		try {
			await apollo.writeQuery({
				query: WHOAMI,
				data: {
					users: [user],
				},
			})
		} catch (e) {
			console.log('error writing user into apollo', e)
		}
	}
}

export const storeAuthWaitlistHeader = async (token, waitlistUser) => {
	localStorage.setItem('waitlistToken', token)
	if (waitlistUser) {
		try {
			await apollo.writeQuery({
				query: GET_LOGGED_IN_WAITLIST_USER,
				data: {
					getLoggedinWaitlistUser: {
						__typename: 'WaitlistUser',
						...waitlistUser,
					},
				},
			})
		} catch (e) {
			console.log('error writing waitlist user into apollo', e)
		}
	}
}

export const logout = async () => {
	try {
		localStorage.removeItem('wonderToken')
		await apollo.clearStore()
		window.location.href = '/'
	} catch (exception) {
		return false
	}
}

export const withAuth = (Component, noCache = false) => {
	const AuthComponent = (props) => {
		const { navigation, route } = props
		const [token, setToken] = useState(null)
		const [tokenLoading, setTokenLoading] = useState(true)
		const { data, loading, error } = useQuery(GET_LOGGED_IN_USER)
		useEffect(() => {
			;(async () => {
				const newToken = await getAuthHeader()
				setToken(newToken)
				setTokenLoading(false)
			})()
		}, [token])

		if (!tokenLoading && !token) {
			// Back to the world
			window.location.href = '/login'
			return <Component {...props} />
		} else {
			const user = data?.getLoggedinUser
			return (
				<MyContext.Provider value={user}>
					<Component {...props} user={user} />
				</MyContext.Provider>
			)
		}
	}
	return AuthComponent
}

export const withWaitlistAuth = (Component, noCache = false) => {
	const WaitlistAuthComponent = (props) => {
		const [token, setToken] = useState(null)
		const [tokenLoading, setTokenLoading] = useState(true)
		const { data, loading, error } = useQuery(GET_LOGGED_IN_WAITLIST_USER)

		useEffect(() => {
			;(async () => {
				const newToken = await getWaitlistAuthHeader()
				setToken(newToken)
				setTokenLoading(false)
			})()
		}, [token])

		if (!tokenLoading && !token) {
			return <Component {...props} />
		} else {
			const user = data?.getLoggedinWaitlistUser
			return (
				<MyContext.Provider value={user}>
					<Component {...props} user={user} />
				</MyContext.Provider>
			)
		}
	}
	return WaitlistAuthComponent
}
