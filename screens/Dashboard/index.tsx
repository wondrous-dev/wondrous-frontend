import * as React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { SafeAreaView } from 'react-native'

import { withAuth } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { HomeFeed } from '../../components/Feed'
import { White } from '../../constants/Colors'

function DashboardScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'Dashboard'>) {
  return (
    <SafeAreaView style={{
      backgroundColor: White
    }}>
      <Header />
      <HomeFeed />
    </SafeAreaView>
  )
}

export default withAuth(DashboardScreen)