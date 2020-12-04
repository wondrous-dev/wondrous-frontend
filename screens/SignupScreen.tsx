import React , { useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, SafeAreaView, ActivityIndicator } from 'react-native'
import { useMutation } from '@apollo/client'
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from '@react-native-community/google-signin'

import { RootStackParamList } from '../types'
import { Grey200} from '../constants/Colors'
import { Title, ErrorText } from '../storybook/stories/Text'
import { SvgImage } from '../storybook/stories/Image'
import { GoogleLogin, FacebookLogin } from '../storybook/stories/Button'
import { scale, moderateScale, verticalScale } from '../utils/scale'
import { styles } from './HomeScreen'
import GoogleSvg from '../assets/images/social-auth/google.svg'
import { SIGNUP } from '../graphql/mutations'
import { withAuth, useMe } from '../components/withAuth'
import { CardList } from '../storybook/stories/CardList'

const loginStyles = StyleSheet.create({
  container: styles.container
})

function SignupScreen({
  navigation,
}) {
  const user = useMe()
  const [loginStatus, setLoginStatus] = useState(null)
  const [loginError, setLoginError] = useState(null)
  const [signup] = useMutation(SIGNUP)
  if (user) {
    navigation.navigate('Welcome')
  }
  return (
    <View style={styles.container}>
      <Title>
        Wonder
      </Title>
      {
        loginStatus === 'loading' ?
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
          {
            loginError && 
            <ErrorText style={{
              marginTop: 8
            }}>
              {loginError}
            </ErrorText>
          }
        </>
      }

      <CardList />
    </View>
  )
}

export default withAuth(SignupScreen)
