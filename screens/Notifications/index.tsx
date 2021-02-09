import React, { useCallback, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { SafeAreaView, RefreshControl, Text, StyleSheet, View, FlatList, ActivityIndicator } from 'react-native'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'

import { withAuth } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { White, Grey300 } from '../../constants/Colors'
import BottomTabNavigator from '../../navigation/BottomTabNavigator'
import { GET_NOTIFICATIONS } from '../../graphql/queries'
import Constants from 'expo-constants';
import { spacingUnit, capitalizeFirstLetter, renderMentionString, wait } from '../../utils/common'

const notificationStyles = StyleSheet.create({
  notificationItemContainer: {
    padding: spacingUnit * 2
  },
  notificationItemName: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  notificationItemContent: {
    flex: 1,
    flexDirection: 'row',
    marginTop: spacingUnit * 3,
    alignContent: 'center',
    flexShrink: 1
  },
});

const formatNotificationMessage = (notificationInfo) => {
  let displayMessage = '';
  switch (notificationInfo.type) {
    case 'mention':
      displayMessage = formatNotificationMentionMessage(notificationInfo);
    case 'reaction':
      displayMessage = formatNotificationReactionMessage(notificationInfo);
    case 'comment':
      displayMessage = formatNotificationCommentMessage(notificationInfo);
    default:
      displayMessage = '';
  }
  return displayMessage;
}
const formatNotificationMentionMessage = (notificationInfo) => {
  let displayMessage = ''
  switch (notificationInfo.objectType) {
    case 'goal':
      displayMessage = `${notificationInfo.actorUsername} mentioned you in a goal`;
    case 'task':
      displayMessage = `${notificationInfo.actorUsername} mentioned you in a task`;
    case 'ask':
        displayMessage = `${notificationInfo.actorUsername} asked for your help`;
    case 'post':
          displayMessage = `${notificationInfo.actorUsername} mentioned you in a post`;
    case 'comment':
      displayMessage = `${notificationInfo.actorUsername} mentioned you in a comment`;
    default:
      displayMessage = '';
  }
  return displayMessage;
}
const formatNotificationReactionMessage = (notificationInfo) => {
  let displayMessage = ''
  switch (notificationInfo.objectType) {
    case 'feed_item':
      displayMessage = `${notificationInfo.actorUsername} reacted to your action`;
    case 'feed_comment':
      displayMessage = `${notificationInfo.actorUsername} reacted to your`;
    default:
      displayMessage = '';
  }
  return displayMessage;
}
const formatNotificationCommentMessage = (notificationInfo) => {
  let displayMessage = ''
  switch (notificationInfo.objectType) {
    case 'mention':
      displayMessage = `${notificationInfo.actorUsername} commented on your`;
    case 'reaction':
      displayMessage = `${notificationInfo.actorUsername} commented on your`;
    case 'comment':
      displayMessage = `${notificationInfo.actorUsername} commented on your`;
    default:
      displayMessage = '';
  }
  return displayMessage;
}

export const NotificationDisplay = ({ notificationInfo }) => {
  const displayMessage = formatNotificationMessage(notificationInfo)
  return (
    <View style={notificationStyles.notificationItemContainer}>
      <Text>{displayMessage}</Text>
    </View>
  )
}

export const NotificationFeed = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    getItems()
    wait(2000).then(() => setRefreshing(false))
  }, [])


  const [getItems, { loading, data, error, refetch, fetchMore }] = useLazyQuery(GET_NOTIFICATIONS, {
    fetchPolicy: 'network-only'
  })
  if (error) {
    console.log('Error fetching Notification', error)
  }

  useEffect(() => {
    getItems()
  }, [])

  if (loading) {
    return (
      <View style={{
        backgroundColor: White,
        paddingTop: 16
      }}>
        <ActivityIndicator />
      </View>
    )
  }
  console.log(data)
  return (
    <>
      <FlatList
        contentContainerStyle={{
          paddingBottom: spacingUnit * 10
        }}
        data={data && data.getNotifications}
        renderItem={({ item, index, separators }) => (
          <NotificationDisplay notificationInfo={item} />
        )}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ItemSeparatorComponent={() => (
          <View
            style={{
              borderBottomColor: Grey300,
              borderBottomWidth: 1,
            }}
          />
        )}
      >
      </FlatList>
    </>
  )

}

function NotificationScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'Dashboard'>) {

  return (
    <SafeAreaView style={{
      backgroundColor: White
    }}>
      <Header />
      <NotificationFeed />
    </SafeAreaView>
  )
}

export default withAuth(NotificationScreen)