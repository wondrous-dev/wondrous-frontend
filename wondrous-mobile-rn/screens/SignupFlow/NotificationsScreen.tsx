import React, { useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, Platform, Text, Image, SafeAreaView, KeyboardAvoidingView, TextInput } from 'react-native'
import ProgressCircle from 'react-native-progress-circle'
import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'

import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { spacingUnit } from '../../utils/common'
import { Black, White, Blue500, Red400, Grey500, Grey300, Orange } from '../../constants/Colors'
import { Subheading, Paragraph, ButtonText } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import BigMouthSmile from '../../assets/images/emoji/openMouthSmile'
import { useMe, withAuth } from '../../components/withAuth'
import { registerForPushNotificationsAsync } from '../../components/Notifications/RegisterNotification'

export const usernameSetupStyles = StyleSheet.create({
  stepContainer: {
    marginTop: spacingUnit,
  },
  progressCircleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: spacingUnit * 3,
  },
  usernameInputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: spacingUnit,
  },
  stepCount: {
    fontSize: 16,
    color: Blue500,
    fontFamily: 'Rubik',
    fontStyle: 'normal',
    fontWeight: '500',
  },
})

const redirectNotification = async ({ navigation, user }) => {
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
    if (existingStatus === 'granted' || existingStatus === 'denied') {
      if (!user?.notificationToken?.token && existingStatus === 'granted') {
        await registerForPushNotificationsAsync(user)
      }
      navigation.push('UserInterestCategory')
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

const NotificationPrompt = ({ navigation }) => {

  const user: any = useMe()
  const [promptClicked, setPromptClicked] = useState(false)

  useEffect(() => {
    redirectNotification({ navigation, user })
  }, [promptClicked])

  return (
    <View style={usernameSetupStyles.usernameInputContainer}>
      <Subheading color={Black} style={{
        fontSize: 32
      }}>
        Notifications
      </Subheading>
      <Paragraph style={{
        marginBottom: spacingUnit * 3,
        marginTop: spacingUnit,
        textAlign: 'center',
        paddingLeft: spacingUnit * 2,
        paddingRight: spacingUnit * 2
      }} color={Grey500}>
        So you know when your community interacts with you and for us to keep you accountable!
      </Paragraph>
      <View>
        <PrimaryButton
          textStyle={{ color: White }}
          style={{
            backgroundColor: Orange,
            width: spacingUnit * 43,
            alignSelf: 'center',
            marginTop: spacingUnit // this is not consistent with the next page on figma
          }}
          onPress={async () => {
            setPromptClicked(true)
            await registerForPushNotificationsAsync(user)
            navigation.push('UserInterestCategory')
          }}
        >
          <ButtonText color={White}> Turn on notifications </ButtonText>
        </PrimaryButton>
        <PrimaryButton
          textStyle={{ color: White }}
          style={{
            backgroundColor: White,
            borderColor: Orange,
            borderWidth: 1,
            width: spacingUnit * 43,
            alignSelf: 'center',
            marginTop: spacingUnit * 2 // this is not consistent with the next page on figma
          }}
          onPress={() => {
            navigation.push('UserInterestCategory')
          }}
        >
          <ButtonText color={Orange}> Continue </ButtonText>
        </PrimaryButton>

          </View>

    </View>
  )
}

function NotificationSetupScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'NotificationPrompt'>) {
  return (
    <SafeAreaView style={{
      backgroundColor: White,
      flex: 1,
    }}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Header />
      <View style={usernameSetupStyles.progressCircleContainer}>
        <ProgressCircle
          percent={50}
          radius={50}
          borderWidth={10}
          color={Red400}
          shadowColor={Grey300}
          bgColor={White}
        >
          <BigMouthSmile />
        </ProgressCircle>
        <View style={usernameSetupStyles.stepContainer}>
          <Text style={usernameSetupStyles.stepCount}>step 2/4</Text>
        </View>
      </View>
        <NotificationPrompt navigation={navigation} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default withAuth(NotificationSetupScreen)
