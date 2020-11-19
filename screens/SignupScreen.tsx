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
import { Title, Subheading, Paragraph, ButtonText } from '../storybook/stories/Text'
import { SvgImage } from '../storybook/stories/Image'
import { GoogleLogin } from '../storybook/stories/Button'
import { scale, moderateScale, verticalScale } from '../utils/scale'
import { styles } from './HomeScreen'
import GoogleSvg from '../assets/images/social-auth/google.svg'
import { SIGNUP } from '../graphql/mutations'
import { withAuth, useMe } from '../components/withAuth'

const loginStyles = StyleSheet.create({
  container: styles.container
})

function SignupScreen({
  navigation,
}) {
  const user = useMe()
  const [loginStatus, setLoginStatus] = useState(null)
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
        <ActivityIndicator />
        :
        <>
                <GoogleLogin style={{
        marginTop: 48
      }} callToAction={signup} loginStatus={loginStatus} setLoginStatus={setLoginStatus} navigation={navigation} />
        </>
      }

    </View>
  )
}

export default withAuth(SignupScreen)
