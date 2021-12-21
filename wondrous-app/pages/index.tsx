import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { getSession } from 'next-auth/react'

const Index = () => {
	const [loading, setLoading] = useState(true)
	const router = useRouter()
	useEffect(() => {
		getSession().then((session) => {
			if (session) {
				router.replace('/dashboard')
			} else {
				setLoading(false)
				router.replace('/login')
			}
		})
	}, [router])

	if (loading) {
		return <></>
	}
	return <></>
}

export default Index
