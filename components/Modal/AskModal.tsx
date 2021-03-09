import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View, StyleSheet, Dimensions, Platform, TextInput, TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native'
import Modal from 'react-native-modal'
import { useQuery } from '@apollo/client'
import DropDownPicker from 'react-native-dropdown-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import { toDate } from 'date-fns'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { TextEditor } from '../../storybook/stories/TextEditor'
import { TextEditorContext } from '../../utils/contexts'
import { Black, White, Blue400, Grey400, Grey800, Grey750, Blue500, Red400, Yellow300 } from '../../constants/Colors'
import { ErrorText, Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { spacingUnit, renderMentionString } from '../../utils/common'
import { endOfWeekFromNow } from '../../utils/date'
import { useMe } from '../../components/withAuth'
import { GET_USER_PROJECTS, GET_GOALS_FROM_PROJECT, GET_GOALS_FROM_USER, GET_TASKS_FROM_USER, GET_TASKS_FROM_PROJECT } from '../../graphql/queries'
import Camera from '../../components/Camera'
import { privacyDropdown, submit, PriorityList, ModalDropdown, DateDisplay, modalStyles, ImageDisplay } from './common'
import CameraIcon from '../../assets/images/camera'
import ImageIcon from '../../assets/images/image'
import LinkIcon from '../../assets/images/link'
import { SafeImage } from '../../storybook/stories/Image'
import ImageBrowser from './ImageBrowser'
import { useNavigation, useRoute } from '@react-navigation/native'

const FILE_PREFIX = 'ask/new/'

export const FullScreenAskModal = ({ ask, isVisible, setModalVisible, projectId, goalId, taskId, askMutation, firstTime, deleteMutation }) => {
  const initialMedia = (ask && ask.additionalData && ask.additionalData.images) || []
  const initialLink = ask && ask.additionalData && ask.additionalData.link
  const initialGoal = (ask && ask.additionalData && ask.additionalData.relatedGoalIds && ask.additionalData.relatedGoalIds[0]) || goalId
  const initialTask = (ask && ask.additionalData && ask.additionalData.relatedTaskIds && ask.additionalData.relatedTaskIds[0]) || taskId
  const route = useRoute()
  const {
    tab
  } = route
  const navigation = useNavigation()
  const [completed, setCompleted] = useState(false)
  const [askText, setAskText] = useState((ask && ask.content) || '')
  const [project, setProject] = useState((ask && ask.projectId) || projectId)
  const [goal, setGoal] = useState(initialGoal)
  const [task, setTask] = useState(initialTask)
  const [link, setLink] = useState(initialLink)
  const [addLink, setAddLink] = useState(!!(link))
  const [media, setMedia] = useState(initialMedia)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [errors, setErrors] = useState({})
  const user = useMe()

  const { data: projectUsers, loading:  projectUserLoading, error: projectUserError } = useQuery(GET_USER_PROJECTS, {
    variables: {
      userId: user && user.id
    }
  })
  const { data: userGoals, loading: userGoalsLoading , error: userGoalsErrorsLoading } = useQuery(GET_GOALS_FROM_USER, {
    fetchPolicy: 'network-only'
  })
  const { data: userTasks, loading: userTasksLoading, error: userTasksErrorsLoading } = useQuery(GET_TASKS_FROM_USER)

  const projectDropdowns = projectUsers && projectUsers.getUserProjects ? projectUsers.getUserProjects.map(projectUser => {
    return {
      label: projectUser.project.name,
      value: projectUser.project.id
    }
  }) : [{
    label: '',
    value: ''
  }]

  let userGoalArr = userGoals && userGoals.getGoalsFromUser
  if (userGoalArr) {
    if (project) {
      userGoalArr = userGoalArr.filter(userGoal => userGoal.projectId === project)
    }
  }

  const userGoalsDropdown = userGoalArr ? userGoalArr.map(userGoal => {
    return {
      label: renderMentionString({ content: userGoal.name, simple: true, navigation, tab }),
      value: userGoal.id
    }
  }) : [{
    label: '',
    value: ''
  }]
  let userTaskArr = userTasks && userTasks.getTasksFromUser
  if (userTaskArr) {
    if (project) {
      userTaskArr = userTaskArr.filter(userTask => userTask.projectId === project)
    }
    if (goal) {
      userTaskArr = userTaskArr.filter(userTask => userTask.goalId === goal)
    }
  }
  let userTasksDropdown = userTaskArr? userTasks.getTasksFromUser.map(userTask => {
    return {
      label: renderMentionString({ content: userTask.name, simple: true, navigation, tab }),
      value: userTask.id
    }
  }) : [{
    label: '',
    value: ''
  }]

  const resetState = useCallback(() => {
    setAskText('')
    setLink(null)
    setAddLink(false)
    setMedia([])
    setCameraOpen(false)
    setGalleryOpen(false)
    setCompleted(false)
    setErrors({})
    if (ask) {
      setAskText((ask && ask.content) || '')
      setLink(initialLink)
      setAddLink(!!initialLink)
      setMedia(initialMedia)
      setCameraOpen(false)
      setGalleryOpen(false)
      setCompleted(ask && ask.status === 'completed')
    }
  }, [])
  return (
    <Modal isVisible={isVisible}>
      {
        galleryOpen
        ?
        <ImageBrowser setImageBrowser={setGalleryOpen} media={media} navigation={navigation} setMedia={setMedia} imagePrefix={FILE_PREFIX} />
        :
        <TouchableWithoutFeedback
          onPress={() => Keyboard.dismiss()}
        >
          <SafeAreaView style={modalStyles.fullScreenContainer}>
          <KeyboardAwareScrollView keyboardDismissMode='interactive' keyboardShouldPersistTaps='handled'>
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
              <Pressable onPress={() => {
                if (ask) {
                  resetState()
                  setModalVisible(false)
                } else {
                  setModalVisible(false)
                }
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
                  fontSize: 24
                }}>
                  {ask ? 'Edit' : 'New'} ask
                </Subheading>
              </View>
              <View style={{
                flex: 1,
              }}>
              <Pressable style={modalStyles.createUpdateButton} onPress={() => {
                let relatedGoalIds = []
                let relatedTaskIds = []
                if (goal) {
                  relatedGoalIds = [goal]
                }
                if (task) {
                  relatedTaskIds = [task]
                }
                submit({
                  type: 'ask',
                  content: askText,
                  link,
                  errors,
                  setErrors,
                  media,
                  projectId: project,
                  filePrefix: FILE_PREFIX,
                  mutation: askMutation,
                  relatedGoalIds,
                  relatedTaskIds,
                  ...(ask && {
                    updateId: ask.id,
                    updateKey: 'askId'
                  }),
                  firstTime
                })
                setModalVisible(false)
                if (!ask) {
                  resetState()
                }
              }}>
                <RegularText color={White} style={{
                  fontSize: 16
                }}>
                  {ask ? 'Update': 'Create' }
                </RegularText>
              </Pressable>
            </View>
            </View>
            <View style={modalStyles.infoContainer}>
              <View style={modalStyles.inputContainer}>
              <TextEditorContext.Provider value={{
                  content: askText,
                  setContent: setAskText,
                  placeholder: 'Add ask...'
                }}>
                  <View style={{flex: 1}}>
                <TextEditor autoFocus multiline style={modalStyles.nameTextInput}
                renderSuggestionStyle={modalStyles.renderSuggestion}
                />
                </View>
                </TextEditorContext.Provider>
              </View>
              <View style={modalStyles.editContainer}>
                  {
                    errors && errors.nameError &&
                    <ErrorText>
                      {errors.nameError}
                    </ErrorText>
                  }
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
                    // NEW
                    Platform.OS !== 'android' && {
                      zIndex: 4000
                    }
                  ]}>
                    <View style={modalStyles.editRowTextContainer}>
                      <RegularText color={Grey800} style={modalStyles.editRowText}>
                        Goal
                      </RegularText>
                    </View>
                    <ModalDropdown value={goal} setValue={setGoal} items={userGoalsDropdown} placeholder='Select a goal' />
                  </View>
                  <View style={[
                    modalStyles.editRowContainer,
                    Platform.OS !== 'android' && {
                      zIndex: 3000
                    }
                  ]}>
                    <View style={modalStyles.editRowTextContainer}>
                      <RegularText color={Grey800} style={modalStyles.editRowText}>
                        Task
                      </RegularText>
                    </View>
                    <ModalDropdown value={task} setValue={setTask} items={userTasksDropdown} placeholder='Select a task' />
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
                  <ScrollView keyboardDismissMode='interactive' keyboardShouldPersistTaps='handled'>
                    {addLink &&
                      <View style={modalStyles.linkContainer}>
                        <TextInput
                        autoCapitalize="none"
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
                          <ImageDisplay setMedia={setMedia} media={media} image={image} imagePrefix={FILE_PREFIX} />
                        ))}
                      </View>
                    }
                  </ScrollView>
              </View>
            </View>
            </KeyboardAwareScrollView>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      }
    </Modal>
  )
}