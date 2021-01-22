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
import { spacingUnit } from '../../utils/common'
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
  const initialLink = user && user.link
  const initialBio = (user && user.bio) || (project && project.description)
  const initialProfilePicture = (user && user.profilePicture) || (project && project.profilePicture)

  const [username, setUsername] = useState(initialUsername)
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
                if (user) {
                  console.log('bio', bio, link, username)
                  saveMutation({
                    variables: {
                      input: {
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
                    }
                  })
                }
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
                        Username
                      </Paragraph>
                      <TextInput
                          onChangeText={text => setUsername(text)}
                          value={username}
                          placeholder='Username'
                          style={profileStyles.changeRowText}
                      />
                      </View>
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
                </View>
            </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  )
}