import { isDebug } from '../utils/environment'
import * as Notifications from 'expo-notifications'

export const getPushTokenData = async () => {
  const token =  await getPushToken()

  console.log("PushNotification. token: " + JSON.stringify(token));

  return token
}

const  getPushToken = async () => Notifications.getExpoPushTokenAsync(getConfig())

const getConfig = () => ({ experienceId: "@wonderapp/Wonder", development: isDebug() })