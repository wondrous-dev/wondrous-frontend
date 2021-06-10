import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet,Platform, View, TouchableOpacity, Text, KeyboardAvoidingView, SafeAreaView, Dimensions, Pressable, TextInput } from 'react-native'
import ProgressCircle from 'react-native-progress-circle'
import { Formik } from 'formik';
import { useMutation } from '@apollo/client'
import { TouchableWithoutFeedback, Keyboard } from 'react-native'

import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { spacingUnit, getLocale } from '../../utils/common'
import { Black, Grey900, White, Blue400, Blue500, Yellow300, Grey300, Grey500, GreyPlaceHolder } from '../../constants/Colors'
import { Subheading, ErrorText, ButtonText, Paragraph } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import Smile from '../../assets/images/emoji/smile'
import { withAuth, useMe } from '../../components/withAuth'
import { CREATE_PROJECT, UPDATE_PROJECT } from '../../graphql/mutations/project'
import { GET_PROJECT_BY_ID } from '../../graphql/queries/project'
import apollo from '../../services/apollo'
import { updateUsageProgress } from '../../utils/apollo';
import { SET_USER_SIGNUP_COMPLETE } from '../../graphql/mutations';
import { ProjectFAQModal } from '../../components/Modal/ProjectFAQModal';

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
    privacyButton: {
        borderColor: Black,
        borderRadius: spacingUnit,
        borderWidth: 1,
        padding: spacingUnit,
    },
    paragraph: {
        marginTop: spacingUnit,
        color: Grey500,
        textAlign: 'center',
        maxWidth: spacingUnit * 43,
        alignSelf: 'center',
        marginBottom: spacingUnit * 2
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
    const [projectFAQ, setProjectFAQ] = useState(false)
    const [privacy, setPrivacy] = useState('public')
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
                    },
                    getUserProjects(existingProjects=[]) {
                        return [...existingProjects, createProject]
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
            <ProjectFAQModal isVisible={projectFAQ} setModalVisible={setProjectFAQ} />
            <Subheading style={{
            }} color={Black}>
                Make a project!
        </Subheading>
            <Paragraph style={firstProjectSetupStyles.paragraph}>
            Describe your project in one sentence.{"\n"}
            <Paragraph color={Blue400} onPress={() => setProjectFAQ(true)}>
                What is a project?
            </Paragraph>
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
                                            description,
                                            privacyLevel: privacy
                                        },
                                        projectId
                                    }
                                })
                                navigation.push('ProjectSetupCategory', {
                                    projectId: user.usageProgress.projectCreated
                                })
                            } else {
                                const projectData = await createProject({
                                    variables: {
                                        input: {
                                            name,
                                            description,
                                            privacyLevel: privacy,
                                            currentTimezone: getLocale()
                                        },
                                        firstTime: !!(setup)
                                    }
                                })
                                navigation.push('ProjectSetupCategory', {
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
                                if (val.length <= 40) {
                                    setName(val)
                                } else {
                                    setError('Please limit project name to 40 characters')
                                }
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
                            placeholder='Description - e.g. A platform where brands can reward users for ideas and feedback related to their products.'
                            placeholderTextColor={GreyPlaceHolder}
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={(val) => {
                                setDescription(val)
                            }}
                            onBlur={handleBlur('projectDescription')}
                            value={description}
                        />
                        {
                            !setup &&
                            <View style={{
                                marginTop: spacingUnit * 2,
                                flexDirection: 'row'
                            }}>
                            {
                                privacy === 'public'
                                ?
                                <Pressable style={firstProjectSetupStyles.privacyButton} onPress={() => setPrivacy('private')}>
                                    <Paragraph color={Black}>
                                    Make private
                                    </Paragraph>
                                    {/* <Checkmark color={White} style={{
                                    width: 20,
                                    height: 20
                                    }}/> */}
                                </Pressable>
                                :
                                <Pressable style={{
                                    ...firstProjectSetupStyles.privacyButton,
                                    backgroundColor: Black
                                }} onPress={() => setPrivacy('public')}>
                                    <Paragraph color={White}>
                                    Make public
                                    </Paragraph>
                                </Pressable>
                            }
                            <View style={{
                                flex: 1
                            }} />
                            </View>
                        }
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
    let setup = false
    setup = route?.params?.setup
    useEffect(() => {
        if (user && user.usageProgress && user.usageProgress.projectCreated && setup) {
            navigation.push('ProjectSetupCategory', {
                projectId: user.usageProgress.projectCreated,
                setup
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
                <KeyboardAvoidingView
                    behavior={"padding"}
                >
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
                        {/* <View style={firstProjectSetupStyles.stepContainer}>
                            <Text style={firstProjectSetupStyles.stepCount}>step {setup ? '2/4' : '1/3'}</Text>
                        </View> */}
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
                            navigation.push('Root', {
                              screen: 'Profile',
                              params: {
                                screen: 'UserProfile',
                                setup
                              }
                            })
                          }}>
                            <ButtonText color={Grey500} style={firstProjectSetupStyles.goToHome}>
                              Skip and start exploring
                            </ButtonText>
                          </TouchableOpacity>
                    }
                    </FirstProjectSetupContext.Provider>
                </KeyboardAvoidingView>
                </View>
            </DismissKeyboard>
        </SafeAreaView>
    )
}

export default withAuth(FirstProjectSetupScreen)
