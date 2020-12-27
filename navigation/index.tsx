import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import { ColorSchemeName } from 'react-native'

import NotFoundScreen from '../screens/NotFoundScreen'
import HomeScreen from '../screens/HomeScreen'
import SignupScreen from '../screens/SignupScreen'
import WelcomeScreen from '../screens/SignupFlow/Welcome'
import DashboardScreen from '../screens/Dashboard'
import FeedItemScreen from '../screens/FeedItem'
import { RootStackParamList } from '../types'
import BottomTabNavigator from './BottomTabNavigator'
import LinkingConfiguration from './LinkingConfiguration'

// If you are not familiar with React Navigation, we recommend going through the
// 'Fundamentals' guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  )
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>()

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Signup' component={SignupScreen} />
      <Stack.Screen name='Login' component={SignupScreen} />
      <Stack.Screen name='Welcome' component={WelcomeScreen} />
      <Stack.Screen name='Dashboard' component={DashboardScreen} />
      <Stack.Screen name='FeedItem' component={FeedItemScreen} />
      <Stack.Screen name='Root' component={BottomTabNavigator} />
      <Stack.Screen name='NotFound' component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  )
}
