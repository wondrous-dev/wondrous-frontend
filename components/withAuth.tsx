import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import  { WHOAMI } from '../graphql/queries'
const MyContext = React.createContext(null)

export const useMe = () => {
  return useContext(MyContext)
}

export const withAuth = (Component, noCache=false) => {
  return props => {
    
    const { data } = useQuery(WHOAMI)
    const user = data && data.users && data.users.length > 0 ? data.users[0] : null

    if (!user) {
      return <Component {...props} />
    }

    return <MyContext.Provider value={user}>
      <Component {...props} user={user} />
    </MyContext.Provider>
  }
}
