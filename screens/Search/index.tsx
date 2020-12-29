import * as React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { SafeAreaView } from 'react-native'

import { withAuth } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { White } from '../../constants/Colors'
import BottomTabNavigator from '../../navigation/BottomTabNavigator'

function SearchScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'Dashboard'>) {
  return (
    <SafeAreaView style={{
      backgroundColor: White  
    }}>
      <Header />

      <BottomTabNavigator />
    </SafeAreaView>
  )
}

export default withAuth(SearchScreen)