import React from 'react'
import { View, StyleSheet } from 'react-native'
import * as Facebook from 'expo-facebook'

import { ButtonText } from '../Text'
import { PrimaryButton } from './Buttons'
import { SvgImage } from '../Image'
import FacebookIcon from '../../../assets/images/social-auth/facebook.tsx'
import baseStyle from './style'
import { storeAuthHeader } from '../../../components/withAuth'
import { White } from '../../../constants/Colors'
import { navigateUserOnLogin, spacingUnit } from '../../../utils/common'

const buttonStyle = StyleSheet.create({
  facebookButtonText: {
    fontFamily: 'Rubik',
    marginLeft: 8,
    fontSize: 16,
    color: White
  }
})

Facebook.initializeAsync({
  appId: '692135684870439'
})
const signInAsync = async ({ callToAction, setLoginStatus, setLoginError, navigation }) => {
  try {
    const result = await Facebook.logInWithReadPermissionsAsync()
    const {
      token,
      expirationDate,
      userId
    } = result
    if (result.type === 'success') {
      setLoginStatus('loading')
      try {
        const resp = await callToAction({
          variables: {
            input: {
              facebookAccessToken: token,
              facebookExpirationDate: expirationDate,
              facebookId: userId
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
      } catch(error) {
        console.log('Error calling login mutations', JSON.stringify(error, null, 2))
        throw Error('Failed to login to Facebook: ' + error)
      }
    }
  } catch (error) {
    console.log('Facebook sign in error', JSON.stringify(error, null, 2))
    //TODO set error!
    setLoginError(error.message)
  }
}

export const FacebookLogin = ({ style, callToAction, loginStatus, setLoginStatus, setLoginError, navigation }) => {
  return (
    <PrimaryButton style={{
      ...baseStyle.facebook,
      ...style
    }} onPress={() =>  signInAsync({ callToAction, setLoginStatus, navigation, setLoginError })}>
      <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', width: '100%'}}>
        <FacebookIcon style={{
          width: spacingUnit * 4,
          height: spacingUnit * 4,
          marginTop: -5
        }}/>
        <ButtonText style={buttonStyle.facebookButtonText} color={White}>
          Continue with Facebook
        </ButtonText>
      </View>
    </PrimaryButton>
  )
}