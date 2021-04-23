import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View, StyleSheet, Dimensions, Platform, TextInput, TouchableWithoutFeedback, Keyboard, Pressable, ActivityIndicator } from 'react-native'
import Modal from 'react-native-modal'
import { useLazyQuery } from '@apollo/client'
import DropDownPicker from 'react-native-dropdown-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import { toDate } from 'date-fns'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { TextEditor } from '../../storybook/stories/TextEditor'
import { TextEditorContext } from '../../utils/contexts'
import { Black, White, Blue400, Grey400, Grey800, Grey750, Blue500, Red400, Yellow300 } from '../../constants/Colors'
import { ErrorText, Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { spacingUnit, renderMentionString, usePrevious } from '../../utils/common'
import { endOfWeekFromNow } from '../../utils/date'
import { useMe } from '../../components/withAuth'
import { GET_USER_PROJECTS, GET_GOALS_FROM_PROJECT, GET_GOALS_FROM_USER, GET_TASKS_FROM_USER, GET_TASKS_FROM_PROJECT } from '../../graphql/queries'
import Camera from '../../components/Camera'
import { privacyDropdown, submit, PriorityList, ModalDropdown, DateDisplay, modalStyles, ImageDisplay, pickVideo, VideoThumbnail } from './common'
import CameraIcon from '../../assets/images/camera'
import ImageIcon from '../../assets/images/image'
import LinkIcon from '../../assets/images/link'
import { SafeImage } from '../../storybook/stories/Image'
import ImageBrowser from './ImageBrowser'
import { useNavigation, useRoute } from '@react-navigation/native'
import VideoIcon from '../../assets/images/video'
import { VideoDisplay } from '../../storybook/stories/Carousel'
import { ACTION_QUERY_LIMIT } from '../../constants'

const FILE_PREFIX = 'tmp/ask/new/'

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
  const previousProject = usePrevious(project)
  const [goal, setGoal] = useState(initialGoal)
  const [task, setTask] = useState(initialTask)
  const [link, setLink] = useState(initialLink)
  const [addLink, setAddLink] = useState(!!(link))
  const [media, setMedia] = useState(initialMedia)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [video, setVideo] = useState(goal && goal.muxPlaybackId || null)
  const [videoUploading, setVideoUploading] = useState(null)
  const [imageUploading, setImageUploading] = useState(null)
  const [errors, setErrors] = useState({})
  const user = useMe()
  const [projectUsers, setProjectUsers] = useState(null)
  const [userGoals, setUserGoals] = useState(null)
  const [projectGoals, setProjectGoals] = useState(null)
  const [userTasks, setUserTasks] = useState(null)
  const [projectTasks, setProjectTasks] = useState(null)
  const previousVisible = usePrevious(isVisible)

  const [getUserProjects, { data: projectUserData, loading:  projectUserLoading, error: projectUserError }] = useLazyQuery(GET_USER_PROJECTS, {
    variables: {
      userId: user && user.id
    },
    fetchPolicy: 'network-only'
  })
  const [getUserGoals, { data: userGoalData, loading: userGoalsLoading , error: userGoalsErrorsLoading }] = useLazyQuery(GET_GOALS_FROM_USER, {
    fetchPolicy: 'network-only',
    variables: {
      userId: user?.id,
      status: 'created',
      limit: ACTION_QUERY_LIMIT
    },
  })
  const [getUserTasks, { data: userTaskData, loading: userTasksLoading, error: userTasksErrorsLoading }] = useLazyQuery(GET_TASKS_FROM_USER, {
    fetchPolicy: 'network-only',
    variables: {
      userId: user?.id,
      status: 'created',
      limit: ACTION_QUERY_LIMIT
    },
  })

  const [getProjectGoals, { data: projectGoalData }] = useLazyQuery(GET_GOALS_FROM_PROJECT, {
    fetchPolicy: 'network-only'
  })

  const [getProjectTasks, {data: projectTaskData }] = useLazyQuery(GET_TASKS_FROM_PROJECT, {
    fetchPolicy: 'network-only'
  })

  const projectDropdowns = projectUsers && projectUsers.getUserProjects ? projectUsers.getUserProjects.map(projectUser => {
    return {
      label: projectUser.project.name,
      value: projectUser.project.id
    }
  }) : [{
    label: '',
    value: ''
  }]

  useEffect(() => {
    if (isVisible && !previousVisible) {
      getUserGoals()
      getUserProjects()
      getUserTasks()
    }
    if (project && previousProject !== project) {
      getProjectGoals({
        variables: {
          projectId: project,
          status: 'created',
          limit: ACTION_QUERY_LIMIT
        }
      })
      getProjectTasks({
        variables: {
          projectId: project,
          status: 'created',
          limit: ACTION_QUERY_LIMIT
        }
      })
    }
    if (projectGoalData) {
      setProjectGoals(projectGoalData.getGoalsFromProject)
    }
    if (userGoalData) {
      setUserGoals(userGoalData.getGoalsFromUser)
    }
    if (projectUserData) {
      setProjectUsers(projectUserData)
    }
    if (userTaskData) {
      setUserTasks(userTaskData.getTasksFromUser)
    }
    if (projectTaskData) {
      setProjectTasks(projectTaskData.getTasksFromProject)
    }
  }, [isVisible, project, userTaskData, userGoalData, projectGoalData, projectUserData, projectTaskData])

  let userGoalArr = userGoals
  if (project) {
    userGoalArr = projectGoals
  } else {
    userGoalArr = [{
      label: 'Please select a project',
      value: ''
    }]
  }
  let userGoalsDropdown = userGoalArr ? userGoalArr.map(userGoal => {
    return {
      label: renderMentionString({ content: userGoal.name, simple: true, navigation, tab }),
      value: userGoal.id
    }
  }) : [{
    label: '',
    value: ''
  }]

  let userTaskArr = userTasks
  if (project) {
    userTaskArr = projectTasks
    if (goal) {
      userTaskArr = userTaskArr?.filter(userTask => userTask.goalId === goal)
    }
  } else {
    userTaskArr = [{
      label: '',
      value: ''
    }]
  }
  let userTasksDropdown = userTaskArr? userTaskArr.map(userTask => {
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
    setVideo(null)
    if (ask) {
      setAskText((ask && ask.content) || '')
      setLink(initialLink)
      setAddLink(!!initialLink)
      setMedia(initialMedia)
      setCameraOpen(false)
      setGalleryOpen(false)
      setCompleted(ask && ask.status === 'completed')
      setVideo(ask && ask.muxPlaybackId || null)
    }
  }, [])
  return (
    <Modal isVisible={isVisible}>
      {
        galleryOpen
        ?
        <ImageBrowser setImageBrowser={setGalleryOpen} media={media} navigation={navigation} setMedia={setMedia} imagePrefix={FILE_PREFIX} setImageUploading={setImageUploading} />
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
                    setVideo={setVideo} 
                    setVideoUploading={setVideoUploading}
                    setImageUploading={setImageUploading}
                    setErrors={setErrors}
                  />
            }
            <View style={modalStyles.topRowContainer}>
              <Pressable onPress={() => {
                if (ask) {
                  resetState()
                  setModalVisible(false)
                } else {
                  setProject(null)
                  setGoal(null)
                  setTask(null)
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
              <Pressable style={{
                ...modalStyles.createUpdateButton,
                backgroundColor: (imageUploading || videoUploading) ? Grey800 : Blue500
              }} onPress={() => {
                if (videoUploading) {
                  setErrors({
                    submitError: 'Videos are still uploading!'
                  })
                } else if (imageUploading) {
                  setErrors({
                    submitError: 'Images are still uploading!'
                  })
                } else {
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
                    video,
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
                    <CameraIcon onPress={() => {
                      setErrors({
                        ...errors,
                        mediaError: null
                      })
                      setCameraOpen(true)}
                    } color={Grey800} style={{
                      marginRight: spacingUnit * 2
                    }} />
                    <ImageIcon color={Grey800} style={{
                      marginRight: spacingUnit * 2
                    }} onPress={() => {
                      setErrors({
                        ...errors,
                        mediaError: null
                      })
                      setGalleryOpen(true)
                      }} />
                    <VideoIcon color={Grey800} onPress={() => {
                      setErrors({
                        ...errors,
                        mediaError: null
                      })
                      pickVideo({ setVideo, video, errors, setErrors, videoUploading, setVideoUploading })
                    }} />
                  </View>
                  {
                    errors.mediaError &&
                    <ErrorText style={modalStyles.errorText}>
                      {errors.mediaError}
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
                          videoUploading &&
                          <View style={{
                            marginTop: spacingUnit * 2
                          }}>
                             <ActivityIndicator />
                             <RegularText color={Grey800} style={{
                               textAlign: 'center'
                             }}>
                               Video uploading...
                             </RegularText>
                           </View>
                    }
                    {
                      imageUploading &&
                      <View style={{
                        marginTop: spacingUnit * 2
                      }}>
                         <ActivityIndicator />
                         <RegularText color={Grey800} style={{
                           textAlign: 'center'
                         }}>
                           Image uploading...
                         </RegularText>
                       </View>
                    }
                    {
                      (media || video) &&
                      <View style={modalStyles.mediaRows}>
                        {
                          !!(video) &&
                          <VideoThumbnail source={video} setVideo={setVideo} video={video} errors={errors} setErrors={setErrors} filePrefix={FILE_PREFIX} videoUploading={videoUploading} setVideoUploading={setVideoUploading} />
                        }
                        {media.map(image => (
                          <ImageDisplay setMedia={setMedia} media={media} image={image} imagePrefix={FILE_PREFIX} setImageUploading={setImageUploading} />
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