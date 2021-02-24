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
import { navigateUserOnLogin } from '../../../utils/common'

const buttonStyle = StyleSheet.create({
  googleButtonText: {
    fontFamily: 'Rubik',
    marginLeft: 8,
    fontSize: 16
  }
})


export const EmailLogin = ({ style }) => {
  return (
    <SecondaryButton style={{
      ...baseStyle.emailLogin,
      ...style
      }} onPress={() => console.log("hi") }>
      <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', width: '100%'}}>
        <ButtonText style={buttonStyle.googleButtonText} color={Grey200}>
          Continue with email
        </ButtonText>
      </View>
    </SecondaryButton>
  )
}
