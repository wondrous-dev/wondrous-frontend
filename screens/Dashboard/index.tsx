import * as React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { SafeAreaView } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import { withAuth } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { HomeFeed } from '../../components/Feed'
import { White } from '../../constants/Colors'
import Feed from './feed'
import FeedItem from '../FeedItem'

const Stack = createStackNavigator<RootStackParamList>()

function DashboardScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'Dashboard'>) {

  return (
    <Stack.Navigator screenOptions={{ 
      headerShown: false,
      gestureResponseDistance: { vertical: 200, horizontal: 250 }
    }}>
      <Stack.Screen name='Feed' component={Feed} />
      <Stack.Screen name='FeedItem' component={FeedItem} />
    {/* <BottomTabNavigator /> */}
    </Stack.Navigator>
  )
}

export default withAuth(DashboardScreen)