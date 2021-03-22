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
import { Black, White, Blue500, Red400, Grey100, Grey200, Grey300, GreyPlaceHolder, Orange, Grey800 } from '../../constants/Colors'
import { Subheading, RegularText, ButtonText, ErrorText, Title, } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import Neutral from '../../assets/images/emoji/neutral'
import { useMutation } from '@apollo/client'
import { EMAIL_SIGNUP } from '../../graphql/mutations'
import { useMe, withAuth } from '../../components/withAuth'
import { styles } from '../HomeScreen'
import { storeAuthHeader } from '../../components/withAuth'
import { navigateUserOnLogin } from '../../utils/common'

const SignupSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Too Short!').max(30, 'Too Long!').required('Required'),
});


function EmailSignupScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'EmailSignup'>) {
  const [loginError, setLoginError] = useState(null)
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
      await storeAuthHeader(emailSignup.token, emailSignup.user)
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
          <BackCaret color={White} />
        </Pressable>

        <Title style={{
          flex: 1,
          color: Orange
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
              autoCorrect={false}
              autoCapitalize = 'none'
              secureTextEntry={true}
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
              <ButtonText color={White}> Sign up </ButtonText>
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
              fontSize: '16px',
              lineHeight: '19px',
              textAlign: 'center',
              textDecorationLine: 'underline'
            }} color={Grey800}>Or log in with your email</Subheading>
            </Pressable>
    </SafeAreaView>
  )
}

export default EmailSignupScreen
