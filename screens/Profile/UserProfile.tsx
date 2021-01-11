
import * as React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { SafeAreaView } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import { withAuth } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { White } from '../../constants/Colors'
import BottomTabNavigator from '../../navigation/BottomTabNavigator'

function UserProfile({
  navigation
}: StackScreenProps<RootStackParamList, 'UserProfile'>) {
  return (
    <SafeAreaView style={{
      backgroundColor: White  
    }}>
      <Header />
    </SafeAreaView>
  )
}

export default withAuth(UserProfile)
