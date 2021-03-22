import React, { createContext, useContext, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, TouchableOpacity, Text, Image, SafeAreaView, Dimensions, Pressable, TextInput } from 'react-native'
import ProgressCircle from 'react-native-progress-circle'
import { Formik } from 'formik';


import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { spacingUnit, extractFirstAndLastName } from '../../utils/common'
import { Black, White, Blue500, Red400, Grey100, Grey200, Grey300, GreyPlaceHolder } from '../../constants/Colors'
import { Subheading, RegularText, ButtonText, ErrorText } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import Neutral from '../../assets/images/emoji/neutral'
import { useMutation } from '@apollo/client'
import { UPDATE_USER } from '../../graphql/mutations'
import { useMe, withAuth } from '../../components/withAuth'
const UsernameContext = createContext(null)

const usernameSetupStyles = StyleSheet.create({
  stepContainer: {
    marginTop: spacingUnit * 3,
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
    marginTop: spacingUnit * 3,
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
      navigation.push('FirstProjectSetup', {
        setup: true
      })
    }
  }, [])
  return (
    <View style={usernameSetupStyles.usernameInputContainer}>
      <Subheading style={{
        marginBottom: spacingUnit * 3,
      }} color={Black}>
        {
          user.firstName ?
          'Choose your username'
          :
          'Set names'
        }
      </Subheading>
      <Formik
        initialValues={{ username: user && user.username, fullName: '', }}
        onSubmit={async values => {
          if (!user.firstName && !values.fullName && !values.fullName.trim()) {
            setError('Please enter a name')
          }  else if (!values.username) {
            setError('Please enter a shortname')
          } else {
            const {
              firstName,
              lastName 
            } = extractFirstAndLastName(values.fullName)

            await updateUser({
              variables: {
                input: {
                  username: values.username,
                  firstName,
                  lastName
                }
              }
            })
            navigation.push('FirstProjectSetup')
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            {!user.firstName &&
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
            value={values.fullName}
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
      <Header />
      <View style={usernameSetupStyles.progressCircleContainer}>
        <ProgressCircle
          percent={25}
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
        {
          error && <View style={{
            alignItems: 'center'
          }}>
            <ErrorText>
              {error}
            </ErrorText>
          </View>
        }
      <UsernameContext.Provider value={{
        error,
        setError
      }}>
        <UsernameInput navigation={navigation} />
      </UsernameContext.Provider>
    </SafeAreaView>
  )
}

export default withAuth(UsernameSetupScreen)
