import * as React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { SafeAreaView } from 'react-native'

import { useMe, withAuth } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { HomeFeed } from '../../components/Feed'
import { White } from '../../constants/Colors'
import { checkAndUpdateNotificationToken, registerForPushNotificationsAsync } from '../../components/Notifications/RegisterNotification'

function Feed({
  navigation
}: StackScreenProps<RootStackParamList, 'Feed'>) {
  const user = useMe()
  React.useEffect(() => {
    if (user?.notificationToken?.token) {
      checkAndUpdateNotificationToken(user?.notificationToken?.token)
    } else {
      registerForPushNotificationsAsync(user)
    }
  }, [user])
  return (
    <>
    <SafeAreaView style={{
      backgroundColor: White,
      flex: 1
    }}>
      <Header streak={true} />
      <HomeFeed />
    </SafeAreaView>
    </>
  )
}

export default withAuth(Feed)