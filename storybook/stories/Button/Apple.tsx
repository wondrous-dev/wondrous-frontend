import * as AppleAuthentication from 'expo-apple-authentication'
import React from 'react'
import { storeAuthHeader } from '../../../components/withAuth'
import { navigateUserOnLogin } from '../../../utils/common'
import baseStyle from './style'

export const AppleLogin = ({ style, setLoginError, navigation, setLoginStatus, callToAction  }) => {
  return (
    <AppleAuthentication.AppleAuthenticationButton
    buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
    buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
    cornerRadius={5}
    style={{
      ...baseStyle.apple,
      ...style,
    }}
    onPress={async () => {
      try {
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        })
        console.log('credential', credential)
        if (credential) {
          setLoginStatus('loading')
          try {
            const resp = await callToAction({
              variables: {
                input: {
                  appleId: credential.user,
                  firstName: credential.fullName && credential.fullName.givenName,
                  lastName: credential.fullName && credential.fullName.familyName,
                  email: credential.email,
                  appleAuthorizationCode: credential.authorizationCode
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
        // signed in
      } catch (e) {
        if (e.code === 'ERR_CANCELED') {
          // handle that the user canceled the sign-in flow
        } else {
          // handle other errors
          setLoginError('Unable to sign in with with apple: ' + e.message)
        }
      }
    }}
  />
  )
}