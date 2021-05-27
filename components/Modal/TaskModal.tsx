import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View, StyleSheet, Dimensions, Platform, TextInput, TouchableWithoutFeedback, Keyboard, Pressable, ActivityIndicator } from 'react-native'
import Modal from 'react-native-modal'
import isEqual from 'lodash.isequal'

import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import DropDownPicker from 'react-native-dropdown-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import { toDate } from 'date-fns'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { TextEditor } from '../../storybook/stories/TextEditor'
import { TextEditorContext } from '../../utils/contexts'
import { Black, White, Blue400, Grey400, Grey800, Grey750, Blue500, Red400, Yellow300, Green400 } from '../../constants/Colors'
import { ErrorText, Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { spacingUnit, renderMentionString, usePrevious } from '../../utils/common'
import { endOfWeekFromNow } from '../../utils/date'
import { useMe } from '../../components/withAuth'
import { GET_USER_PROJECTS } from '../../graphql/queries/project'
import { GET_GOALS_FROM_PROJECT, GET_GOALS_FROM_USER } from '../../graphql/queries/goal'
import Camera from '../../components/Camera'
import { privacyDropdown, submit, PriorityList, ModalDropdown, DateDisplay, modalStyles, ImageDisplay, pickVideo, VideoThumbnail } from './common'
import CameraIcon from '../../assets/images/camera'
import ImageIcon from '../../assets/images/image'
import LinkIcon from '../../assets/images/link'
import { SafeImage } from '../../storybook/stories/Image'
import ImageBrowser from './ImageBrowser'
import { useNavigation, useRoute } from '@react-navigation/native'
import Checkmark from '../../assets/images/checkmark'
import VideoIcon from '../../assets/images/video'
import { VideoDisplay } from '../../storybook/stories/Carousel'
import { ACTION_QUERY_LIMIT } from '../../constants'
import { COMPLETE_TASK } from '../../graphql/mutations'
import { GET_USER_STREAK } from '../../graphql/queries'

const FILE_PREFIX = 'tmp/task/new/'

export const FullScreenTaskModal = ({ task, isVisible, setModalVisible, projectId, goalId, taskMutation, firstTime, completeTaskMutation }) => {
  const initialDueDate = endOfWeekFromNow()
  const navigation = useNavigation()
  const route = useRoute()
  const {
    tab
  } = route
  const [archived, setArchived] = useState(task && task.status === 'archived')
  const [completed, setCompleted] = useState(task && task.status === 'completed')
  const [taskText, setTaskText] = useState((task && task.name) || '')
  const [project, setProject] = useState((task && task.projectId) || projectId || '')
  const previousProject = usePrevious(project)
  const [goal, setGoal] = useState((task && task.goalId) || goalId || '')
  const [priority, setPriority] = useState(task && task.priority)
  const [description, setDescription] = useState((task && task.detail) || '')
  const [privacy, setPrivacy] = useState('public')
  const [dueDate, setDueDate] = useState((task && task.dueDate) ? new Date(task.dueDate) : toDate(initialDueDate))
  const [editDate, setEditDate] = useState(false)
  const [link, setLink] = useState(task && task.additionalData && task.additionalData.link)
  const [addLink, setAddLink] = useState(!!(link))
  const [media, setMedia] = useState((task && task.additionalData && task.additionalData.images) || [])
  const [cameraOpen, setCameraOpen] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [video, setVideo] = useState(task && task.muxPlaybackId || null)
  const [videoUploading, setVideoUploading] = useState(null)
  const [imageUploading, setImageUploading] = useState(null)
  const [errors, setErrors] = useState({})
  const user = useMe()
  const [projectUsers, setProjectUsers] = useState(null)
  const [userGoals, setUserGoals] = useState(null)
  const [projectGoals, setProjectGoals] = useState(null)
  const previousVisible = usePrevious(isVisible)
  const [getUserProjects, { data: projectUserData, loading:  projectUserLoading, error: projectUserError }] = useLazyQuery(GET_USER_PROJECTS, {
    variables: {
      userId: user?.id
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

  const [getProjectGoals, {data: projectGoalData}] = useLazyQuery(GET_GOALS_FROM_PROJECT, {
    fetchPolicy: 'network-only',
  })

  const projectDropdowns = projectUsers && projectUsers.getUserProjects ? projectUsers.getUserProjects.map(projectUser => {
    return {
      label: projectUser.project.name,
      value: projectUser.project.id
    }
  }) : [{
    label: 'Select a project',
    value: ''
  }]

  useEffect(() => {
    if (isVisible && !previousVisible) {
      getUserGoals()
      getUserProjects()
    }
    if (project && previousProject !== project) {
      getProjectGoals({
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
    if (task?.projectId) {
      setProject(task?.projectId)
    }
    if (projectId) {
      setProject(projectId)
    }
    if (task?.goalId || goalId) {
      setGoal(task?.goalId || goalId)
    }
  }, [isVisible, project, userGoalData, projectGoalData, projectUserData, task?.projectId, projectId, task?.goalId, goalId])
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
  const resetState = useCallback(() => {
    setTaskText('')
    setPriority(null)
    setLink(null)
    setAddLink(false)
    setMedia([])
    setCameraOpen(false)
    setGalleryOpen(false)
    setDueDate(toDate(endOfWeekFromNow()))
    setDescription('')
    setCompleted(false)
    setErrors({})
    setVideo(null)
    if (task) {
      setTaskText((task && task.name) || '')
      setPriority(task && task.priority)
      setLink(task && task.additionalData && task.additionalData.link)
      setAddLink(!!(task && task.additionalData && task.additionalData.link))
      setMedia((task && task.additionalData && task.additionalData.images) || [])
      setCameraOpen(false)
      setGalleryOpen(false)
      setProject(task?.projectId || projectId)
      setDueDate((task && task.dueDate) ? new Date(task.dueDate) : toDate(initialDueDate))
      setDescription((task && task.detail) || '')
      setCompleted(task && task.status === 'completed')
      setVideo(task && task.muxPlaybackId || null)
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
          <KeyboardAwareScrollView>
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
                if (task) {
                  resetState()
                  setModalVisible(false)
                } else {
                  setProject(projectId || '')
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
                  {task ? 'Edit' : 'New'} task
                </Subheading>
              </View>
              <View style={{
                flex: 1,
              }}>
              <Pressable style={{
                ...modalStyles.createUpdateButton,
                backgroundColor: (imageUploading || videoUploading) ? Grey800 : Blue500
              }} onPress={async () => {
                if (videoUploading) {
                  setErrors({
                    submitError: 'Videos are still uploading!'
                  })
                } else if (imageUploading){
                  setErrors({
                    submitError: 'Images are still uploading!'
                  })
                } else if (!project) {
                  setErrors({
                    createError: 'Project is required'
                  })
                } else {
                  let finalStatus = 'created'
                  if (archived) {
                    finalStatus = 'archived'
                  }
                  if (completed && task && task?.status !== 'completed') {
                    try {
                      await completeTaskMutation({
                        variables: {
                          taskId: task?.id
                        }
                      })
                    } catch (err) {
                      console.error('Cannot complete task')
                    }
                  }
                  submit({
                    name: taskText,
                    detail: description,
                    ...(!completed && {
                      status: finalStatus,
                    }),
                    priority,
                    dueDate,
                    link,
                    privacyLevel: privacy,
                    errors,
                    setErrors,
                    media,
                    projectId: project,
                    filePrefix: FILE_PREFIX,
                    mutation: taskMutation,
                    goalId: goal,
                    video,
                    ...(task && {
                      updateId: task.id,
                      updateKey: 'taskId'
                    }),
                    ...(!task && {
                      completed
                    }),
                    firstTime
                  })
                  setModalVisible(false)
                  if (!task) {
                    resetState()
                  }
                }
              }}>
                <RegularText color={White} style={{
                  fontSize: 16
                }}>
                  {task ? 'Update': 'Create' }
                </RegularText>
              </Pressable>
            </View>
            </View>
            <View style={modalStyles.infoContainer}>
              <View style={modalStyles.inputContainer}>
              <TextEditorContext.Provider value={{
                  content: taskText,
                  setContent: setTaskText,
                  placeholder: 'Add task...'
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
                  errors?.createError &&
                  <ErrorText style={{
                    ...modalStyles.errorText,
                    marginTop: 0
                  }}>
                    {errors.createError}
                  </ErrorText>
                }
                  {
                    errors && errors.nameError &&
                    <ErrorText style={{
                      ...modalStyles.errorText,
                      marginTop: 0
                    }}>
                      {errors.nameError}
                    </ErrorText>
                  }
                  <View style={modalStyles.completeContainer}>
                  {
                    completed
                    ?
                    <Pressable style={modalStyles.completedButton}>
                      <Paragraph color={White} style={{
                        marginRight: spacingUnit * 0.4
                      }}>
                        Task Completed
                      </Paragraph>
                      <Checkmark color={White} style={{
                        width: 20,
                        height: 20
                      }}/>
                    </Pressable>
                    :
                    <Pressable style={modalStyles.markAsCompleteButton} onPress={() => {
                      if (!archived) {
                        setCompleted(true)
                      }
                    }}>
                      <Paragraph color={Green400}>
                        Mark as complete
                      </Paragraph>
                    </Pressable>
                  }
                  {
                    task &&
                    <>
                    {
                      archived 
                      ?
                      <Pressable style={modalStyles.archivedButton} onPress={() => setArchived(false)}>
                        <Paragraph color={White}>
                          Archived
                        </Paragraph>
                      </Pressable>
                      :
                      <Pressable style={modalStyles.markAsArchivedButton} onPress={() => {
                        if (!completed) {
                          setArchived(true)
                        }
                      }}>
                        <Paragraph color={Grey800}>
                          Mark as archived
                        </Paragraph>
                      </Pressable>
                    }
                    </>
                  }
                  </View>
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
                    <ModalDropdown value={projectUsers?.getUserProjects ? project : ''} setValue={setProject} items={projectDropdowns} placeholder='Select a project' zIndex={5000} />
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
                  {/* <View style={[
                    modalStyles.editRowContainer,
                    Platform.OS !== 'android' && {
                      zIndex: 3000
                    }
                  ]}>
                    <View style={modalStyles.editRowTextContainer}>
                      <RegularText color={Grey800} style={modalStyles.editRowText}>
                        Privacy
                      </RegularText>
                    </View>
                    <ModalDropdown value={privacy} items={privacyDropdown} zIndex={4000} setValue={setPrivacy} placeholder='Select privacy level' />
                  </View> */}
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
                    <TextEditorContext.Provider value={{
                          content: description,
                          setContent: setDescription,
                          placeholder: 'Longer description'
                        }}>
                          <View style={{flex: 1}}>
                        <TextEditor multiline style={modalStyles.descriptionBox} renderSuggestionStyle={modalStyles.renderSuggestion}
                    />
                    </View>
                    </TextEditorContext.Provider>
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
                      setCameraOpen(true)
                    }} color={Grey800} style={{
                      marginRight: spacingUnit * 2
                    }} />
                    <ImageIcon color={Grey800} onPress={() => {
                      setGalleryOpen(true)
                      setErrors({
                        ...errors,
                        mediaError: null
                      })
                    }} style={{
                      marginRight: spacingUnit * 2
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