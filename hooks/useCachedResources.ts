import { Ionicons } from '@expo/vector-icons'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import * as React from 'react'
const TIMEOUT = 5000

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false)

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync()
        setTimeout(() => {
          setLoadingComplete(true)
          SplashScreen.hideAsync()
        }, TIMEOUT)
        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'Rubik Light': require('../assets/fonts/Rubik-Regular.ttf'),
          'Rubik': require('../assets/fonts/Rubik-Medium.ttf'),
          'Rubik Bold': require('../assets/fonts/Rubik-Bold.ttf'),
          'Rubik SemiBold': require('../assets/fonts/Rubik-SemiBold.ttf'),
          'Pacifico': require('../assets/fonts/Pacifico-Regular.ttf'),
          'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
        })
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e)
      } finally {
        setLoadingComplete(true)
        SplashScreen.hideAsync()
      }
    }

    loadResourcesAndDataAsync()
  }, [])

  return isLoadingComplete
}
