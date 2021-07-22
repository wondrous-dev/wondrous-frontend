import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Analytics from 'expo-firebase-analytics'

import apollo from '../services/apollo'
import  { WHOAMI } from '../graphql/queries'
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

    const { data, loading, error } = useQuery(WHOAMI)
    const user = data && data.users && data.users.length > 0 ? data.users[0] : null

    if (!user) {
      return <Component {...props} />
    }

    return <MyContext.Provider value={user}>
      <Component {...props} user={user} />
    </MyContext.Provider>
  }
}
