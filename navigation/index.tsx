import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { useState, useEffect } from 'react'
import { ColorSchemeName, Platform, Linking } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'

import { getNotificationPressFunction } from '../screens/Notifications'
import NotFoundScreen from '../screens/NotFoundScreen'
import HomeScreen from '../screens/HomeScreen'
import SignupScreen from '../screens/SignupScreen'
import EmailSigninScreen from '../screens/SignupFlow/EmailSigninScreen'
import EmailSignupScreen from '../screens/SignupFlow/EmailSignupScreen'
import WelcomeScreen from '../screens/SignupFlow/Welcome'
import ProjectSetupCategoryScreen from '../screens/SignupFlow/ProjectSetupCategory'
import UsernameSetupScreen from '../screens/SignupFlow/UsernameSetupScreen'
import FirstProjectSetupScreen from '../screens/SignupFlow/FirstProjectSetupScreen'
import ProjectTagSelectionScreen from '../screens/SignupFlow/ProjectTagSelectionScreen'
import DashboardScreen from '../screens/Dashboard'
import { RootStackParamList } from '../types'
import BottomTabNavigator from './BottomTabNavigator'
import LinkingConfiguration from './LinkingConfiguration'


// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>()

const PERSISTENCE_KEY = "persistenceKey"

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      gestureEnabled: false
    }}>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Signup' component={SignupScreen} options={{ gestureEnabled: true }} />
      <Stack.Screen name='Login' component={SignupScreen} options={{ gestureEnabled: true }} />
      <Stack.Screen name='EmailSignup' component={EmailSignupScreen}options={{ gestureEnabled: true }} />
      <Stack.Screen name='EmailSignin' component={EmailSigninScreen} options={{ gestureEnabled: true }}/>
      <Stack.Screen name='Welcome' component={WelcomeScreen} />
      <Stack.Screen name='ProjectSetupCategory' component={ProjectSetupCategoryScreen} />
      <Stack.Screen name='UsernameSetup' component={UsernameSetupScreen} />
      <Stack.Screen name='FirstProjectSetup' component={FirstProjectSetupScreen} initialParams={{ setup: true }} />
      <Stack.Screen name='ProjectTagSelection' component={ProjectTagSelectionScreen} />
      <Stack.Screen name='Dashboard' component={DashboardScreen} />
      <Stack.Screen name='Root' component={BottomTabNavigator} />
      <Stack.Screen name='NotFound' component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  )
}

// If you are not familiar with React Navigation, we recommend going through the
// 'Fundamentals' guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState()
  const navigationRef = React.useRef(null)
  useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (Platform.OS !== 'web' && initialUrl == null) {
          // Only restore state if there's no deep link and we're not on web
          const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
          const state = savedStateString ? JSON.parse(savedStateString) : undefined;

          if (state !== undefined) {
            setInitialState(state);
          }
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
    if (navigationRef && navigationRef.current) {
      const navigation = navigationRef.current
      // Redirect from here
      const subscription = Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data;

        // Any custom logic to see whether the URL needs to be handled
        //...
        getNotificationPressFunction({
          notificationInfo: data,
          navigation,
          tab: 'Notifications',
          notifications: null,
          push: true
        })
        // Let React Navigation handle the URL
        // listener(url)
      });
  
      return () => {
        // Clean up the event listeners
        // Linking.removeEventListener('url', onReceiveURL);
        subscription.remove();
      }
    }
  }, [isReady, navigationRef]);

  if (!isReady) {
    return null;
  }
  return (
    <NavigationContainer
      ref={navigationRef}
      linking={LinkingConfiguration}
      initialState={initialState}
      onStateChange={(state) =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  )
}