import * as React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { createStackNavigator } from '@react-navigation/stack'

import { withAuth } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import UserProfile from './UserProfile'
import ProjectProfile from './ProjectProfile'

const Stack = createStackNavigator<RootStackParamList>()

function ProfileScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'Dashboard'>) {
  return (
    <Stack.Navigator screenOptions={{ 
      headerShown: false,
      gestureResponseDistance: { vertical: 200, horizontal: 250 }
    }}>
      <Stack.Screen name='UserProfile' component={UserProfile} />
      <Stack.Screen name='ProjectProfile' component={ProjectProfile} />
    </Stack.Navigator>
  )
}

export default withAuth(ProfileScreen)