import React, { useState, createContext, useContext, useCallback } from "react"
import { useQuery } from "@apollo/client"
import { WHOAMI, GET_LOGGED_IN_USER } from "../graphql/queries"
import apollo from "../services/apollo"
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Analytics from 'expo-firebase-analytics'

type AuthContextData = {
  authData?: AuthData
  loading: boolean
  saveSession(token: string, user: any): Promise<void>
  signOut(): void
}

type AuthData = {
  token: string
  user: any
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC = ({children}) => {
  const [authData, setAuthData] = useState<AuthData>()

  const [loading, setLoading] = useState(true)
  
  const saveSession = useCallback(async (token: string, user: any) => {
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
      setAuthData({ token, user })
    }
  }, [])

  const signOut = useCallback(async () => {
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
    } catch(exception) {
      console.log('error remove token from asyncStorage', exception)
    }
    setAuthData(undefined)
  }, [])

  const onCacheResult = async (data?: any) => {
    try {
      const token = await getAuthHeader()
      if (token) {
        let user = data?.users?.[0]
        if (!user) {
          console.log("not logged user in cache. loading...")
          const userResponse = await apollo.query({
            query: GET_LOGGED_IN_USER,
          })
          user = userResponse?.data?.getLoggedinUser
          if (user) {
            await saveSession(token, userResponse?.data?.getLoggedinUser)
          } else {
            return
          }
        }
        setAuthData({ token, user })
      }
    } finally {
      setLoading(false)
    }
  }

  useQuery(WHOAMI, {
    fetchPolicy: "cache-only",
    onCompleted: async (data) => {
      console.log("Completed loading user from cache")
      await onCacheResult(data)
    },
    onError: async error => {
      console.log("Error while loading user from cache. " + error)
      await onCacheResult()
    }
  })

  return (
  <AuthContext.Provider value={{ authData, loading, saveSession, signOut }}>
    {children}
  </AuthContext.Provider>)
}

export const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem('token') || null
  return token
}

export const useAuth  = (): AuthContextData => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
