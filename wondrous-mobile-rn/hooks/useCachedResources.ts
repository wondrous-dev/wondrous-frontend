import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import * as React from 'react'

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false)
  setTimeout(() => {
    setLoadingComplete(true)
    SplashScreen.hideAsync()
  }, 3000)
  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync()
        // Load fonts
        await Font.loadAsync({
          'Rubik Light': require('../assets/fonts/Rubik-Regular.ttf'),
          'Rubik': require('../assets/fonts/Rubik-Medium.ttf'),
          'Rubik Bold': require('../assets/fonts/Rubik-Bold.ttf'),
          'Rubik SemiBold': require('../assets/fonts/Rubik-SemiBold.ttf'),
          'Pacifico': require('../assets/fonts/Pacifico-Regular.ttf')
        })
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e)
      } finally {
        setLoadingComplete(true)
      }
    }
    if (isLoadingComplete) {
      SplashScreen.hideAsync()
    } else {
      loadResourcesAndDataAsync()
    }
  }, [isLoadingComplete])

  return isLoadingComplete
}
