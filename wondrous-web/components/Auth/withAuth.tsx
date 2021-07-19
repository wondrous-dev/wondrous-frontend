import React, { useContext, useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'

import apollo from '../../services/apollo'
import  { WHOAMI } from '../../graphql/queries'

const MyContext = React.createContext(null)

export const useMe = () => {
  return useContext(MyContext)
}

export const getAuthHeader = () => {
  return localStorage.getItem('token') || null
}


export const storeAuthHeader = async (token, user) => {
  localStorage.setItem('token', token)
  if (user) { 
    try {
      await apollo.writeQuery({
        query: WHOAMI,
        data: {
          users: [user]
        }
      })
    } catch (e) {
      console.log('error writing user into apollo', e)
    }
  }
}

export const logout = async (navigation) => {
  try {
    localStorage.removeItem('token')
    // window.location.href = '/sign-in'
  
    return apollo.clearStore()
  }
  catch(exception) {
      return false;
  }
}

export const withAuth = (Component, noCache=false) => {
  return props => {
    const { navigation, route } = props
    const [token , setToken] = useState(null)
    const [tokenLoading, setTokenLoading] = useState(true)
    const { data, loading, error } = useQuery(WHOAMI)
    useEffect(() => {
      (async () => {
        const newToken = await getAuthHeader()
        setToken(newToken)
        setTokenLoading(false)
      })()
    }, [token])

    if (!tokenLoading && !token) {
      return <Component {...props} />
    } else {
      const user = data && data.users && data.users.length > 0 ? data.users[0] : null
      return (
        <MyContext.Provider value={user}>
          <Component {...props} user={user} />
        </MyContext.Provider>
      )
    }
  }
}
