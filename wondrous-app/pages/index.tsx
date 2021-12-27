import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getAuthHeader } from '../components/Auth/withAuth'

const Index = () => {
	const [loading, setLoading] = useState(true)
	const router = useRouter()

	const checkSession = useCallback(async () => {
		const token = getAuthHeader()
		console.log('Token:', token)
		if (token) {
			router.replace('/dashboard')
		} else {
			router.replace('/login')
		}
	}, [router])

	useEffect(() => {
		checkSession()
	}, [checkSession])

	if (loading) {
		return <></>
	}
	return <></>
}

export default Index
