import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ApolloProvider } from '@apollo/client'
import Toast from 'react-native-toast-message'
import AppLoading from 'expo-app-loading'
import * as Sentry from 'sentry-expo'

import useCachedResources from './hooks/useCachedResources'
import useColorScheme from './hooks/useColorScheme'
import Router from './navigation'
import apollo from './services/apollo'
import storybook from './storybook'
import { toastConfig } from './components/Toast'
import { AuthProvider } from './session'

const STORYBOOK_START = false
Sentry.init({
  dsn: 'https://567606376574429a9108c9be9f7c1c48@o552479.ingest.sentry.io/5678347'
});

// // Access any @sentry/react-native exports via:
// Sentry.Native.*

// // Access any @sentry/browser exports via:
// Sentry.Browser.*

// Sentry.Native.captureException(new Error("Test on prod"))
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
          <AuthProvider>
            <Router colorScheme={colorScheme} />
          </AuthProvider>
          <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
          <StatusBar />
        </SafeAreaProvider>
      </ApolloProvider>
    )
  }
}
