import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { useState, useEffect } from 'react'
import { ColorSchemeName, Platform, Linking } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Analytics from 'expo-firebase-analytics'
import * as Sentry from 'sentry-expo'

import NotFoundScreen from '../screens/NotFoundScreen'
import HomeScreen from '../screens/HomeScreen'
import SignupScreen from '../screens/SignupScreen'
import EmailSigninScreen from '../screens/SignupFlow/EmailSigninScreen'
import EmailSignupScreen from '../screens/SignupFlow/EmailSignupScreen'
import WelcomeScreen from '../screens/SignupFlow/Welcome'
import ProjectSetupCategoryScreen from '../screens/SignupFlow/ProjectSetupCategory'
import UsernameSetupScreen from '../screens/SignupFlow/UsernameSetupScreen'
import FirstProjectSetupScreen from '../screens/SignupFlow/FirstProjectSetupScreen'
import ProjectInviteCollaborators from '../screens/Project/ProjectInviteCollaborators'
import ProjectTagSelectionScreen from '../screens/SignupFlow/ProjectTagSelectionScreen'
import DashboardScreen from '../screens/Dashboard'
import { RootStackParamList } from '../types'
import BottomTabNavigator from './BottomTabNavigator'
import LinkingConfiguration from './LinkingConfiguration'
import GroupSetupScreen from '../screens/SignupFlow/GroupSetupScreen'
import UserInterestCategoryScreen from '../screens/SignupFlow/UserInterestCategory'
import FollowRecommendation from '../screens/SignupFlow/FollowRecommendation'
import NotificationsScreen from '../screens/SignupFlow/NotificationsScreen'
import { useAuth } from '../session'

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>()

const PERSISTENCE_KEY = "persistenceKey"

const AppStack = () => {

  return (
    <Stack.Navigator
    screenOptions={{
      headerShown: false,
      gestureEnabled: false
    }}>
      <Stack.Screen name='Root' component={BottomTabNavigator} />
      <Stack.Screen name='ProjectSetupCategory' component={ProjectSetupCategoryScreen} />
      <Stack.Screen name='UsernameSetup' component={UsernameSetupScreen} />
      <Stack.Screen name='GroupSetup' component={GroupSetupScreen} />
      <Stack.Screen name='FirstProjectSetup' component={FirstProjectSetupScreen} />
      <Stack.Screen name='ProjectInviteCollaborators' component={ProjectInviteCollaborators} />
      <Stack.Screen name='ProjectTagSelection' component={ProjectTagSelectionScreen} />
      <Stack.Screen name='Dashboard' component={DashboardScreen} />
      <Stack.Screen name='NotFound' component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Screen name='UserInterestCategory' component={UserInterestCategoryScreen} />
      <Stack.Screen name='NotificationPrompt' component={NotificationsScreen} />
      <Stack.Screen name='FollowRecommendation' component={FollowRecommendation} />
    </Stack.Navigator>
  )
}

const AuthStack = () => {
  return (
    <Stack.Navigator
    screenOptions={{
      headerShown: false,
      gestureEnabled: false
    }}>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Signup' component={SignupScreen} options={{ gestureEnabled: true }} />
      <Stack.Screen name='Login' component={SignupScreen} options={{ gestureEnabled: true }} />
      <Stack.Screen name='EmailSignup' component={EmailSignupScreen}options={{ gestureEnabled: true }} />
      <Stack.Screen name='EmailSignin' component={EmailSigninScreen} options={{ gestureEnabled: true }}/>
      <Stack.Screen name='Welcome' component={WelcomeScreen} />
    </Stack.Navigator>
  )
}

// If you are not familiar with React Navigation, we recommend going through the
// 'Fundamentals' guide: https://reactnavigation.org/docs/getting-started

// Get the current screen from the navigation state
function getActiveRouteName(navigationState) {
  const previousRouteName = routeNameRef.current
  const currentRouteName = navigationRef.current.getCurrentRoute().name

  if (previousRouteName !== currentRouteName) {
    // Do something here with it
  }

  // Save the current route name for later comparision
  routeNameRef.current = currentRouteName
}

function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {

  const {authData, loading} = useAuth()

  const [isReady, setIsReady] = React.useState(false)
  const [initialState, setInitialState] = React.useState()
  const routeNameRef = React.useRef()
  useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL()

        if (Platform.OS !== 'web' && initialUrl == null) {
          // Only restore state if there's no deep link and we're not on web
          const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY)
          const state = savedStateString ? JSON.parse(savedStateString) : undefined

          if (state !== undefined) {
            setInitialState(state)
          }
        }
      } finally {
        setIsReady(true)
      }
    }

    if (!isReady) {
      restoreState()
    }
  }, [isReady])

  if (!isReady) {
    return null
  }
  
  // Gets the current screen from navigation state
  const getActiveRouteName = (state)=> {
      const route = state.routes[state?.index || 0]
      if (route.state) {
        // Dive into nested navigators
        return getActiveRouteName(route.state)
      }

      if (route.params) {
        return route.name + JSON.stringify(route.params)
      }
      return route.name
  }

  if (loading) {
    return null
  }

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      initialState={initialState}
      onStateChange={(state) => {
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
        const currentScreen = getActiveRouteName(state)
        Analytics.setCurrentScreen(currentScreen)
      }
      }
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {authData?.token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

export default Navigation