import React, { createContext, useContext, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, Platform, Text, Image, SafeAreaView, KeyboardAvoidingView, TextInput } from 'react-native'
import ProgressCircle from 'react-native-progress-circle'
import { Formik } from 'formik'
import * as Sentry from 'sentry-expo'
import * as Analytics from 'expo-firebase-analytics'

import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { spacingUnit, extractFirstAndLastName, capitalizeFirstLetter } from '../../utils/common'
import { Black, White, Blue500, Red400, Grey500, Grey200, Grey300, GreyPlaceHolder, Orange } from '../../constants/Colors'
import { Subheading, Paragraph, ButtonText, ErrorText } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import Neutral from '../../assets/images/emoji/neutral'
import { useMutation, useQuery } from '@apollo/client'
import { CREATE_ONBOARDING_TASKS, CREATE_USERNAME, UPDATE_USER } from '../../graphql/mutations'
import { useMe, withAuth } from '../../components/withAuth'
import { SHORTNAME_REGEX } from '../../constants'
import { MY_USER_INVITE } from '../../graphql/queries/userInvite'
import { LogEvents } from '../../utils/analytics'

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



const UsernameInput = ({ navigation }) => {
  const {
    setError,
    error
  } = useContext(UsernameContext)
  const [updateUser] = useMutation(UPDATE_USER, {
    update(cache, { data: { updateUser }}) {
      cache.modify({
        fields: {
          users() {
            return [updateUser]
          }
        }
      })
    }
  })

  const user: any = useMe()
  const { data: userInviteData, error: userInviteError } = useQuery(MY_USER_INVITE)
  const [userInvite, setUserInvite] = useState(null)
  const [groupId, setGroupId] = useState(null)
  const [createUsername] = useMutation(CREATE_USERNAME, {
    update(cache, { data: { createUsername }}) {
      cache.modify({
        fields: {
          users() {
            return [{
              ...user,
              username: createUsername?.username
            }]
          }
        }
      })
    }
  })
  const [createOnboardingTasks] = useMutation(CREATE_ONBOARDING_TASKS)

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
    if (user && user.username) {
      navigation.push('NotificationPrompt')
    }
    if (userInviteData) {
      Sentry.Native.captureEvent({
        message: 'User Invite data',
        extra: userInviteData
      })
      setUserInvite(userInviteData?.userInvitation?.userInvitationId)
      setGroupId(userInviteData?.userInvitation?.groupId)
    }
    if (userInviteError) {
      Sentry.Native.captureEvent({
        message: 'Error fetching user invite data',
        extra: userInviteError
      })
    }
  }, [userInviteData, userInviteError])

  return (
    <View style={usernameSetupStyles.usernameInputContainer}>
      <Subheading color={Black} style={{
        fontSize: 32
      }}>
        Let's get you set up
      </Subheading>
      <Paragraph style={{
        marginBottom: spacingUnit * 3,
        marginTop: spacingUnit
      }} color={Grey500}>
        {
          user?.firstName ?
          'What do you want your username to be?'
          :
          'What do you want your names to be?'
        }
      </Paragraph>
      <Formik
        initialValues={{ username: user && user.username, fullName: user?.firstName ? `${user?.firstName} ${user?.lastName}` : null }}
        onSubmit={async values => {
          if (!user?.firstName && !values?.fullName && !values?.fullName.trim()) {
            setError('Please enter a name')
          }  else if (!values.username) {
            setError('Please enter a shortname')
          } else if (values?.username && !SHORTNAME_REGEX.test(values?.username?.trim())) {
            setError('Please enter a valid username between 3 to 16 characters')
          } else {
            const {
              firstName,
              lastName 
            } = extractFirstAndLastName(values.fullName)
            try {
              await createUsername({
                variables: {
                  ...(userInvite && {
                    userInvitationId: userInvite
                  }),
                  username: values?.username?.trim(),
                  ...(groupId && {
                    groupId
                  })
                }
              })
              try {
                Analytics.logEvent(LogEvents.CREATE_USERNAME, {
                  user_id: user?.id,
                  username: values?.username
                })
              } catch(err) {
                console.error('failed to log username create')
              }
              try {
                await createOnboardingTasks()
              } catch (err) {
                console.error('Error creating onboarding tasks')
              }
              
              if (firstName || lastName) {
                await updateUser({
                  variables: {
                    input: {
                      firstName,
                      lastName
                    }
                  }
                })
              }
              navigation.push('NotificationPrompt')
            } catch (err) {
              // console.log('err', err)
              setError('Username not available')
              // setError(capitalizeFirstLetter(err?.message))
            }
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            {!user?.firstName &&
            <TextInput
            style={{
              width: spacingUnit * 43,
              height: spacingUnit * 4.5,
              borderColor: Grey300,
              borderWidth: 1,
              borderRadius: 4,
              fontSize: 16,
              padding: 8,
              marginBottom: 16
            }}
            placeholder='Full name'
            placeholderTextColor={GreyPlaceHolder}
            onChangeText={handleChange('fullName')}
            onBlur={handleBlur('fullName')}
            value={values?.fullName}
          />
            }
            <TextInput
              autoCapitalize = 'none'
              style={{
                width: spacingUnit * 43,
                height: spacingUnit * 4.5,
                borderColor: Grey300,
                borderWidth: 1,
                borderRadius: 4,
                fontSize: 16,
                padding: 8,
              }}
              placeholder='Username'
              placeholderTextColor={GreyPlaceHolder}
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
            />
            <PrimaryButton
              textStyle={{ color: White }}
              style={{
                backgroundColor: Orange,
                width: spacingUnit * 43,
                alignSelf: 'center',
                marginTop: spacingUnit * 3.6 // this is not consistent with the next page on figma
              }}
              onPress={handleSubmit}
            >
              <ButtonText color={White}> Continue </ButtonText>
            </PrimaryButton>

          </View>
        )}
      </Formik>

    </View>
  )
}

function UsernameSetupScreen({
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
      <Header noGoingBack={true} />
      <View style={usernameSetupStyles.progressCircleContainer}>
        <ProgressCircle
          percent={33}
          radius={50}
          borderWidth={10}
          color={Red400}
          shadowColor={Grey300}
          bgColor={White}
        >
          <Neutral />
        </ProgressCircle>
        <View style={usernameSetupStyles.stepContainer}>
          <Text style={usernameSetupStyles.stepCount}>step 1/4</Text>
        </View>
      </View>
      <UsernameContext.Provider value={{
        error,
        setError
      }}>
        <UsernameInput navigation={navigation} />
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

export default withAuth(UsernameSetupScreen)
