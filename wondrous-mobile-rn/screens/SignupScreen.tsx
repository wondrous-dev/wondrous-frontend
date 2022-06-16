import React, { useState } from 'react'
import { View, SafeAreaView, ActivityIndicator, Pressable } from 'react-native'
import { useMutation } from '@apollo/client'

import palette from 'theme/palette'
import { Title, ErrorText, RegularText, Subheading } from '../storybook/stories/Text'
import { GoogleLogin } from '../storybook/stories/Button'
import { styles } from './HomeScreen'
import { SIGNUP } from '../graphql/mutations'
import { withAuth } from '../components/withAuth'
import { AppleLogin } from '../storybook/stories/Button/Apple'
import { spacingUnit, openLink } from '../utils/common'


function SignupScreen({
  navigation,
  route
}) {
  const [loginStatus, setLoginStatus] = useState(null)
  const [loginError, setLoginError] = useState(null)
  const [signup] = useMutation(SIGNUP)
  const login = route && route.params && route.params.login
 
  return (
    <SafeAreaView style={styles.container}>
      <Title style={{
        color: palette.white
      }}>
        Wonder
      </Title>
      {
        loginStatus === 'loading' && !loginError ?
          <View style={{
            marginTop: 48
          }}><ActivityIndicator /></View>
          :
          <>
            <GoogleLogin style={{
              marginTop: 48
            }} callToAction={signup} loginStatus={loginStatus} setLoginStatus={setLoginStatus} navigation={navigation} setLoginError={setLoginError} />
            <AppleLogin style={{
            marginTop: spacingUnit * 2
          }} callToAction={signup} setLoginStatus={setLoginStatus} navigation={navigation} setLoginError={setLoginError} />
            <Pressable onPress={()=> {
              if (login) {
                navigation.push('EmailSignin')
              } else {
                navigation.push('EmailSignup')
              }
            }}>
            <Subheading style={{
              marginTop: 16,
              fontFamily: 'Rubik',
              fontSize: 16,
              lineHeight: 19,
              textAlign: 'center',
              textDecorationLine: 'underline'
            }} color={palette.white}>Or continue with email</Subheading>
            </Pressable>
            {
              loginError &&
              <ErrorText style={{
                marginTop: 8
              }} color={palette.red400}>
                {loginError}
              </ErrorText>
            }
            <RegularText color={palette.white} style={{
              textAlign: 'center',
              position: 'absolute',
              bottom: spacingUnit * 5
            }}>
              By signing up to Wonder you are agreeing to our
              <Pressable onPress={() => openLink('https://wonderapp.co/eula-policy')}>
                <RegularText style={{
                  textDecorationLine: 'underline',
                }} color={palette.white}>
                  terms and conditions
                </RegularText>
              </Pressable>
            </RegularText>
          </>
      }

      {/* <CardList /> */}
    </SafeAreaView>
  )
}

export default withAuth(SignupScreen, true)
