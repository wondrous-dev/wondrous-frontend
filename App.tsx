import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ApolloProvider } from '@apollo/client'
import Toast from 'react-native-toast-message'
import AppLoading from 'expo-app-loading'

import useCachedResources from './hooks/useCachedResources'
import useColorScheme from './hooks/useColorScheme'
import Navigation from './navigation'
import apollo from './services/apollo'
import storybook from './storybook'
import { toastConfig } from './components/Toast'

const STORYBOOK_START = false
// Render story book if you want to look at development
export default function App() {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()

  if (!isLoadingComplete) {
    return  <AppLoading />
  } else {
    return (
      <ApolloProvider client={apollo}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
          <StatusBar />
        </SafeAreaProvider>
      </ApolloProvider>
    )
  }
}
