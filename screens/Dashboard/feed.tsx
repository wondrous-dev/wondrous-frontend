import * as React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { SafeAreaView } from 'react-native'

import { useMe, withAuth } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { HomeFeed } from '../../components/Feed'
import { White } from '../../constants/Colors'
import { checkAndUpdateNotificationToken } from '../../components/Notifications/RegisterNotification'

function Feed({
  navigation
}: StackScreenProps<RootStackParamList, 'Feed'>) {
  const user = useMe()
  React.useEffect(() => {
    checkAndUpdateNotificationToken(user?.notificationToken?.token)
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