import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View, StyleSheet, Dimensions, Platform, TextInput, TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native'
import Modal from 'react-native-modal'
import { useQuery } from '@apollo/client'
import { toDate } from 'date-fns'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Black, White, Blue400, Grey400, Grey800, Grey750, Blue500, Red400, Yellow300, Grey300 } from '../../constants/Colors'
import { ErrorText, Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { capitalizeFirstLetter, extractFirstAndLastName, getNonWhiteSpaceLength, spacingUnit } from '../../utils/common'
import { modalStyles } from '../../components/Modal/common'
import { SafeImage, UploadImage } from '../../storybook/stories/Image'
import { ProfilePlaceholder } from './common'
import { profileStyles } from './style'

import { useNavigation, useRoute } from '@react-navigation/native'
import { MAX_BIO_LIMIT } from '../../constants'

export const EditProfileModal = ({ user, project, imagePrefix, saveMutation, isVisible, setModalVisible }) => {
  const initialUsername = user && user.username
  const initialProjectName = project && project.name
  const initialLink = user && user.link
  const initialBio = (user && user.bio) || (project && project.description)
  const initialProfilePicture = (user?.thumbnailPicture || user?.profilePicture) || (project?.thumbnailPicture || project?.profilePicture)
  const initialProjectWebsite = (project && project.links && project.links.website) || ''
  const initialProjectTwitter = (project && project.links && project.links.twitter) || ''
  const initialProjectInstagram = (project && project.links && project.links.instagram) || ''
  const initialProjectLinkedin = (project && project.links && project.links.linkedin) || ''
  const initialProjectGithub = (project && project.links && project.links.github) || ''
  const initialName = user && `${user.firstName || ''} ${user.lastName || ''}` 
  const navigation = useNavigation()
  const route = useRoute()
  const [username, setUsername] = useState(initialUsername)
  const [fullName, setFullName] = useState(initialName)
  const [projectName, setProjectName] = useState(initialProjectName)
  const [link, setLink] = useState(initialLink)
  const [bio, setBio] = useState(initialBio)
  const [profilePicture, setProfilePicture] = useState(initialProfilePicture)
  const [changePhoto, setChangePhoto] = useState(false)
  const [projectWebsite, setProjectWebsite] = useState(initialProjectWebsite)
  const [projectTwitter, setProjectTwitter] = useState(initialProjectTwitter)
  const [projectInstagram, setProjectInstagram] = useState(initialProjectInstagram)
  const [projectLinkedin, setProjectLinkedin] = useState(initialProjectLinkedin)
  const [projectGithub, setProjectGithub] = useState(initialProjectGithub)

  const resetState = useCallback(() => {
    setUsername(initialUsername)
    setLink(initialLink)
    setBio(initialBio)
    setProfilePicture(initialProfilePicture)
    setChangePhoto(false)
  }, [])
  useEffect(() => {
    if (initialProfilePicture && !profilePicture) {
      setProfilePicture(initialProfilePicture)
    }
  }, [initialProfilePicture]) 
  return (
    <Modal isVisible={isVisible}>
      {
        project &&
        <UploadImage isVisible={changePhoto} setModalVisible={setChangePhoto} image={profilePicture} setImage={setProfilePicture} saveImageMutation={saveMutation} imagePrefix={`tmp/${project.id}/`} saveImageMutationVariable={[{projectId: project.id, input: { profilePicture }}, ['input', 'profilePicture']]} />
      }
      {
        user &&
        <UploadImage isVisible={changePhoto} setModalVisible={setChangePhoto} image={profilePicture} setImage={setProfilePicture} saveImageMutation={saveMutation} imagePrefix={`tmp/${user.id}/`} saveImageMutationVariable={[{userId: user.id, input: { profilePicture }}, ['input', 'profilePicture']]}  />
      }
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={modalStyles.fullScreenContainer}>
          <KeyboardAwareScrollView>
          <View style={modalStyles.topRowContainer}>
              <Pressable onPress={() => {
                setModalVisible(false)
                resetState()
              }} style={{
                flex: 1
              }}>
              <RegularText color={Blue400} style={{
                fontSize: 16
              }}>
                Cancel
              </RegularText>
              </Pressable>
              <View style={{
                flex: 1
              }}>
                <Subheading color={Black} style={{
                  fontSize: 20
                }}>
                  Edit profile
                </Subheading>
              </View>
              <View style={{
                flex: 1,
              }}>
              <Pressable style={modalStyles.createUpdateButton} onPress={() => {
                let variableInputObj = {
                  'links': {}
                }
                if (user) {
                  variableInputObj = {
                    ...(username && {
                      username
                    }),
                    ...(bio && {
                      bio
                    }),
                    links: {}
                  }
                } else if (project) {
                  variableInputObj = {
                    ...(projectName && {
                      name: projectName
                    }),
                    ...(bio && {
                      description: bio
                    }),
                    links: {}
                  }
                }
                if (user && fullName) {
                  const {
                    firstName,
                    lastName
                  } = extractFirstAndLastName(fullName)
                  variableInputObj['firstName'] = firstName || ''
                  variableInputObj['lastName'] = lastName || ''
                }
                if (projectWebsite) {
                  variableInputObj['links']['website'] = projectWebsite
                }
                if (projectTwitter) {
                  variableInputObj['links']['twitter'] = projectTwitter
                }

                if (projectInstagram) {
                  variableInputObj['links']['instagram'] = projectInstagram
                }
                if (projectLinkedin) {
                  variableInputObj['links']['linkedin'] = projectLinkedin
                }
                if (projectGithub) {
                  variableInputObj['links']['github'] = projectGithub
                }
                if (Object.keys(variableInputObj['links']).length === 0) {
                  variableInputObj['links'] = null
                }
                saveMutation({
                  variables: {
                    ...(project && {
                      projectId: project.id
                    }),
                    input: variableInputObj
                  }
                })
                setModalVisible(false)
              }}>
                <RegularText color={White} style={{
                  fontSize: 16
                }}>
                  Update
                </RegularText>
              </Pressable>
              </View>
            </View>
            <View style={{
              marginTop: spacingUnit * 5
            }}>
              {
                profilePicture ?
                <View style={{
                  alignItems: 'center',
                  alignSelf: 'center'
                }}>
                <SafeImage style={{
                  ...profileStyles.profileImage,
                  width: spacingUnit * 12,
                  height: spacingUnit * 12,
                  borderRadius: spacingUnit * 6,
                }} src={profilePicture} />
                <Pressable onPress={() => setChangePhoto(true)}>
                  <Paragraph color={Blue400} style={{
                    marginTop: spacingUnit
                  }}>
                    Change profile photo
                  </Paragraph>
                </Pressable>
                </View>
                :
                <View style={{
                  alignItems: 'center'
                }}>
                <Pressable onPress={() => setChangePhoto(true)}>
                <ProfilePlaceholder imageStyles={{
                  width: spacingUnit * 12,
                  height: spacingUnit * 12,
                  borderRadius: spacingUnit * 6
                }} projectOwnedByUser={true} onPress={() => setChangePhoto(true)}/>
                  <Paragraph color={Blue400} style={{
                    marginTop: spacingUnit
                  }}>
                    Add photo
                  </Paragraph>
                </Pressable>
                </View>
              }
                <View style={{
                  marginTop: spacingUnit * 5,
                  marginLeft: spacingUnit * 3
                }}>
                  {
                    user &&
                    <View style={profileStyles.changeRowContainer}>
                      <Paragraph color={Black} style={profileStyles.changeRowParagraphText}>
                        Full Name
                      </Paragraph>
                      <TextInput
                          autoCapitalize = 'none'
                          onChangeText={text => setFullName(text)}
                          value={fullName}
                          placeholder={'Full Name'}
                          style={profileStyles.changeRowText}
                      />
                    </View>
                  }
                    <View style={profileStyles.changeRowContainer}>
                      <Paragraph color={Black} style={{
                        ...profileStyles.changeRowParagraphText,
                        ...(!user &&
                          {
                            width: spacingUnit * 13,
                            marginRight: spacingUnit
                          })
                        }}>
                        {user ? 'Username'  : 'Project Name'}
                      </Paragraph>
                      <TextInput
                          autoCapitalize = 'none'
                          onChangeText={text => user ? setUsername(text) : setProjectName(text)}
                          value={user ? username : projectName}
                          placeholder={user ? 'Username' : 'Project name'}
                          style={profileStyles.changeRowText}
                      />
                      </View>
                      <View style={profileStyles.changeRowContainer}>
                        <Paragraph color={Black} style={{
                        ...profileStyles.changeRowParagraphText,
                        ...(!user &&
                          {
                            width: spacingUnit * 13,
                            marginRight: spacingUnit
                          })
                        }}>
                          Bio
                        </Paragraph>
                        <TextInput
                          onChangeText={text => {
                            if (getNonWhiteSpaceLength(text) <= MAX_BIO_LIMIT) {
                              setBio(text)
                            }
                          }}
                          value={bio}
                          placeholder='Add bio...'
                          style={profileStyles.changeRowText}
                          multiline
                        />
                      </View>
                      {
                        project &&
                        <>
                          <View style={profileStyles.changeRowContainer}>
                            <Paragraph color={Black} style={{
                        ...profileStyles.changeRowParagraphText,
                        ...(!user &&
                          {
                            width: spacingUnit * 13,
                            marginRight: spacingUnit
                          })
                        }}>
                              Category
                            </Paragraph>
                            <View style={profileStyles.editRowContainer}>
                            <Paragraph color={Black}>
                              {capitalizeFirstLetter(project.category)}
                            </Paragraph>
                            <Pressable style={{
                              // marginLeft: spacingUnit * 2
                            }} onPress={() => {
                              navigation.push('Root', {
                                screen: route && route.params && route.params.tab || 'Profile',
                                params: {
                                  screen: 'EditProjectCategory',
                                  params: {
                                    edit: true,
                                    projectId: project.id,
                                    existingProjectCategory: project.category
                                  }
                                }
                              })
                              setModalVisible(false)
                            }}>
                              <Paragraph color={Blue400}>
                                Edit
                              </Paragraph>
                            </Pressable>
                            </View>
                          </View>
                          {
                              (project.category === 'tech' || project.category === 'business') &&
                              <View style={profileStyles.changeRowContainer}>
                              <Paragraph color={Black} style={{
                        ...profileStyles.changeRowParagraphText,
                        ...(!user &&
                          {
                            width: spacingUnit * 13,
                            marginRight: spacingUnit
                          })
                        }}>
                                Tags
                              </Paragraph>
                              <View style={profileStyles.editRowContainer}>
                              <Paragraph color={project.tags ? Black : Grey800}>
                                {project.tags ?
                                capitalizeFirstLetter(project.tags.join(', '))
                                :
                                'None'}
                              </Paragraph>
                              <Pressable style={{
                                // marginLeft: spacingUnit * 2
                              }} onPress={() => {
                                navigation.push('Root', {
                                  screen: route && route.params && route.params.tab || 'Profile',
                                  params: {
                                    screen: 'EditProjectTags',
                                    params: {
                                      edit: true,
                                      projectId: project.id,
                                      existingTags: project.tags
                                    }
                                  }
                                })
                                setModalVisible(false)
                              }}>
                                <Paragraph color={Blue400}>
                                  Edit
                                </Paragraph>
                              </Pressable>
                              </View>
                            </View>
                          }
                        </>
                      }
                        <View style={profileStyles.changeRowContainer}>
                          <Paragraph color={Black} style={{
                        ...profileStyles.changeRowParagraphText,
                        ...(!user &&
                          {
                            width: spacingUnit * 13,
                            marginRight: spacingUnit
                          })
                        }}>
                            Website
                          </Paragraph>
                          <TextInput
                          multiline
                          autoCapitalize = 'none'
                            onChangeText={text => setProjectWebsite(text)}
                            value={projectWebsite}
                            placeholder='Add website'
                            style={[profileStyles.changeRowText, {
                              textTransform: 'lowercase'
                            }]}
                          />
                        </View>
                        <View style={profileStyles.changeRowContainer}>
                          <Paragraph color={Black} style={{
                        ...profileStyles.changeRowParagraphText,
                        ...(!user &&
                          {
                            width: spacingUnit * 13,
                            marginRight: spacingUnit
                          })
                        }}>
                            Twitter
                          </Paragraph>
                          <TextInput
                            autoCapitalize = 'none'
                            onChangeText={text => setProjectTwitter(text)}
                            multiline
                            value={projectTwitter}
                            placeholder='Add Twitter'
                            style={[profileStyles.changeRowText, {
                              textTransform: 'lowercase'
                            }]}
                          />
                        </View>
                        <View style={profileStyles.changeRowContainer}>
                          <Paragraph color={Black} style={{
                        ...profileStyles.changeRowParagraphText,
                        ...(!user &&
                          {
                            width: spacingUnit * 13,
                            marginRight: spacingUnit
                          })
                        }}>
                            Instagram
                          </Paragraph>
                          <TextInput
                            autoCapitalize = 'none'
                            onChangeText={text => setProjectInstagram(text)}
                            multiline
                            value={projectInstagram}
                            placeholder='Add Instagram'
                            style={[profileStyles.changeRowText, {
                              textTransform: 'lowercase'
                            }]}
                          />
                        </View>
                        <View style={profileStyles.changeRowContainer}>
                          <Paragraph color={Black} style={{
                        ...profileStyles.changeRowParagraphText,
                        ...(!user &&
                          {
                            width: spacingUnit * 13,
                            marginRight: spacingUnit
                          })
                        }}>
                            Linkedin
                          </Paragraph>
                          <TextInput
                            autoCapitalize = 'none'
                            multiline
                            onChangeText={text => setProjectLinkedin(text)}
                            value={projectLinkedin}
                            placeholder='Add Linkedin'
                            style={[profileStyles.changeRowText, {
                              textTransform: 'lowercase'
                            }]}
                          />
                        </View>
                        <View style={profileStyles.changeRowContainer}>
                          <Paragraph color={Black} style={{
                        ...profileStyles.changeRowParagraphText,
                        ...(!user &&
                          {
                            width: spacingUnit * 13,
                            marginRight: spacingUnit
                          })
                        }}>
                            Github
                          </Paragraph>
                          <TextInput
                            autoCapitalize = 'none'
                            multiline
                            onChangeText={text => setProjectGithub(text)}
                            value={projectGithub}
                            placeholder='Add Github'
                            style={[profileStyles.changeRowText, {
                              textTransform: 'lowercase'
                            }]}
                          />
                        </View>
                </View>
            </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  )
}