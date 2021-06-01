import React, { useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, SafeAreaView, ActivityIndicator, Dimensions, Pressable } from 'react-native'
import { useMutation, useQuery } from '@apollo/client'
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from '@react-native-community/google-signin'

import { RootStackParamList } from '../types'
import { Red400, White } from '../constants/Colors'
import { Title, ErrorText, RegularText, Subheading } from '../storybook/stories/Text'
import { SvgImage } from '../storybook/stories/Image'
import { GoogleLogin, FacebookLogin, EmailLogin } from '../storybook/stories/Button'
import { styles } from './HomeScreen'
import { SIGNUP } from '../graphql/mutations'
import { withAuth, useMe } from '../components/withAuth'
import { AppleLogin } from '../storybook/stories/Button/Apple'
import { spacingUnit, openLink } from '../utils/common'

const loginStyles = StyleSheet.create({
  container: styles.container
})

function SignupScreen({
  navigation,
  route
}) {
  const user = useMe()
  const [loginStatus, setLoginStatus] = useState(null)
  const [loginError, setLoginError] = useState(null)
  const [signup] = useMutation(SIGNUP)
  const login = route && route.params && route.params.login
  // if (user) {
  //   navigation.push('Welcome')
  // }
  return (
    <SafeAreaView style={styles.container}>
      <Title style={{
        color: White
      }}>
        Wonder
      </Title>
      {
        loginStatus === 'loading' && !loginError ?
          <View style={{
            marginTop: 48
          }}><ActivityIndicator /></View>
          :
          <>
            <GoogleLogin style={{
              marginTop: 48
            }} callToAction={signup} loginStatus={loginStatus} setLoginStatus={setLoginStatus} navigation={navigation} setLoginError={setLoginError} />
            {/* <FacebookLogin style={{
              marginTop: 16
            }} callToAction={signup} loginStatus={loginStatus} setLoginStatus={setLoginStatus} navigation={navigation} setLoginError={setLoginError} /> */}
            <AppleLogin style={{
            marginTop: spacingUnit * 2
          }} callToAction={signup} setLoginStatus={setLoginStatus} navigation={navigation} setLoginError={setLoginError} />
            <Pressable onPress={()=> {
              if (login) {
                navigation.push('EmailSignin')
              } else {
                navigation.push('EmailSignup')
              }
            }}>
            <Subheading style={{
              marginTop: 16,
              fontFamily: 'Rubik',
              fontSize: '16px',
              lineHeight: '19px',
              textAlign: 'center',
              textDecorationLine: 'underline'
            }} color={White}>Or continue with email</Subheading>
            </Pressable>
            {
              loginError &&
              <ErrorText style={{
                marginTop: 8
              }} color={Red400}>
                {loginError}
              </ErrorText>
            }
            <RegularText color={White} style={{
              textAlign: 'center',
              marginTop: spacingUnit * 2
            }}>
              By signing up to Wonder you are agreeing to our
              <Pressable onPress={() => openLink('https://wonderapp.co/eula-policy')}>
                <RegularText style={{
                  textDecorationLine: 'underline',
                }} color={White}>
                  terms and conditions
                </RegularText>
              </Pressable>
            </RegularText>
          </>
      }

      {/* <CardList /> */}
    </SafeAreaView>
  )
}

export default withAuth(SignupScreen, true)
