import React, { createContext, useContext, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, TouchableOpacity, Text, Image, SafeAreaView, Dimensions, Pressable, TextInput } from 'react-native'
import ProgressCircle from 'react-native-progress-circle'
import { Formik } from 'formik';
import * as Yup from 'yup';

import { RootStackParamList } from '../../types'
import BackCaret from '../../assets/images/back-caret'
import { Header } from '../../components/Header'
import { spacingUnit } from '../../utils/common'
import { Black, White, Blue500, Red400, Grey100, Grey200, Grey300, GreyPlaceHolder } from '../../constants/Colors'
import { Subheading, RegularText, ButtonText, ErrorText, Title, } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import Neutral from '../../assets/images/emoji/neutral'
import { useMutation } from '@apollo/client'
import { EMAIL_SIGNIN } from '../../graphql/mutations'
import { useMe, withAuth } from '../../components/withAuth'
import { styles } from '../HomeScreen'
import { storeAuthHeader } from '../../components/withAuth'
import { navigateUserOnLogin } from '../../utils/common'

const SigninSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
});


function EmailSigninScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'EmailSignin'>) {
  const [loginError, setLoginError] = useState(null)
  const [emailSignin] = useMutation(EMAIL_SIGNIN, {
  })
  const handleSignin = async (email, password) => {
  try{
    const resp = await emailSignin({
      variables: {
        input: {
          email,
          password,
        }
      }
    })
    if (resp.data) {
      const { emailSignin } = resp.data
      await storeAuthHeader(emailSignin.token, emailSignin.user)
      if (emailSignin.user) {
        navigateUserOnLogin(emailSignin.user, navigation)
      }
    }
  } catch (error) {
    if (error.graphQLErrors && error.graphQLErrors.length>0  && error.graphQLErrors[0].extensions.message =='USERNAME_OR_PASSOWRD_NOT_MATCH') {
      setLoginError('Email and password do not match')
    } else {
      setLoginError('Some unknown error')
    }
  }

  }

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => {
        navigation.goBack()
      }} style={{
        width: 50,
      }}>
        <BackCaret />
      </Pressable>

      <Title>
        Wonder
      </Title>
      <Formik
        initialValues={{ email: '', password:'' }}
        validationSchema={SigninSchema}
        onSubmit={async values => {
          handleSignin(values.email, values.password)
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
                borderColor: Grey300,
                borderWidth: 1,
                borderRadius: 4,
                fontSize: 18,
                padding: 8,
                backgroundColor: White
              }}
              placeholder='Email'
              placeholderTextColor={GreyPlaceHolder}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {errors.email && touched.email ? (
             <RegularText color={Red400}>{errors.email}</RegularText>
           ) : null}
            <TextInput
              secureTextEntry={true}
              autoCorrect={false}
              autoCapitalize = 'none'
              style={{
                marginTop: spacingUnit*2,
                width: spacingUnit * 43,
                height: spacingUnit * 5.5,
                borderColor: Grey300,
                borderWidth: 1,
                borderRadius: 4,
                fontSize: 18,
                padding: 8,
                backgroundColor: White
              }}
              placeholder='Password'
              placeholderTextColor={GreyPlaceHolder}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {errors.password && touched.password ? (
             <RegularText color={Red400}>{errors.password}</RegularText>
           ) : null}
            <PrimaryButton
              textStyle={{ color: White }}
              style={{
                width: spacingUnit * 43,
                alignSelf: 'center',
                marginTop: spacingUnit * 3.6 // this is not consistent with the next page on figma
              }}
              onPress={handleSubmit}
            >
              <ButtonText color={White}> Login </ButtonText>
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

      <Pressable onPress={()=> {navigation.navigate('EmailSignup')}}>
            <Subheading style={{
              marginTop: 16,
              fontFamily: 'Rubik',
              fontSize: '16px',
              lineHeight: '19px',
              textAlign: 'center',
              textDecorationLine: 'underline'
            }} >Or create an account with email</Subheading>
            </Pressable>
    </SafeAreaView>
  )
}

export default EmailSigninScreen
