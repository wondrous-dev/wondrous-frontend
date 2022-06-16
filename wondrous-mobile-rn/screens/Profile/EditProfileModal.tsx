import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView, View, Alert, Platform, TextInput, TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native'
import Modal from 'react-native-modal'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import palette from 'theme/palette'
import { Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { capitalizeFirstLetter, extractFirstAndLastName, getNonWhiteSpaceLength, spacingUnit } from '../../utils/common'
import { modalStyles, ModalDropdown, privacyDropdown } from '../../components/Modal/common'
import { SafeImage, UploadImage } from '../../storybook/stories/Image'
import { ProfilePlaceholder} from './common'
import { profileStyles } from './style'
import { useNavigation, useRoute } from '@react-navigation/native'
import { LINKED_PREFIX, MAX_BIO_LIMIT } from '../../constants'
import { projectTags } from '../SignupFlow/ProjectTagSelectionScreen'
import { projectTagHash } from '../../constants/projectTag'

export const EditProfileModal = ({ user, project, setParentImage, saveMutation, isVisible, setModalVisible }) => {
  const initialUsername = user && user.username
  const initialProjectName = project && project.name
  const initialLink = user && user.link
  const initialBio = (user && user.bio) || (project && project.description)
  const initialProfilePicture = (user?.thumbnailPicture || user?.profilePicture) || (project?.thumbnailPicture || project?.profilePicture)
  const initialWebsite = (user?.links?.website || project?.links?.website) || ''
  const initialPrivacy= project?.privacyLevel || 'public'

  const initialTwitter = (user?.links?.twitter || project?.links?.twitter) || ''
  const initialInstagram = (user?.links?.instagram || project?.links?.instagram) || ''
  const initialLinkedin = (user?.links?.linkedin || project?.links?.linkedin) || ''
  const initialGithub = (user?.links?.github || project?.links?.github) || ''
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
  const [website, setWebsite] = useState(initialWebsite)
  const [projectTwitter, setTwitter] = useState(initialTwitter)
  const [instagram, setInstagram] = useState(initialInstagram)
  const [linkedin, setLinkedin] = useState(initialLinkedin)
  const [github, setGithub] = useState(initialGithub)
  const [privacy, setPrivacy] = useState(initialPrivacy)

  const resetState = useCallback(() => {
    setUsername(initialUsername)
    setLink(initialLink)
    setBio(initialBio)
    setProfilePicture(initialProfilePicture)
    setChangePhoto(false)
  }, [])

  const setImage = useCallback((image) => {
    setProfilePicture(image)
    setParentImage(image)
  }, [])

  useEffect(() => {
    if (initialProfilePicture && !profilePicture) {
      setProfilePicture(initialProfilePicture)
    }
    if (user?.username) {
      setUsername(user?.username)
    }
    if (initialName) {
      setFullName(initialName)
    }
    if (project?.description) {
      setBio(project?.description)
    }
    if (user?.bio) {
      setBio(user?.bio)
    }
    if (initialTwitter) {
      setTwitter(initialTwitter)
    }

    if (initialInstagram) {
      setInstagram(initialInstagram)
    }

    if (initialLinkedin) {
      setLinkedin(initialLinkedin)
    }
    if (initialGithub) {
      setGithub(initialGithub)
    }

    if (initialWebsite) {
      setWebsite(initialWebsite)
    }

    if (initialPrivacy) {
      setPrivacy(initialPrivacy)
    }

  }, [initialProfilePicture, user?.username, user?.bio, project?.description, initialName, initialBio, initialTwitter, initialInstagram, initialLinkedin, initialGithub, initialWebsite, initialPrivacy]) 
  const cleanedTags = project?.tags?.map(tag => projectTagHash[tag])

  const setProjectPrivacy = useCallback((privacy) => {
    const message = privacy === 'public' ? 'Making project public' : 'Making project private'
    const subMessage = privacy === 'public' ? 'All project activity, bio and links can be seen by any user' : 'All project activity can only be seen by approved accounts'
    Alert.alert(
      message,
      subMessage,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Got it", onPress: () => {
          setPrivacy(privacy)
        } }
      ],
      { cancelable: false }
    )
  }, [])
  return (
    <Modal isVisible={isVisible}>
      {
        project &&
        <UploadImage isVisible={changePhoto} setModalVisible={setChangePhoto} image={profilePicture} setImage={setImage} saveImageMutation={saveMutation} imagePrefix={`tmp/${project.id}/`} saveImageMutationVariable={[{projectId: project.id, input: { profilePicture }}, ['input', 'profilePicture']]} />
      }
      {
        user &&
        <UploadImage isVisible={changePhoto} setModalVisible={setChangePhoto} image={profilePicture} setImage={setImage} saveImageMutation={saveMutation} imagePrefix={`tmp/${user.id}/`} saveImageMutationVariable={[{userId: user.id, input: { profilePicture }}, ['input', 'profilePicture']]}  />
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
              <RegularText color={palette.blue400} style={{
                fontSize: 16
              }}>
                Cancel
              </RegularText>
              </Pressable>
              <View style={{
                flex: 1
              }}>
                <Subheading color={palette.black} style={{
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
                    privacyLevel: privacy,
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
                if (website) {
                  variableInputObj['links']['website'] = website
                }
                if (projectTwitter) {
                  variableInputObj['links']['twitter'] = projectTwitter
                }

                if (instagram) {
                  variableInputObj['links']['instagram'] = instagram
                }
                if (linkedin) {
                  variableInputObj['links']['linkedin'] = linkedin
                }
                if (github) {
                  variableInputObj['links']['github'] = github
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
                <RegularText color={palette.white} style={{
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
                  <Paragraph color={palette.blue400} style={{
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
                  <Paragraph color={palette.blue400} style={{
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
                      <Paragraph color={palette.black} style={profileStyles.changeRowParagraphText}>
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
                      <Paragraph color={palette.black} style={{
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
                        <Paragraph color={palette.black} style={{
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
                        <View style={{
                          ...profileStyles.changeRowContainer,
                          ...(
                            Platform.OS !== 'android' && {
                              zIndex: 4000
                            }
                          )
                        }}>
                          <Paragraph color={palette.black} style={{
                          ...profileStyles.changeRowParagraphText,
                          ...(!user &&
                            {
                              width: spacingUnit * 13,
                              marginRight: spacingUnit
                            })
                          }}>
                            Privacy
                          </Paragraph>
                          <ModalDropdown value={privacy} items={privacyDropdown} setValue={setProjectPrivacy} placeholder='Select privacy level' />
                        </View>
                          <View style={profileStyles.changeRowContainer}>
                            <Paragraph color={palette.black} style={{
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
                            <Paragraph color={palette.black}>
                              {capitalizeFirstLetter(project.category)}
                            </Paragraph>
                            <Pressable style={{
                              // marginLeft: spacingUnit * 2
                            }} onPress={() => {
                              navigation.navigate('Root', {
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
                              <Paragraph color={palette.blue400}>
                                Edit
                              </Paragraph>
                            </Pressable>
                            </View>
                          </View>
                          {
                              (project.category === 'tech' || project.category === 'business') &&
                              <View style={profileStyles.changeRowContainer}>
                              <Paragraph color={palette.black} style={{
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
                              <Paragraph color={project.tags ? palette.black : palette.grey800}>
                                {cleanedTags ?
                                capitalizeFirstLetter(cleanedTags.join(', '))
                                :
                                'None'}
                              </Paragraph>
                              <Pressable style={{
                                // marginLeft: spacingUnit * 2
                              }} onPress={() => {
                                navigation.navigate('Root', {
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
                                <Paragraph color={palette.blue400}>
                                  Edit
                                </Paragraph>
                              </Pressable>
                              </View>
                            </View>
                          }
                        </>
                      }
                        <View style={profileStyles.changeRowContainer}>
                          <Paragraph color={palette.black} style={{
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
                            onChangeText={text => setWebsite(text)}
                            value={website}
                            placeholder='Add website'
                            style={[profileStyles.changeRowText, {
                              textTransform: 'lowercase'
                            }]}
                          />
                        </View>
                        <View style={profileStyles.changeRowContainer}>
                          <Paragraph color={palette.black} style={{
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
                            onChangeText={text => setTwitter(text)}
                            multiline
                            value={projectTwitter}
                            placeholder='Add Twitter handle'
                            style={[profileStyles.changeRowText, {
                              textTransform: 'lowercase'
                            }]}
                          />
                        </View>
                        <View style={profileStyles.changeRowContainer}>
                          <Paragraph color={palette.black} style={{
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
                            onChangeText={text => setInstagram(text)}
                            multiline
                            value={instagram}
                            placeholder='Add Instagram handle'
                            style={[profileStyles.changeRowText, {
                              textTransform: 'lowercase'
                            }]}
                          />
                        </View>
                        <View style={profileStyles.changeRowContainer}>
                          <Paragraph color={palette.black} style={{
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
                            onChangeText={text => setLinkedin(text)}
                            value={linkedin}
                            placeholder='Add Linkedin username'
                            style={[profileStyles.changeRowText, {
                              textTransform: 'lowercase'
                            }]}
                          />
                        </View>
                        <View style={profileStyles.changeRowContainer}>
                          <Paragraph color={palette.black} style={{
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
                            onChangeText={text => setGithub(text)}
                            value={github}
                            placeholder='Add Github username'
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