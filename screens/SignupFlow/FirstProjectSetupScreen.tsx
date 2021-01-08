import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, TouchableOpacity, Text, Image, SafeAreaView, Dimensions, Pressable, TextInput } from 'react-native'
import ProgressCircle from 'react-native-progress-circle'
import { Formik } from 'formik';
import { useMutation } from '@apollo/client'
import { TouchableWithoutFeedback, Keyboard } from 'react-native'

import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { spacingUnit } from '../../utils/common'
import { Black, Grey900, White, Blue500, Yellow300, Grey300, Grey500, GreyPlaceHolder } from '../../constants/Colors'
import { Subheading, RegularText, ButtonText, Paragraph } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import Smile from '../../assets/images/emoji/smile'
import { withAuth, useMe } from '../../components/withAuth'
import { CREATE_PROJECT, UPDATE_PROJECT } from '../../graphql/mutations/project'
import { GET_PROJECT_BY_ID } from '../../graphql/queries/project'
import apollo from '../../services/apollo'

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

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);





const CreateProjectInput = ({ navigation }) => {
    const user = useMe()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [createProject] = useMutation(CREATE_PROJECT, {
        update(cache, { data: { createProject }}) {
            cache.modify({
                fields: {
                    users(existingUser) {
                        const newUser = {...existingUser}
                        newUser['usageProgress'] = newUser['usageProgress'] ? {
                            ...newUser['usageProgress'],
                            projectCreated: createProject.id
                        } : {
                            projectCreated: createProject.id
                        }
                        return [newUser]
                    }
                }
            })
        }
    })
    const [updateProject] = useMutation(UPDATE_PROJECT)
    const fillInitialProject = useCallback(async () => {
        if (user && user.usageProgress && user.usageProgress.projectCreated) {
            const result = await apollo.query({
                query: GET_PROJECT_BY_ID,
                variables: {
                    projectId: user.usageProgress.projectCreated
                }
            })
            const project = result.data && result.data.getProjectById
            setName(project && project.name)
            setDescription(project && project.description)
        }
    }, [])
    useEffect(() => {
        fillInitialProject()
    }, [])
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
                initialValues={{ projectName: name, projectDescription: description }}
                onSubmit={async values => {
                    try {
                        if (user && user.usageProgress && user.usageProgress.projectCreated) {
                            const projectId = user.usageProgress.projectCreated
                            await updateProject({
                                variables: {
                                    input: {
                                        name,
                                        description
                                    },
                                    projectId
                                }
                            })
                            navigation.navigate('ProjectSetupCategory', {
                                projectId: user.usageProgress.projectCreated
                            })
                        } else {
                            const projectData = await createProject({
                                variables: {
                                    input: {
                                        name,
                                        description
                                    },
                                    firstTime: true
                                }
                            })
                            navigation.navigate('ProjectSetupCategory', {
                                projectId: projectData.data.createProject && projectData.data.createProject.id
                            })
                        }
                    } catch (error) {
                        console.log("error creating project", JSON.stringify(error, null, 2))
                    }
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
                            onChangeText={(val) => {
                                setName(val)
                            }}
                            onBlur={handleBlur('projectName')}
                            value={name}
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
                            onChangeText={(val) => {
                                setDescription(val)
                            }}
                            onBlur={handleBlur('projectDescription')}
                            value={description}
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
    const user = useMe()
    // useEffect(() => {
    //     if (user && user.usageProgress && user.usageProgress.projectCreated) {
    //         navigation.navigate('ProjectSetupCategory', {
    //             projectId: user.usageProgress.projectCreated
    //         })
    //     }
    // }, [])

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
                            percent={50}
                            radius={50}
                            borderWidth={10}
                            color={Yellow300}
                            shadowColor={Grey300}
                            bgColor={White}
                        >
                            <Smile />
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

export default withAuth(FirstProjectSetupScreen)
