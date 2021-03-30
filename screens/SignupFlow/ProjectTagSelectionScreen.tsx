import React, { createContext, useContext, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, TouchableOpacity, Text, Image, SafeAreaView, Dimensions, Pressable, TextInput } from 'react-native'
import ProgressCircle from 'react-native-progress-circle'
import { Formik } from 'formik';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { spacingUnit } from '../../utils/common'
import { Black, White, Blue500, Blue600, Red400, Orange, Grey500, Green400, Grey900, Grey300, GreyPlaceHolder } from '../../constants/Colors'
import { Subheading, ErrorText, ButtonText, Paragraph } from '../../storybook/stories/Text'
import { CREATE_PROJECT_TAGS } from '../../graphql/mutations/project'
import BigMouthSmile from '../../assets/images/emoji/openMouthSmile'
import HeartEyes from '../../assets/images/emoji/heartEyes'
import { PrimaryButton } from '../../storybook/stories/Button'
import { moderateScale } from '../../utils/scale'
import { withAuth, useMe } from '../../components/withAuth'
import { useMutation } from '@apollo/client'
import { updateUsageProgress } from '../../utils/apollo';
import { ScrollView } from 'react-native-gesture-handler';

const TagContext = createContext(null)

const tags = [
    { value: 'fintech', displayName: 'Fintech' },
    { value: 'consumer', displayName: 'Consumer' },
    { value: 'ai_ml', displayName: 'AI/ML' },
    { value: 'social', displayName: 'Social'},
    { value: 'crypto_blockchain', displayName: 'Crypto/Blockchain' },
    { value: 'creator_tools', displayName: 'Creator Tools' },
    { value: 'community', displayName: 'Community'},
    { value: 'e_commerce', displayName: 'E-commerce'},
    { value: 'b2b_sass', displayName: 'B2B Sass'},
    { value: 'no_code', displayName: 'No Code'},
    { value: 'biotech', displayName: 'Biotech'},
    { value: 'climate', displayName: 'Climate'},
    { value: 'future_of_work', displayName: 'Future of Work'},
    { value: 'hardware', displayName: 'Hardware'},
    { value: 'marketplace', displayName: 'Marketplace'},
    { value: 'dev_tools', displayName: 'Dev Tools'},
    { value: 'productivity', displayName: 'Productivity'},
    { value: 'music', displayName: 'Music'}
]

const projectTagStyles = StyleSheet.create({
    stepContainer: {
        marginTop: spacingUnit * 3,
    },
    progressCircleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: spacingUnit * 3,
    },
    projectTagInputContainer: {
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
    paragraph: {
        marginTop: spacingUnit,
        color: Grey500,
        textAlign: 'center',
        maxWidth: spacingUnit * 43,
        alignSelf: 'center',
    },
    tagsRowContainer: {
        flexDirection: 'row',
        marginTop: spacingUnit * 2.75,
        justifyContent: 'space-around'
    }
})

const SingleTag = ({ tagName, selected, tagLength }) => {
    const textColor = selected ? White : Blue500
    const backgroundColor = selected ? Blue500 : White
    const {
        projectTags,
        setProjectTags
    } = useContext(TagContext)

    return (

        <View style={{
            borderColor: Blue500,
            borderStyle: 'solid',
            borderWidth: 2,
            borderRadius: 8,
            height: spacingUnit * 4,
            ...(tagLength === 2 && {
                marginLeft: spacingUnit * 2
            }),
            backgroundColor: backgroundColor,
            justifyContent: 'center',
            paddingLeft: spacingUnit,
            paddingRight: spacingUnit,
            flex: 1
        }
        }>
            <ButtonText style={{
                alignSelf: 'center',
            }} color={textColor}>{tagName}</ButtonText>
        </View>
    )
}

const ProjectTagInput = ({ navigation, projectId }) => {
    const {
        setFinished,
        setError,
        finished,
        existingTags,
        edit
    } = useContext(TagContext)

    let initialObj = {}
    if (existingTags){
        existingTags.forEach(tag => {
            initialObj[tag] = true
        })
    }
    const user = useMe()
    const [selectedTags, setSelectedTags] = useState(initialObj)
    const [createTags] = useMutation(CREATE_PROJECT_TAGS, {
        update(cache, { data: { createProjectTags }}) {
            cache.modify({
                fields: {
                    users() {
                        return updateUsageProgress({ user, newKey: 'usageProgress'})
                    },
                    getProjectById() {
                        return {...createProjectTags}
                    }
                }
            })
        }
    })
    const toggleTagSelection = (tag) => {
        let tempState = Object.assign({}, selectedTags);

        if (tempState[tag]) {
            delete tempState[tag]
        } else if (Object.keys(selectedTags).length < 3) {
            tempState[tag] = true
        }
        setSelectedTags(tempState)
    }

    const TagsRow = ({ tags }) => (
        <View style={{
            ...projectTagStyles.tagsRowContainer,
            ...{
                width: tags?.length === 3 ? '100%' : 'auto'
            }
        }}>
            {tags.map(tag => (
                <Pressable onPress={() => toggleTagSelection(tag.value)} key={tag.value}>
                    <SingleTag selected={selectedTags[tag.value]} tagName={tag.displayName} tagLength={tags?.length} />
                </Pressable>
            ))}
        </View>
    )
    // split tags into groups of thress
    let i, chunk = 2;
    const tagRows = [] // <- [[3 tags], [3 tags]... ]
    for (i = 0; i < tags.length; i += chunk) {
        if (chunk === 2) {
            chunk = 3
        } else if (chunk === 3) {
            chunk = 2
        }
        tagRows.push(tags.slice(i, i + chunk));
    }

    return (
        <View style={projectTagStyles.projectTagInputContainer}>
            <Subheading style={{
            }} color={Black}>
                Pick up to 3 industry specific tags
        </Subheading>
            <Paragraph style={projectTagStyles.paragraph}>
                Help us match you with relevant content!
        </Paragraph>
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}>
                {tagRows.map((tagRow, index) => (<TagsRow key={index} tags={tagRow} />))}
            </View>
            <PrimaryButton
                textStyle={{ color: White }}
                style={{
                    width: spacingUnit * 43,
                    alignSelf: 'center',
                    marginTop: spacingUnit * 5
                }}
                onPress={async () => {
                    if (Object.keys(selectedTags).length === 0) {
                        setError('Please select at least one tag')
                    } else {
                        await createTags({
                            variables: {
                                projectId,
                                input: {
                                    tags: Object.keys(selectedTags)
                                },
                                firstTime: true
                            }
                        })
                        if (edit) {
                            navigation.push('Root', {
                                screen: 'Profile',
                                params: {
                                    screen: 'ProjectProfile',
                                    params: {
                                        projectId,
                                        editProfile: true
                                    }
                                }
                            })
                        } else {
                            if (finished) {
                                if (!user?.usageProgress?.signupCompleted) {
                                    navigation.push('Root', {
                                        screen: 'Profile',
                                        params: {
                                          screen: 'UserProfile'
                                        }
                                      })
                                } else {
                                    navigation.push('Root', {
                                        screen: 'Profile',
                                        params: {
                                          screen: 'ProjectProfile',
                                          params: {
                                            projectId,
                                            noGoingBack: true
                                          }
                                        }
                                      })
                                }
                            } else {
                                setFinished(true)
                                setTimeout(() => {
                                    if (!user?.usageProgress?.signupCompleted) {
                                        navigation.push('Root', {
                                            screen: 'Profile',
                                            params: {
                                              screen: 'UserProfile'
                                            }
                                          })
                                    } else {
                                        navigation.push('Root', {
                                            screen: 'Profile',
                                            params: {
                                              screen: 'ProjectProfile',
                                              params: {
                                                projectId,
                                                noGoingBack: true
                                              }
                                            }
                                          })
                                    }
                                }, 1000)
                            }
                        }
                    }
                }}
            >
                <ButtonText color={White}> {edit ? 'Update' : 'Continue'}  </ButtonText>
            </PrimaryButton>

        </View>
    )
}

function ProjectTagSelectionScreen({
    navigation,
    route
}: StackScreenProps<RootStackParamList, 'ProjectTagSelection'>) {
    const {
        projectId,
        edit,
        existingTags
    } = route.params

    const [finished, setFinished] = useState(false)
    const [error, setError] = useState(null)
    return (
        <SafeAreaView style={{
            backgroundColor: White,
            flex: 1,
        }}>
            <Header skip={edit ? null : 'Root'} skipParams={{
                screen: 'Profile'
            }} />
            <ScrollView style={{
                flex: 1
            }}>
            {
                !edit &&
                <View style={projectTagStyles.progressCircleContainer}>
                    <ProgressCircle
                        percent={finished ? 100 :80}
                        radius={50}
                        borderWidth={10}
                        color={finished ? Green400 : Orange}
                        shadowColor={Grey300}
                        bgColor={White}
                    >
                        {finished ? 
                            <HeartEyes />
                            :
                            <BigMouthSmile />
                        }
                    </ProgressCircle>
                    <View style={projectTagStyles.stepContainer}>
                        <Text style={projectTagStyles.stepCount}>step 4/4</Text>
                    </View>
                </View>
            }
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
            <TagContext.Provider value={{
                finished,
                setFinished,
                error,
                setError,
                existingTags,
                edit
            }}>
            <ProjectTagInput navigation={navigation} projectId={projectId} />
            </TagContext.Provider>
            </ScrollView>
        </SafeAreaView>
    )
}

export default withAuth(ProjectTagSelectionScreen)
