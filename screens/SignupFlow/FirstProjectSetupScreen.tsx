import React, { createContext, useContext, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, TouchableOpacity, Text, Image, SafeAreaView, Dimensions, Pressable, TextInput } from 'react-native'
import ProgressCircle from 'react-native-progress-circle'
import { Formik } from 'formik';

import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { spacingUnit } from '../../utils/common'
import { Black, Grey900, White, Blue500, Yellow300, Grey300, Grey500, GreyPlaceHolder } from '../../constants/Colors'
import { Subheading, RegularText, ButtonText, Paragraph } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import { moderateScale } from '../../utils/scale'
import { useMutation } from '@apollo/client'

const firstProjectSetupStyles = StyleSheet.create({
    stepContainer: {
        marginTop: spacingUnit * 3,
    },
    progressCircleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: spacingUnit * 3,
    },
    createProjectInputContainer: {
        marginTop: spacingUnit * 3,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    stepCount: {
        fontSize: 16,
        color: Blue500,
        fontFamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '500',
    },
    paragraph: {
        marginTop: spacingUnit,
        color: Grey500,
        textAlign: 'center',
        maxWidth: spacingUnit * 43,
        alignSelf: 'center',
        marginBottom: spacingUnit * 3
    },
})

import { TouchableWithoutFeedback, Keyboard } from 'react-native'

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);





const CreateProjectInput = ({ navigation }) => {
    return (
        <View style={firstProjectSetupStyles.createProjectInputContainer}>
            <Subheading style={{
            }} color={Black}>
                What is your project?
        </Subheading>
            <Paragraph style={firstProjectSetupStyles.paragraph}>
                Describe your project in one sentence
        </Paragraph>

            <Formik
                initialValues={{ projectName: '', projectDescription: '' }}
                onSubmit={values => {
                    navigation.navigate('ProjectTagSelection')
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
                                padding: 8
                            }}
                            placeholder='Name'
                            placeholderTextColor={GreyPlaceHolder}
                            onChangeText={handleChange('projectName')}
                            onBlur={handleBlur('projectName')}
                            value={values.projectName}
                        />
                        <TextInput
                            style={{
                                marginTop: spacingUnit * 1.5,
                                width: spacingUnit * 43,
                                borderColor: Grey300,
                                borderWidth: 1,
                                borderRadius: 4,
                                fontSize: 14,
                                height: spacingUnit * 9.5,
                                padding: 8,
                                justifyContent: "flex-start"
                            }}
                            placeholder='E.g. A platform where brands can reward users for ideas and feedback related to their products.'
                            placeholderTextColor={GreyPlaceHolder}
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
                                marginTop: spacingUnit * 5.75
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
            <DismissKeyboard>
                <View>
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
                        <View style={firstProjectSetupStyles.stepContainer}>
                            <Text style={firstProjectSetupStyles.stepCount}>step 2/3</Text>
                        </View>
                    </View>
                    <CreateProjectInput navigation={navigation} />
                </View>
            </DismissKeyboard>

        </SafeAreaView>
    )
}

export default FirstProjectSetupScreen
