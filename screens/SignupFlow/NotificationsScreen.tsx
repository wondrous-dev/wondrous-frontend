import React, { createContext, useContext, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, Platform, Text, Image, SafeAreaView, KeyboardAvoidingView, TextInput } from 'react-native'
import ProgressCircle from 'react-native-progress-circle'
import { Formik } from 'formik'
import * as Sentry from 'sentry-expo'
import * as Analytics from 'expo-firebase-analytics'
import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'

import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { spacingUnit, extractFirstAndLastName, capitalizeFirstLetter } from '../../utils/common'
import { Black, White, Blue500, Red400, Grey500, Grey200, Grey300, GreyPlaceHolder, Orange } from '../../constants/Colors'
import { Subheading, Paragraph, ButtonText, ErrorText } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import Neutral from '../../assets/images/emoji/neutral'
import BigMouthSmile from '../../assets/images/emoji/openMouthSmile'
import { useMutation, useQuery } from '@apollo/client'
import { CREATE_ONBOARDING_TASKS, CREATE_USERNAME, UPDATE_NOTIFICATION_TOKEN, UPDATE_USER } from '../../graphql/mutations'
import { useMe, withAuth } from '../../components/withAuth'
import { SHORTNAME_REGEX } from '../../constants'
import { MY_USER_INVITE } from '../../graphql/queries/userInvite'
import { LogEvents } from '../../utils/analytics'
import { checkAndUpdateNotificationToken, registerForPushNotificationsAsync } from '../../components/Notifications/RegisterNotification'
import apollo from '../../services/apollo'

const UsernameContext = createContext(null)

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

const redirectNotification = async ({ navigation, activeToken }) => {
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
    const token = (await Notifications.getExpoPushTokenAsync()).data
    if (token !== activeToken) {
      // Update token
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
    navigation.push('UserInterestCategory')
  } else {
    alert('Must use physical device for Push Notifications')
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
  const {
    setError,
    error
  } = useContext(UsernameContext)

  const user: any = useMe()
  const { data: userInviteData, error: userInviteError } = useQuery(MY_USER_INVITE)

  useEffect(() => {
    if (user && user.usageProgress && user.usageProgress.signupCompleted) {
      navigation.push('Root', {
        screen: 'Profile',
        params: {
          screen: 'ProjectProfile',
          params: {
            projectId: user.usageProgress.projectCreated,
            noGoingBack: true
          }
        }
      })
    }
    if (user?.notificationToken?.token) {
      redirectNotification({ navigation, activeToken: user?.notificationToken?.token })
    }
  }, [])

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
      <Formik
        initialValues={{ username: user && user.username, fullName: user?.firstName ? `${user?.firstName} ${user?.lastName}` : null }}
        onSubmit={async () => {
          navigation.push('UserInterestCategory')
        }}
      >
        {({ handleSubmit }) => (
          <View>
            <PrimaryButton
              textStyle={{ color: White }}
              style={{
                backgroundColor: Orange,
                width: spacingUnit * 43,
                alignSelf: 'center',
                marginTop: spacingUnit // this is not consistent with the next page on figma
              }}
              onPress={() => registerForPushNotificationsAsync(user)}
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
              onPress={handleSubmit}
            >
              <ButtonText color={Orange}> Continue </ButtonText>
            </PrimaryButton>

          </View>
        )}
      </Formik>

    </View>
  )
}

function NotificationSetupScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'UsernameSetup'>) {
  const [error, setError] = useState(null)
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
      <UsernameContext.Provider value={{
        error,
        setError
      }}>
        <NotificationPrompt navigation={navigation} />
      </UsernameContext.Provider>
      {
          error && <View style={{
            alignItems: 'center',
            marginTop: spacingUnit
          }}>
            <ErrorText>
              {error}
            </ErrorText>
          </View>
        }
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default withAuth(NotificationSetupScreen)
