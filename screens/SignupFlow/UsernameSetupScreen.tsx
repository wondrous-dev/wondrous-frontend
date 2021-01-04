import React, { createContext, useContext, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, TouchableOpacity, Text, Image, SafeAreaView, Dimensions, Pressable, TextInput } from 'react-native'
import ProgressCircle from 'react-native-progress-circle'
import { Formik } from 'formik';


import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { spacingUnit } from '../../utils/common'
import { Black, White, Blue500, Red400, Grey100, Grey200, Grey300, GreyPlaceHolder } from '../../constants/Colors'
import { Subheading, RegularText, ButtonText } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import { moderateScale } from '../../utils/scale'
import { useMutation } from '@apollo/client'
import { UPDATE_USER } from '../../graphql/mutations'
import { useMe } from '../../components/withAuth'
const usernameSetupStyles = StyleSheet.create({
  stepContainer: {
    marginTop: spacingUnit * 3,
  },
  progressCircleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: spacingUnit * 3,
  },
  usernameInputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: spacingUnit * 3,
  },
  stepCount: {
    fontSize: 16,
    color: Blue500,
    fontFamily: 'Rubik',
    fontStyle: 'normal',
    fontWeight: '500',
  },
})



const UsernameInput = ({ navigation }) => {
  const [updateUser] = useMutation(UPDATE_USER)
  const user: any = useMe()
  return (
    <View style={usernameSetupStyles.usernameInputContainer}>
      <Subheading style={{
        marginBottom: spacingUnit * 3,
      }} color={Black}>
        Choose your username
      </Subheading>

      <Formik
        initialValues={{ username: '' }}
        onSubmit={async values => {
          // await updateUser({
          //   variables: {
          //     userId: user.id,
          //     input: {
          //       username: values.username
          //     }
          //   }
          // })
          navigation.navigate('FirstProjectSetup')
          console.log(values)
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <TextInput
              style={{
                width: spacingUnit * 43,
                height: spacingUnit * 4.5,
                borderColor: Grey300,
                borderWidth: 1,
                borderRadius: 4,
                fontSize: 14,
                padding: 8,
              }}
              placeholder='Username'
              placeholderTextColor={GreyPlaceHolder}
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
            />
            <PrimaryButton
              textStyle={{ color: White }}
              style={{
                width: spacingUnit * 43,
                alignSelf: 'center',
                marginTop: spacingUnit * 3.6 // this is not consistent with the next page on figma
              }}
              onPress={handleSubmit}
            >
              <ButtonText color={White}> Continue </ButtonText>
            </PrimaryButton>

          </View>
        )}
      </Formik>

    </View>
  )
}

function UsernameSetupScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'UsernameSetup'>) {
  return (
    <SafeAreaView style={{
      backgroundColor: White,
      flex: 1,
    }}>
      <Header />
      <View style={usernameSetupStyles.progressCircleContainer}>
        <ProgressCircle
          percent={30}
          radius={50}
          borderWidth={10}
          color={Red400}
          shadowColor={Grey300}
          bgColor={White}
        >
        </ProgressCircle>
        <View style={usernameSetupStyles.stepContainer}>
          <Text style={usernameSetupStyles.stepCount}>step 1/3</Text>
        </View>
      </View>

      <UsernameInput navigation={navigation} />
    </SafeAreaView>
  )
}

export default UsernameSetupScreen
