import React, { createContext, useContext, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, TouchableOpacity, Text, Image, SafeAreaView, Dimensions, Pressable, TextInput } from 'react-native'
import ProgressCircle from 'react-native-progress-circle'
import { Formik } from 'formik';

import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { spacingUnit } from '../../utils/common'
import { Black, Blue600, White, Blue400, Red400, Grey100, Grey200, Grey300, Grey400 } from '../../constants/Colors'
import { Subheading, RegularText, ButtonText } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import { moderateScale } from '../../utils/scale'
import { useMutation } from '@apollo/client'

const usernameSetupStyles = StyleSheet.create({
  progressCircleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    top: spacingUnit * 3,
  },
  usernameInputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  stepCount: {
    fontSize: 16,
    color: Blue400,
    fontFamily: 'Rubik',
    fontStyle: 'normal',
    fontWeight: '500',
    marginTop: spacingUnit * 2,
  },
  back: {
    position: 'absolute',
    left: "6.4%",
    right: "83.2%",
    fontFamily: 'Rubik',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    color: Blue400
  },
  skip: {
    position: 'absolute',
    left: "85.87%",
    right: "4%",
    fontFamily: 'Rubik',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    color: Blue400
  }
})



const UsernameInput = ({ navigation }) => {
  return (
    <View style={usernameSetupStyles.usernameInputContainer}>
      <Subheading style={{
        marginBottom: spacingUnit,
        marginTop: spacingUnit * 4
      }} color={Black}>
        Choose your username
      </Subheading>

      <Formik
        initialValues={{ username: '' }}
        onSubmit={values => {
          navigation.navigate('FirstProjectSetup')
          console.log(values)
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <TextInput
              style={{
                marginTop: spacingUnit * 2,
                width: spacingUnit * 43,
                height: spacingUnit * 5,
                borderColor: Grey300,
                borderWidth: 1,
                padding: 8,
                borderRadius: 4,
                fontSize: 18
              }}

              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
            />
            <PrimaryButton
              textStyle={{ color: White }}
              style={{
                width: spacingUnit * 43,
                alignSelf: 'center',
                marginTop: spacingUnit * 5
              }}
              onPress={handleSubmit}
            >
              <ButtonText color={White}> Continue  </ButtonText>
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
      flex: 1
    }}>
      <Header />
      <View style={usernameSetupStyles.progressCircleContainer}>
      <Text style={usernameSetupStyles.back}>Back</Text>
      <Text style={usernameSetupStyles.skip} >Skip</Text>
        <ProgressCircle
          percent={30}
          radius={50}
          borderWidth={10}
          color={Red400}
          shadowColor={Grey300}
          bgColor={White}
        >
        </ProgressCircle>
        <Text style={usernameSetupStyles.stepCount}>step 1/3</Text>
      </View>
      <UsernameInput navigation={navigation} />
    </SafeAreaView>
  )
}

export default UsernameSetupScreen
