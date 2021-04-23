import React from 'react'
import { View, StyleSheet } from 'react-native'
import * as Google from 'expo-google-app-auth'

import { ButtonText } from '../Text'
import { SecondaryButton } from './Buttons'
import { SvgImage } from '../Image'
import GoogleSvg from '../../../assets/images/social-auth/google'
import baseStyle from './style'
import { Grey200 } from '../../../constants/Colors'
import { storeAuthHeader } from '../../../components/withAuth'
import { navigateUserOnLogin, spacingUnit } from '../../../utils/common'

const buttonStyle = StyleSheet.create({
  googleButtonText: {
    fontFamily: 'Arial',
    fontWeight: '500',
    marginLeft: 8,
    fontSize: 18
  }
})

const signInAsync = async ({ graphqlCall, setLoginStatus, setLoginError, navigation }) => {
  try {
    const result = await Google.logInAsync({
      androidClientId: 'com.googleusercontent.apps.276263235787-b3j16n95sv6c6u7tdfi6mhs9mjdgh55e',
      iosClientId: 'com.googleusercontent.apps.276263235787-drii7vkaaflaql1vr7hvgc343igtlfud',
      iosStandaloneAppClientId: 'com.googleusercontent.apps.276263235787-gc3g6ilmol63fvobrre6mmd79ou2ulku',
      androidStandaloneAppClientId: 'com.googleusercontent.apps.276263235787-03pv0e4ndk9t67t1chhut8i3mb339s9a',
      scopes: ['profile', 'email'],
    });
    if (result.type === 'success') {
      try {
        setLoginStatus('loading')
        const resp = await graphqlCall({
          variables: {
            input: {
              email: result.user.email,
              googleIdToken: result.idToken,
              googleAccessToken: result.accessToken,
              googleRefreshToken: result.refreshToken,
              googleId: result.user.id
            }
          }
        })
        if (resp.data) {
          const { signup } = resp.data
          await storeAuthHeader(signup.token, signup.user)
          if (signup.user) {
            navigateUserOnLogin(signup.user, navigation)
            setLoginStatus(null)
          }
        }
      } catch (error) {
        console.log('Error calling login mutations', JSON.stringify(error, null, 2))
        throw Error('Failed to login to Google: ' + error)
      }
    } else {
      return { cancelled: true }
    }
  } catch (e) {
    setLoginError(e.message)
    return { error: true }
  }
}

export const GoogleLogin = ({ style, callToAction, loginStatus, setLoginStatus, setLoginError, navigation }) => {
  // TODO: set up separate procedure for web (awaiting issue clearance for https://github.com/expo/expo/issues/11061)
  return (
    <SecondaryButton style={{
      ...baseStyle.google,
      ...style
      }} onPress={() => signInAsync({ graphqlCall: callToAction, setLoginStatus, setLoginError, navigation }) }>
      <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', width: '100%'}}>
        <GoogleSvg style={{
          width: spacingUnit * 3,
          height: spacingUnit * 3
        }} />
        <ButtonText style={buttonStyle.googleButtonText} color={Grey200}>
          Continue with Google{`     `}
        </ButtonText>
      </View>
    </SecondaryButton>
  )
}
