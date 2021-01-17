import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View, StyleSheet, Dimensions, Platform, TextInput, TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native'
import Modal from 'react-native-modal'
import { useQuery } from '@apollo/client'
import DropDownPicker from 'react-native-dropdown-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import { toDate } from 'date-fns'

import { Black, White, Blue400, Grey400, Grey800, Grey750, Blue500, Red400, Yellow300 } from '../../constants/Colors'
import { ErrorText, Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { spacingUnit } from '../../utils/common'
import { endOfWeekFromNow } from '../../utils/date'
import { useMe } from '../../components/withAuth'
import { GET_USER_PROJECTS } from '../../graphql/queries/project'
import Camera from '../../components/Camera'
import { privacyDropdown, submit, PriorityList, ModalDropdown, DateDisplay, modalStyles } from './common'
import CameraIcon from '../../assets/images/camera'
import ImageIcon from '../../assets/images/image'
import LinkIcon from '../../assets/images/link'
import { SafeImage } from '../../storybook/stories/Image'
import ImageBrowser from './ImageBrowser'
import { useNavigation } from '@react-navigation/native'

const FILE_PREFIX = 'goal/new/'

export const FullScreenGoalModal = ({ goal, setup, isVisible, setModalVisible, projectId, goalMutation }) => {
  const initialDueDate = endOfWeekFromNow()
  const navigation = useNavigation()
  const [completed, setCompleted] = useState(false)
  const [goalText, setGoalText] = useState(goal && goal.name)
  const [project, setProject] = useState((goal && goal.projectId) || projectId)
  const [priority, setPriority] = useState(goal && goal.priority)
  const [description, setDescription] = useState(goal && goal.description)
  const [privacy, setPrivacy] = useState('public')
  const [dueDate, setDueDate] = useState((goal && goal.dueDate) ? new Date(goal.dueDate) : toDate(initialDueDate))
  const [editDate, setEditDate] = useState(false)
  const [link, setLink] = useState(goal && goal.additionalData && goal.additionalData.link)
  const [addLink, setAddLink] = useState(!!(link))
  const [media, setMedia] = useState((goal && goal.additionalData && goal.additionalData.images) || [])
  const [cameraOpen, setCameraOpen] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [errors, setErrors] = useState({})

  const user = useMe()
  const { data: projectUsers, loading, error } = useQuery(GET_USER_PROJECTS)
  const projectDropdowns = projectUsers && projectUsers.getUserProjects ? projectUsers.getUserProjects.map(projectUser => {
    return {
      label: projectUser.project.name,
      value: projectUser.project.id
    }
  }) : [{
    label: '',
    value: ''
  }]

  const resetState = useCallback(() => {
    setGoalText('')
    setPriority(null)
    setLink(null)
    setAddLink(null)
    setMedia([])
    setCameraOpen(false)
    setGalleryOpen(false)
    setDueDate(toDate(endOfWeekFromNow()))
    setDescription('')
    setCompleted(false)
  }, [])

  return (
    <Modal isVisible={isVisible}>
      {
        galleryOpen
        ?
        <ImageBrowser setImageBrowser={setGalleryOpen} media={media} navigation={navigation} setMedia={setMedia} imagePrefix={FILE_PREFIX} />
      :
      <TouchableWithoutFeedback 
      onPress={() => Keyboard.dismiss()}>
          <SafeAreaView style={modalStyles.fullScreenContainer}>
            {cameraOpen &&
                    <Camera
                    snapperOpen={cameraOpen}
                  setSnapperOpen={setCameraOpen}
                    setImage={(image) => {
                      if (media && media.length < 4) {
                        setMedia([...media, image])
                      } else {
                        setErrors({
                          ...errors,
                          mediaError: 'Only a maximum of 4 images allowed'
                        })
                      }
                    }}
                    filePrefix={FILE_PREFIX}
                  />
            }
            <View style={modalStyles.topRowContainer}>
              <Pressable onPress={() => setModalVisible(false)} style={{
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
                  fontSize: 24
                }}>
                  {goal ? 'Edit' : 'New'} goal
                </Subheading>
              </View>
              <View style={{
                flex: 1,
              }}>
              <Pressable style={modalStyles.createUpdateButton} onPress={() => {
                submit({
                  name: goalText,
                  detail: description,
                  priority,
                  dueDate,
                  link,
                  privacyLevel: privacy,
                  errors,
                  setErrors,
                  media,
                  projectId,
                  filePrefix: FILE_PREFIX,
                  mutation: goalMutation,
                  ...(goal && {
                    goalId: goal.id
                  })
                })
                setModalVisible(false)
              }}>
                <RegularText color={White} style={{
                  fontSize: 16
                }}>
                  {goal ? 'Update': 'Create' }
                </RegularText>
              </Pressable>
            </View>
            </View>
            <View style={modalStyles.infoContainer}>
              <View style={modalStyles.inputContainer}>
                <TextInput
                  multiline
                  onChangeText={text => setGoalText(text)}
                  value={goalText}
                  autoFocus={!(goalText)}
                  placeholder='Add goal...'
                  style={modalStyles.title}
                />
              </View>
              <View style={modalStyles.editContainer}>
                  <View style={[
                    modalStyles.editRowContainer,
    
                    // NEW
                    Platform.OS !== 'android' && {
                      zIndex: 5000
                    }
                  ]}>
                    <View style={modalStyles.editRowTextContainer}>
                      <RegularText color={Grey800} style={modalStyles.editRowText}>
                        Project
                      </RegularText>
                    </View>
                    <ModalDropdown value={project} setValue={setProject} defaultValue={projectId} items={projectDropdowns} placeholder='Select a project' zIndex={5000} />
                  </View>
                  <View style={[
                    modalStyles.editRowContainer,
                    Platform.OS !== 'android' && {
                      zIndex: 4000
                    }
                  ]}>
                    <View style={modalStyles.editRowTextContainer}>
                      <RegularText color={Grey800} style={modalStyles.editRowText}>
                        Privacy
                      </RegularText>
                    </View>
                    <ModalDropdown value={privacy} items={privacyDropdown} zIndex={4000} setValue={setPrivacy} placeholder='Select privacy level' />
                  </View>
                  <View style={modalStyles.editRowContainer}>
                    <View style={modalStyles.editRowTextContainer}>
                      <RegularText color={Grey800} style={modalStyles.editRowText}>
                        Priority
                      </RegularText>
                    </View>
                    <PriorityList priority={priority} setPriority={setPriority} />
                  </View>
                  <View style={modalStyles.editRowContainer}>
                        <View style={modalStyles.editRowTextContainer}>
                          <RegularText color={Grey800} style={modalStyles.editRowText}>
                            Due
                          </RegularText>
                        </View>
                        <DateDisplay dueDate={dueDate} onDateChange={setDueDate} editDate={editDate} setEditDate={setEditDate} />
                    </View>
                  <View style={[modalStyles.editRowContainer, {
                    marginBottom: spacingUnit * 2
                  }]}>
                    <TextInput
                      multiline
                      onChangeText={text => setDescription(text)}
                      value={description}
                      placeholder='Longer description...'
                      style={modalStyles.descriptionBox}
                    />
                  </View>
                  <View style={modalStyles.attachmentRow}>
                    <LinkIcon color={Grey800} style={{
                      marginRight: spacingUnit * 2
                    }} onPress={() => setAddLink(true)} />
                    <CameraIcon onPress={() => setCameraOpen(true)} color={Grey800} style={{
                      marginRight: spacingUnit * 2
                    }} />
                    <ImageIcon color={Grey800} onPress={() => setGalleryOpen(true)} />
                  </View>
                  {
                    errors.mediaError &&
                    <ErrorText>
                      {error.mediaError}
                    </ErrorText>
                  }
                  <ScrollView>
                    {addLink &&
                      <View style={modalStyles.linkContainer}>
                        <TextInput
                          onChangeText={text => setLink(text)}
                          value={link}
                          autoFocus={!(link)}
                          placeholder='Add link'
                          style={modalStyles.link}
                        />
                      </View>
                    }
                    {
                      media && 
                      <View style={modalStyles.mediaRows}>
                        {media.map(image => (
                          <SafeImage key={image} src={image} style={modalStyles.mediaItem} />
                        ))}
                      </View>
                    }
                  </ScrollView>
              </View>
            </View>
          </SafeAreaView>
          </TouchableWithoutFeedback>
      }
    </Modal>
  )
}
