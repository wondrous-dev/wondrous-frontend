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
import { palette.black, White, palette.blue500, palette.red400, Grey100, Grey200, palette.grey300, GreyPlaceHolder, palette.orange, palette.grey800 } from '../../constants/Colors'
import { Subheading, RegularText, ButtonText, ErrorText, Title, } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import Neutral from '../../assets/images/emoji/neutral'
import { useMutation } from '@apollo/client'
import { EMAIL_SIGNIN } from '../../graphql/mutations'
import { useMe, withAuth } from '../../components/withAuth'
import { styles } from '../HomeScreen'
import { useAuth } from '../../session'
import { navigateUserOnLogin } from '../../utils/common'

const SigninSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
});


function EmailSigninScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'EmailSignin'>) {
  const [loginError, setLoginError] = useState(null)

  const { saveSession } = useAuth()

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
      await saveSession(emailSignin.token, emailSignin.user)
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
          color: palette.orange
        }}>
          Wonder
        </Title>
        <View style={{
          flex: 1
        }}/>
      </View>
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
                borderColor: palette.grey300,
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
             <RegularText color={palette.red400}>{errors.email}</RegularText>
           ) : null}
            <TextInput
              secureTextEntry={true}
              autoCorrect={false}
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
                backgroundColor: White
              }}
              placeholder='Password'
              placeholderTextColor={GreyPlaceHolder}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {errors.password && touched.password ? (
             <RegularText color={palette.red400}>{errors.password}</RegularText>
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

      <Pressable onPress={()=> {navigation.push('EmailSignup')}}>
            <Subheading style={{
              marginTop: 16,
              fontFamily: 'Rubik',
              fontSize: 16,
              lineHeight: 19,
              textAlign: 'center',
              textDecorationLine: 'underline'
            }} color={palette.grey800}>Or create an account with email</Subheading>
            </Pressable>
    </SafeAreaView>
  )
}

export default EmailSigninScreen
