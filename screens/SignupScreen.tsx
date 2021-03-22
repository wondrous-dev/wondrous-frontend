import React, { useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, SafeAreaView, ActivityIndicator, Dimensions, Pressable } from 'react-native'
import { useMutation } from '@apollo/client'
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from '@react-native-community/google-signin'

import { RootStackParamList } from '../types'
import { Black, Orange, Red400, White } from '../constants/Colors'
import { Title, ErrorText, RegularText, Subheading } from '../storybook/stories/Text'
import { SvgImage } from '../storybook/stories/Image'
import { GoogleLogin, FacebookLogin, EmailLogin } from '../storybook/stories/Button'
import { scale, moderateScale, verticalScale } from '../utils/scale'
import { styles } from './HomeScreen'
import GoogleSvg from '../assets/images/social-auth/google.svg'
import { SIGNUP } from '../graphql/mutations'
import { withAuth, useMe } from '../components/withAuth'
import { CardList } from '../storybook/stories/CardList'
import { AppleLogin } from '../storybook/stories/Button/Apple'
import { spacingUnit } from '../utils/common'

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
  // if (user) {
  //   navigation.navigate('Welcome')
  // }
  return (
    <SafeAreaView style={styles.container}>
      <Title style={{
        color: Orange
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
            <FacebookLogin style={{
              marginTop: 16
            }} callToAction={signup} loginStatus={loginStatus} setLoginStatus={setLoginStatus} navigation={navigation} setLoginError={setLoginError} />
            <AppleLogin style={{
            marginTop: spacingUnit * 2
          }} callToAction={signup} setLoginStatus={setLoginStatus} navigation={navigation} setLoginError={setLoginError} />
            <Pressable onPress={()=> {
              if (route && route.params && route.params.login) {
                navigation.navigate('EmailSignin')
              } else {
                navigation.navigate('EmailSignup')
              }
            }}>
            <Subheading style={{
              marginTop: 16,
              fontFamily: 'Rubik',
              fontSize: '16px',
              lineHeight: '19px',
              textAlign: 'center',
              textDecorationLine: 'underline'
            }} color={Black}>Or continue with email</Subheading>
            </Pressable>
            {
              loginError &&
              <ErrorText style={{
                marginTop: 8
              }} color={Red400}>
                {loginError}
              </ErrorText>
            }
          </>
      }

      {/* <CardList /> */}
    </SafeAreaView>
  )
}

export default withAuth(SignupScreen, true)
