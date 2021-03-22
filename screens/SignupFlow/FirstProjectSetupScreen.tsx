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
import { Subheading, ErrorText, ButtonText, Paragraph } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import Smile from '../../assets/images/emoji/smile'
import { withAuth, useMe } from '../../components/withAuth'
import { CREATE_PROJECT, UPDATE_PROJECT } from '../../graphql/mutations/project'
import { GET_PROJECT_BY_ID } from '../../graphql/queries/project'
import apollo from '../../services/apollo'
import { updateUsageProgress } from '../../utils/apollo';
import { SET_USER_SIGNUP_COMPLETE } from '../../graphql/mutations';

const FirstProjectSetupContext = createContext(null)

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
    goToHome: {
        textDecorationLine: 'underline',
        fontFamily: 'Rubik Light',
        alignSelf: 'center',
        marginTop: spacingUnit * 2
      }
})

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);





const CreateProjectInput = ({ navigation, setup }) => {
    const user = useMe()
    const [name, setName] = useState('')
    // for some reason the formik isSubmitting was not working...
    const [myIsSubmitting, setMyIsSubmitting] = useState(false)
    const [description, setDescription] = useState('')
    const {
        setError
    } = useContext(FirstProjectSetupContext)
    const [createProject] = useMutation(CREATE_PROJECT, {
        update(cache, { data: { createProject }}) {
            cache.modify({
                fields: {
                    users() {
                        if ((user && !user.usageProgress) || (user && user.usageProgress && !user.usageProgress.projectCreated)) {
                            return updateUsageProgress({ user, newKey: 'projectCreated', newValue: createProject.id})
                        }
                        return [user]
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
        if (setup) {
            fillInitialProject()
        }
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
                onSubmit={async (values, { setSubmitting }) => {
                    setMyIsSubmitting(true)
                    if (!name || !description) {
                        setError('Please set a name and a description')
                    } else {
                        try {
                            if (user && user.usageProgress && user.usageProgress.projectCreated && setup) {
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
                                        firstTime: !!(setup)
                                    }
                                })
                                navigation.navigate('ProjectSetupCategory', {
                                    projectId: projectData.data.createProject && projectData.data.createProject.id,
                                    setup
                                })
                            }
                        } catch (error) {
                            console.log("error creating project", JSON.stringify(error, null, 2))
                        }
                    }
                    setMyIsSubmitting(false)
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
                    <View>
                        <TextInput
                            style={{
                                width: spacingUnit * 43,
                                height: spacingUnit * 4.5,
                                borderColor: Grey300,
                                borderWidth: 1,
                                borderRadius: 4,
                                fontSize: 16,
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
                                fontSize: 16,
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
                            disabled={myIsSubmitting}
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
    navigation,
    route
}: StackScreenProps<RootStackParamList, 'FirstProjectSetup'>) {
    const user = useMe()
    const [error, setError] = useState(null)
    const [setSignupComplete] = useMutation(SET_USER_SIGNUP_COMPLETE)
    let setup = false
    setup = route?.params?.setup
    useEffect(() => {
        if (user && user.usageProgress && user.usageProgress.projectCreated && setup) {
            navigation.navigate('ProjectSetupCategory', {
                projectId: user.usageProgress.projectCreated,
                setup: true
            })
        }
    }, [])

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
                            <Text style={firstProjectSetupStyles.stepCount}>step {setup ? '2/4' : '1/3'}</Text>
                        </View>
                    </View>
                    {                
                        error &&
                        <View style={{
                            alignItems: 'center'
                        }}>
                            <ErrorText>
                                {error}
                            </ErrorText>
                        </View>
                    }
                    <FirstProjectSetupContext.Provider value={{
                        error,
                        setError
                    }}>
                    <CreateProjectInput navigation={navigation} setup={setup} />
                    {
                        setup &&
                        <TouchableOpacity onPress={async () => {
                            await setSignupComplete()
                            navigation.push('Root', {
                              screen: 'Profile',
                              params: {
                                screen: 'UserProfile',
                              }
                            })
                          }}>
                            <ButtonText color={Grey500} style={firstProjectSetupStyles.goToHome}>
                              I already got invited to a project!
                            </ButtonText>
                          </TouchableOpacity>
                    }
                    </FirstProjectSetupContext.Provider>
                </View>
            </DismissKeyboard>

        </SafeAreaView>
    )
}

export default withAuth(FirstProjectSetupScreen)
