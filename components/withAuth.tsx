import React, { useContext, useEffect, useState } from 'react'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Analytics from 'expo-firebase-analytics'

import apollo from '../services/apollo'
import  { WHOAMI, GET_LOGGED_IN_USER } from '../graphql/queries'
const MyContext = React.createContext(null)

export const useMe = () => {
  return useContext(MyContext)
}


export const storeAuthHeader = async (token, user) => {
  await AsyncStorage.setItem('token', token)
  if (user) { 
    try {
      await apollo.writeQuery({
        query: WHOAMI,
        data: {
          users: [user]
        }
      })
      try {
        Analytics.setUserId(user?.id)
      } catch(err) {
        console.error('failed to set user id')
      }
    } catch (e) {
      console.log('error writing user into apollo', e)
    }
  }
}

export const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem('token') || null
  return token
}

export const logout = async (navigation) => {
  try {
    await AsyncStorage.removeItem('token')
    try {
      await apollo.writeQuery({
        query: WHOAMI,
        data: {
          users: null
        }
      })
    } catch (e) {
      console.log('error writing user into apollo', e)
    }
    navigation.push('Home')
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
    const [loggedinUser, setLoggedInUser] = useState(null)
    const user = data && data.users && data.users.length > 0 ? data.users[0] : null
    useEffect(() => {
      (async () => {
        const newToken = await getAuthHeader()
        if (newToken && !user) {
          // fetch the new user and write into storage
          const userResponse = await apollo.query({
            query: GET_LOGGED_IN_USER
          })
          if (userResponse?.data?.getLoggedinUser) {
            setLoggedInUser(userResponse?.data?.getLoggedinUser)
            await storeAuthHeader(newToken, userResponse?.data?.getLoggedinUser)
          }
        } else if (user) {
          setLoggedInUser(user)
        }
        setToken(newToken)
        setTokenLoading(false)
      })()
    }, [token])

    if (!tokenLoading && !token) {
      const pathname = route && route.name
      // if (loading !== true && pathname !== 'Signup' && pathname !== 'Login' && pathname !== 'InviteRedeem' && pathname !== '/') {
      //   navigation.push('Login')
      // }
      return <Component {...props} />
    } else {
      return (
        <MyContext.Provider value={loggedinUser}>
          <Component {...props} user={loggedinUser} />
        </MyContext.Provider>
      )
    }
  }
}
