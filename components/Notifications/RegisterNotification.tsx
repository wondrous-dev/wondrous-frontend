import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'
import React, { useState, useEffect, useRef } from 'react'
import { Text, View, Button, Platform } from 'react-native'
import * as Analytics from 'expo-firebase-analytics'

import { CREATE_NOTIFICATION_TOKEN, UPDATE_NOTIFICATION_TOKEN } from '../../graphql/mutations'
import apollo from '../../services/apollo'
import { useMe } from '../withAuth'
import { LogEvents } from '../../utils/analytics'
import { getPushTokenData } from '../../services/pushNotification'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export const registerForPushNotificationsAsync = async (user) => {
  if (Constants.isDevice) {
    try {
      Analytics.logEvent(LogEvents.TURN_ON_NOTIFICATIONS_CLICK, {
        user_id: user?.id
      })
    } catch(err) {
      console.error('failed to log username create')
    }
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      return
    }
    try {
      Analytics.logEvent(LogEvents.NOTIFICATIONS_GRANTED, {
        user_id: user?.id
      })
    } catch(err) {
      console.error('failed to log username create')
    }
    const token = await getPushTokenData()
    try {
      console.log("PushNotification. register token on backend")
      const result = await apollo.mutate({
        mutation: CREATE_NOTIFICATION_TOKEN,
        variables:{
          token
        }
      })
    // console.log('result', result)
    } catch (error) {
      console.log(JSON.stringify(error, null, 2))
    }
  } else {
    console.log('Must use physical device for Push Notifications')
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }
}

export const checkAndUpdateNotificationToken = async (activeToken) => {
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      return
    }
    const token = await getPushTokenData()
    if (token !== activeToken) {
      console.log("PushNotification. update token on backend")
      try {
        const result = await apollo.mutate({
          mutation: UPDATE_NOTIFICATION_TOKEN,
          variables:{
            token
          }
        })
          // console.log('result', result)
      } catch (error) {
        console.log(JSON.stringify(error, null, 2))
      }
    }
  } else {
    console.log('Must use physical device for Push Notifications')
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }
}

async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    message: 'Random one',
    data: { data: 'goes here' },
  };

  try {
    const result = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
    console.log('result', result)
  } catch (err) {
    console.log('err', err)
  }
}

export const NotificationTester = () => {
  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()

  useEffect(() => {
    registerForPushNotificationsAsync({})

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    }
  }, [])

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
    </View>
  )
}