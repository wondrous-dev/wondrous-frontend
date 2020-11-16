import React , { useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, SafeAreaView } from 'react-native'
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from '@react-native-community/google-signin'

import { RootStackParamList } from '../types'
import { Grey200} from '../constants/Colors'
import { Title, Subheading, Paragraph, ButtonText } from '../storybook/stories/Text'
import { SvgImage } from '../storybook/stories/Image'
import { GoogleLogin } from '../storybook/stories/Button'
import { scale, moderateScale, verticalScale } from '../utils/scale'
import { styles } from './HomeScreen'
import GoogleSvg from '../assets/images/social-auth/google.svg'

const loginStyles = StyleSheet.create({
  container: styles.container
})

export default function SignupScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'Signup'>) {
  const [loginStatus, setLoginStatus] = useState(null)
  return (
    <View style={styles.container}>
      <Title>
        Wonder
      </Title>
      <GoogleLogin style={{
        marginTop: 48
      }} loginStatus={loginStatus} setLoginStatus={setLoginStatus} />
    </View>
  )
}