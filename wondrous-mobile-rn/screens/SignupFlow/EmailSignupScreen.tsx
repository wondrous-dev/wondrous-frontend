import React, { useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { View, SafeAreaView, Pressable, TextInput } from 'react-native'
import { Formik } from 'formik';
import * as Yup from 'yup';

import { RootStackParamList } from '../../types'
import BackCaret from '../../assets/images/back-caret'
import { spacingUnit } from '../../utils/common'
import palette from 'theme/palette'
import { Subheading, RegularText, ButtonText, ErrorText, Title, } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import { useMutation } from '@apollo/client'
import { EMAIL_SIGNUP } from '../../graphql/mutations'
import { styles } from '../HomeScreen'
import { useAuth } from '../../session'
import { navigateUserOnLogin, openLink } from '../../utils/common'

const SignupSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Too Short!').max(30, 'Too Long!').required('Required'),
});


function EmailSignupScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'EmailSignup'>) {
  const [loginError, setLoginError] = useState(null)

  const { saveSession } = useAuth()

  const [emailSignup] = useMutation(EMAIL_SIGNUP, {
  })
  const handleSignup = async (email, password) => {
  try{
    const resp = await emailSignup({
      variables: {
        input: {
          email,
          password,
        }
      }
    })
    if (resp.data) {
      const { emailSignup } = resp.data
      await saveSession(emailSignup.token, emailSignup.user)
      if (emailSignup.user) {
        navigateUserOnLogin(emailSignup.user, navigation)
      }
    }
  } catch (error) {
    if (error.graphQLErrors && error.graphQLErrors.length>0  && error.graphQLErrors[0].extensions.message =='USER_ALREADY_EXIST') {
      setLoginError('User already exist')
    } else {
      setLoginError('Some unknown error')
    }
  }

  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
        <Pressable style={{
          flex: 1
        }} onPress={() => {
          navigation.goBack()
        }}>
          <BackCaret color={palette.white} />
        </Pressable>

        <Title style={{
          flex: 1,
          color: palette.white
        }}>
          Wonder
        </Title>
        <View style={{
          flex: 1
        }}/>
      </View>
      <Formik
        initialValues={{ email: '', password:'' }}
        validationSchema={SignupSchema}
        onSubmit={async values => {
          handleSignup(values.email, values.password)
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
          <View>
            <TextInput
              keyboardType='email-address'
              // autoCorrect={false}
              autoCapitalize = 'none'
              style={{
                marginTop: spacingUnit*2,
                width: spacingUnit * 43,
                height: spacingUnit * 5.5,
                borderColor: palette.grey300,
                borderWidth: 1,
                borderRadius: 4,
                fontSize: 18,
                padding: 8,
                backgroundColor: palette.white
              }}
              placeholder='Email'
              placeholderTextColor={palette.grey35}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {errors.email && touched.email ? (
             <RegularText color={palette.red400}>{errors.email}</RegularText>
           ) : null}
            <TextInput
              autoCorrect={false}
              autoCapitalize = 'none'
              secureTextEntry={true}
              style={{
                marginTop: spacingUnit*2,
                width: spacingUnit * 43,
                height: spacingUnit * 5.5,
                borderColor: palette.grey300,
                borderWidth: 1,
                borderRadius: 4,
                fontSize: 18,
                padding: 8,
                backgroundColor: palette.white
              }}
              placeholder='Password'
              placeholderTextColor={palette.grey35}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {errors.password && touched.password ? (
             <RegularText color={palette.red400}>{errors.password}</RegularText>
           ) : null}
            <PrimaryButton
              textStyle={{ color: palette.white }}
              style={{
                width: spacingUnit * 43,
                alignSelf: 'center',
                marginTop: spacingUnit * 3.6 // this is not consistent with the next page on figma
              }}
              onPress={handleSubmit}
            >
              <ButtonText color={palette.white}> Sign up </ButtonText>
            </PrimaryButton>

          </View>
        )}
      </Formik>
      {
          loginError && <View style={{
            alignItems: 'center'
          }}>
            <ErrorText>
              {loginError}
            </ErrorText>
          </View>
        }
              <Pressable onPress={()=> {navigation.push('EmailSignin')}}>
            <Subheading style={{
              marginTop: 16,
              fontFamily: 'Rubik',
              fontSize: 16,
              lineHeight: 19,
              textAlign: 'center',
              textDecorationLine: 'underline'
            }} color={palette.white}>Or log in with your email</Subheading>
            </Pressable>
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
    </SafeAreaView>
  )
}

export default EmailSignupScreen
