import React from 'react'
import { View, StyleSheet } from 'react-native'
import * as Google from 'expo-google-app-auth'
import { useMutation } from '@apollo/client'

import { ButtonText } from '../Text'
import { SecondaryButton } from './index'
import { SvgImage } from '../Image'
import GoogleSvg from '../../../assets/images/social-auth/google.svg'
import baseStyle from './style'
import { Grey200 } from '../../../constants/Colors'
import { SIGNUP } from '../../../graphql/mutations'
import { storeAuthHeader } from '../../../components/withAuth'

const buttonStyle = StyleSheet.create({
  googleButtonText: {
    fontFamily: 'Rubik',
    marginLeft: 8,
    fontSize: 16
  }
})

const signInAsync = async ({ graphqlCall, setLoginStatus, navigation }) => {
  try {
    const result = await Google.logInAsync({
      androidClientId: '276263235787-b3j16n95sv6c6u7tdfi6mhs9mjdgh55e.apps.googleusercontent.com',
      iosClientId: '276263235787-drii7vkaaflaql1vr7hvgc343igtlfud.apps.googleusercontent.com',
      scopes: ['profile', 'email', 'https://www.googleapis.com/auth/contacts.readonly'],
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
          navigation.navigate('Welcome')
        }
      } catch (error) {
        console.log('Error calling login mutations', JSON.stringify(error, null, 2))
      }
    } else {
      return { cancelled: true }
    }
  } catch (e) {
    return { error: true }
  }
}

export const GoogleLogin = ({ style, callToAction, loginStatus, setLoginStatus, navigation }) => {
  // TODO: set up separate procedure for web (awaiting issue clearance for https://github.com/expo/expo/issues/11061)
  return (
    <SecondaryButton style={{
      ...baseStyle.google,
      ...style
      }} onPress={() => signInAsync({ graphqlCall: callToAction, setLoginStatus, navigation }) }>
      <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', width: '100%'}}>
        <SvgImage width="32" height="32" srcElement={GoogleSvg} />
        <ButtonText style={buttonStyle.googleButtonText} color={Grey200}>
          Continue with Google
        </ButtonText>
      </View>
    </SecondaryButton>
  )
}
