import * as React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { SafeAreaView } from 'react-native'

import { withAuth } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'

function DashboardScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'Dashboard'>) {
  return (
    <SafeAreaView>
      <Header />
    </SafeAreaView>
  )
}

export default withAuth(DashboardScreen)