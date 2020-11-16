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

const buttonStyle = StyleSheet.create({
  googleButtonText: {
    fontFamily: 'Rubik',
    marginLeft: 8,
    fontSize: 16
  }
})

const signInAsync = async (graphqlCall) => {
  try {
    const result = await Google.logInAsync({
      androidClientId: '276263235787-b3j16n95sv6c6u7tdfi6mhs9mjdgh55e.apps.googleusercontent.com',
      iosClientId: '276263235787-drii7vkaaflaql1vr7hvgc343igtlfud.apps.googleusercontent.com',
      scopes: ['profile', 'email', 'https://www.googleapis.com/auth/contacts.readonly'],
    });
    console.log('result', result)
    if (result.type === 'success') {
      try {
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
        console.log('resp', resp)
      } catch (e) {
        console.log('error', e)
      }
    } else {
      return { cancelled: true }
    }
  } catch (e) {
    return { error: true }
  }
}

export const GoogleLogin = ({ style }) => {
  // TODO take sign up query logic out
  const [signup] = useMutation(SIGNUP)

  return (
    <SecondaryButton style={{
      ...baseStyle.google,
      ...style
      }} onPress={() => signInAsync(signup) }>
      <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', width: '100%'}}>
        <SvgImage width="32" height="32" srcElement={GoogleSvg} />
        <ButtonText style={buttonStyle.googleButtonText} color={Grey200}>
          Continue with Google
        </ButtonText>
      </View>
    </SecondaryButton>
  )
}
