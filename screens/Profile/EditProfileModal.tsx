import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View, StyleSheet, Dimensions, Platform, TextInput, TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native'
import Modal from 'react-native-modal'
import { useQuery } from '@apollo/client'
import { toDate } from 'date-fns'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { TextEditor } from '../../storybook/stories/TextEditor'
import { TextEditorContext } from '../../utils/contexts'
import { Black, White, Blue400, Grey400, Grey800, Grey750, Blue500, Red400, Yellow300, Grey300 } from '../../constants/Colors'
import { ErrorText, Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { capitalizeFirstLetter, spacingUnit } from '../../utils/common'
import { endOfWeekFromNow } from '../../utils/date'
import { useMe } from '../../components/withAuth'
import { GET_USER_PROJECTS } from '../../graphql/queries/project'
import Camera from '../../components/Camera'
import { privacyDropdown, submit, PriorityList, ModalDropdown, DateDisplay, modalStyles, ImageDisplay } from '../../components/Modal/common'
import CameraIcon from '../../assets/images/camera'
import ImageIcon from '../../assets/images/image'
import LinkIcon from '../../assets/images/link'
import { SafeImage, UploadImage } from '../../storybook/stories/Image'
import { ProfilePlaceholder } from './common'
import { profileStyles } from './style'
import ImageBrowser from '../../components/Modal/ImageBrowser'
import { useNavigation } from '@react-navigation/native'

export const EditProfileModal = ({ user, project, imagePrefix, saveMutation, isVisible, setModalVisible }) => {
  const initialUsername = user && user.username
  const initialProjectName = project && project.name
  const initialLink = user && user.link
  const initialBio = (user && user.bio) || (project && project.description)
  const initialProfilePicture = (user && user.profilePicture) || (project && project.profilePicture)

  const navigation = useNavigation()
  const [username, setUsername] = useState(initialUsername)
  const [projectName, setProjectName] = useState(initialProjectName)
  const [link, setLink] = useState(initialLink)
  const [bio, setBio] = useState(initialBio)
  const [profilePicture, setProfilePicture] = useState(initialProfilePicture)
  const [changePhoto, setChangePhoto] = useState(false)

  const resetState = useCallback(() => {
    setUsername(initialUsername)
    setLink(initialLink)
    setBio(initialBio)
    setProfilePicture(initialProfilePicture)
    setChangePhoto(false)
  }, [])

  return (
    <Modal isVisible={isVisible}>
      {
        project &&
        <UploadImage isVisible={changePhoto} setModalVisible={setChangePhoto} image={profilePicture} setImage={setProfilePicture} saveImageMutation={saveMutation} imagePrefix={`project/${project.id}/`} saveImageMutationVariable={[{projectId: project.id, input: { profilePicture }}, ['input', 'profilePicture']]} />
      }
      {
        user &&
        <UploadImage isVisible={changePhoto} setModalVisible={setChangePhoto} image={profilePicture} setImage={setProfilePicture} saveImageMutation={saveMutation} imagePrefix={`user/${user.id}/`} saveImageMutationVariable={[{userId: user.id, input: { profilePicture }}, ['input', 'profilePicture']]}  />
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
                let variableInputObj = {}
                if (user) {
                  variableInputObj = {
                    ...(username && {
                      username
                    }),
                    ...(bio && {
                      bio
                    }),
                    ...(link && {
                      link
                    })
                  }
                } else if (project) {
                  variableInputObj = {
                    ...(projectName && {
                      name: projectName
                    }),
                    ...(bio && {
                      description: bio
                    })
                  }
                }
                saveMutation({
                  variables: {
                    input: variableInputObj
                  }
                })
                // submit({
                //   name: goalText,
                //   detail: description,
                //   priority,
                //   dueDate,
                //   link,
                //   privacyLevel: privacy,
                //   errors,
                //   setErrors,
                //   media,
                //   projectId,
                //   filePrefix: FILE_PREFIX,
                //   mutation: goalMutation,
                //   firstTime,
                //   ...(goal && {
                //     updateId: goal.id,
                //     updateKey: 'goalId'
                //   })
                // })
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
                <SafeImage style={[profileStyles.profileImage, {
                  width: spacingUnit * 12,
                  height: spacingUnit * 12,
                  borderRadius: spacingUnit * 6
                }]} src={profilePicture} />
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
                <ProfilePlaceholder imageStyles={{
                  width: spacingUnit * 12,
                  height: spacingUnit * 12,
                  borderRadius: spacingUnit * 6
                }} projectOwnedByUser={true} />
                <Pressable onPress={() => setChangePhoto(true)}>
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
                    <View style={profileStyles.changeRowContainer}>
                      <Paragraph color={Black} style={profileStyles.changeRowParagraphText}>
                        {user ? 'Username'  : 'Name'}
                      </Paragraph>
                      <TextInput
                          onChangeText={text => user ? setUsername(text) : setProjectName(text)}
                          value={user ? username : projectName}
                          placeholder={user ? 'Username' : 'Project name'}
                          style={profileStyles.changeRowText}
                      />
                      </View>
                      {
                        user &&
                        <View style={profileStyles.changeRowContainer}>
                        <Paragraph color={Black} style={profileStyles.changeRowParagraphText}>
                          Website
                        </Paragraph>
                        <TextInput
                          onChangeText={text => setLink(text)}
                          value={link}
                          placeholder='Add website'
                          style={profileStyles.changeRowText}
                        />
                      </View>
                      }
                      <View style={profileStyles.changeRowContainer}>
                        <Paragraph color={Black} style={profileStyles.changeRowParagraphText}>
                          Bio
                        </Paragraph>
                        <TextInput
                          onChangeText={text => setBio(text)}
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
                            <Paragraph color={Black} style={profileStyles.changeRowParagraphText}>
                              Category
                            </Paragraph>
                            <View style={profileStyles.editRowContainer}>
                            <Paragraph color={Black}>
                              {capitalizeFirstLetter(project.category)}
                            </Paragraph>
                            <Pressable style={{
                              // marginLeft: spacingUnit * 2
                            }} onPress={() => {
                              navigation.navigate('Root', {
                                screen: 'Profile',
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
                          <View style={profileStyles.changeRowContainer}>
                            <Paragraph color={Black} style={profileStyles.changeRowParagraphText}>
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
                              navigation.navigate('Root', {
                                screen: 'Profile',
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
                        </>
                      }
                </View>
            </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  )
}