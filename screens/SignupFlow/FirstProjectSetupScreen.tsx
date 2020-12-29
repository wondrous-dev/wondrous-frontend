import React, { createContext, useContext, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, TouchableOpacity, Text, Image, SafeAreaView, Dimensions, Pressable, TextInput } from 'react-native'
import ProgressCircle from 'react-native-progress-circle'
import { Formik } from 'formik';

import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { spacingUnit } from '../../utils/common'
import { Black, Blue600, White, Blue400, Yellow300, Grey300, Grey500 } from '../../constants/Colors'
import { Subheading, RegularText, ButtonText, Paragraph } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import { moderateScale } from '../../utils/scale'
import { useMutation } from '@apollo/client'

const firstProjectSetupStyles = StyleSheet.create({
    progressCircleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: spacingUnit * 3,
    },
    createProjectInputContainer: {
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
    paragraph: {
        color: Grey500,
        textAlign: 'center',
        maxWidth: spacingUnit * 43,
        alignSelf: 'center',
        marginBottom: spacingUnit * 1
    },
})



const CreateProjectInput = () => {
    return (
        <View style={firstProjectSetupStyles.createProjectInputContainer}>
            <Subheading style={{
                marginBottom: spacingUnit,
                marginTop: spacingUnit * 4
            }} color={Black}>
                What is your project?
      </Subheading>
            <Paragraph style={firstProjectSetupStyles.paragraph}>
                Describe your project in one sentence
        </Paragraph>

            <Formik
                initialValues={{ projectName: '', projectDescription: '' }}
                onSubmit={values => console.log(values)}
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

                            onChangeText={handleChange('projectName')}
                            onBlur={handleBlur('projectName')}
                            value={values.projectName}
                        />
                        <TextInput
                            style={{
                                marginTop: spacingUnit * 2,
                                width: spacingUnit * 43,
                                borderColor: Grey300,
                                borderWidth: 1,
                                padding: 8,
                                borderRadius: 4,
                                fontSize: 18,
                                height: spacingUnit * 9,
                                justifyContent: "flex-start"                            
                            }}
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={handleChange('projectDescription')}
                            onBlur={handleBlur('projectDescription')}
                            value={values.projectDescription}
                        />
                        <PrimaryButton
                            textStyle={{ color: White }}
                            style={{
                                width: spacingUnit * 43,
                                alignSelf: 'center',
                                marginTop: spacingUnit * 6
                            }}
                            onPress={handleSubmit}
                        >
                            <ButtonText color={White}> Create Project  </ButtonText>
                        </PrimaryButton>

                    </View>
                )}
            </Formik>

        </View>
    )
}

function FirstProjectSetupScreen({
    navigation
}: StackScreenProps<RootStackParamList, 'FirstProjectSetup'>) {
    return (
        <SafeAreaView style={{
            backgroundColor: White,
            flex: 1
        }}>
            <Header />
            <View style={firstProjectSetupStyles.progressCircleContainer}>
                <ProgressCircle
                    percent={60}
                    radius={50}
                    borderWidth={10}
                    color={Yellow300}
                    shadowColor={Grey300}
                    bgColor={White}
                >
                </ProgressCircle>
                <Text style={firstProjectSetupStyles.stepCount}>step 1/3</Text>
            </View>
            <CreateProjectInput />
        </SafeAreaView>
    )
}

export default FirstProjectSetupScreen
