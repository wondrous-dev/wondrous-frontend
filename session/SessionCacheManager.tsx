import React, { useRef, useEffect, useMemo, ReactNode } from 'react'
import { useQuery } from '@apollo/client'
import  { WHOAMI, GET_LOGGED_IN_USER } from '../graphql/queries'
import apollo from '../services/apollo'
import { getAuthHeader, storeAuthHeader } from '../components/withAuth'

const useSessionCacheManager = () => {
    
    const { data, loading, error } = useQuery(WHOAMI)
    const isGetLoggedInUserLoading = useRef(false)
    const user = data && data.users && data.users.length > 0 ? data.users[0] : null
  
    useEffect(() => {
        (async () => {
          const token = await getAuthHeader();
          if (token && !user && !isGetLoggedInUserLoading.current) {

            isGetLoggedInUserLoading.current = true
            const userResponse = await apollo.query({
              query: GET_LOGGED_IN_USER
            })
            if (userResponse?.data?.getLoggedinUser) {
              await storeAuthHeader(token, userResponse?.data?.getLoggedinUser)
            }
            isGetLoggedInUserLoading.current = false
          }
        })()
      }, [user?.id])
  }

export const withSessionCacheManager = (Component: any) => {
  return (props: any) => {
    
    useSessionCacheManager()

    return <Component {...props} />
  }
}
