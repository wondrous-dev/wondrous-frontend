import React from 'react'
import { View, StyleSheet } from 'react-native'

import { ButtonText } from '../Text'
import { SecondaryButton } from './Buttons'
import baseStyle from './style'
import palette from 'theme/palette'

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
        <ButtonText style={buttonStyle.googleButtonText} color={palette.grey200}>
          Continue with email
        </ButtonText>
      </View>
    </SecondaryButton>
  )
}
