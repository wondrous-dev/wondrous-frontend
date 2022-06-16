import React, { useCallback, useState } from 'react'
import { SafeAreaView, ScrollView, View, Platform, TextInput, TouchableWithoutFeedback, Keyboard, Pressable, ActivityIndicator } from 'react-native'
import Modal from 'react-native-modal'
import { useQuery } from '@apollo/client'
import { toDate } from 'date-fns'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { TextEditor } from '../../storybook/stories/TextEditor'
import { TextEditorContext } from '../../utils/contexts'
import palette from 'theme/palette'
import { ErrorText, Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { spacingUnit, getLocale } from '../../utils/common'
import { endOfWeekFromNow } from '../../utils/date'
import { useMe } from '../../components/withAuth'
import { GET_USER_PROJECTS } from '../../graphql/queries/project'
import Camera from '../../components/Camera'
import { privacyDropdown, submit, PriorityList, ModalDropdown, DateDisplay, modalStyles, ImageDisplay, pickVideo, VideoThumbnail } from './common'
import CameraIcon from '../../assets/images/camera'
import ImageIcon from '../../assets/images/image'
import LinkIcon from '../../assets/images/link'
import ImageBrowser from './ImageBrowser'
import { useNavigation } from '@react-navigation/native'
import VideoIcon from '../../assets/images/video'
import Checkmark from '../../assets/images/checkmark'

const FILE_PREFIX = 'tmp/goal/new/'

export const FullScreenGoalModal = ({ goal, setup, isVisible, setModalVisible, projectId, goalMutation, firstTime, completeGoalMutation }) => {
  const initialDueDate = endOfWeekFromNow()
  const navigation = useNavigation()
  const [archived, setArchived] = useState(goal && goal.status === 'archived')
  const [completed, setCompleted] = useState(goal && goal.status === 'completed')
  const [goalText, setGoalText] = useState((goal && goal.name) || '')
  const [project, setProject] = useState((goal && goal.projectId) || projectId)
  const [priority, setPriority] = useState(goal && goal.priority)
  const [description, setDescription] = useState((goal && goal.detail) || '')
  const [privacy, setPrivacy] = useState('public')
  const [dueDate, setDueDate] = useState((goal && goal.dueDate) ? new Date(goal.dueDate) : toDate(initialDueDate))
  const [editDate, setEditDate] = useState(false)
  const [link, setLink] = useState(goal && goal.additionalData && goal.additionalData.link)
  const [addLink, setAddLink] = useState(!!(link))
  const [media, setMedia] = useState((goal && goal.additionalData && goal.additionalData.images) || [])
  const [cameraOpen, setCameraOpen] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [errors, setErrors] = useState({})
  const [video, setVideo] = useState(goal && goal.muxPlaybackId || null)
  const [videoUploading, setVideoUploading] = useState(null)
  const [imageUploading, setImageUploading] = useState(null)
  const user = useMe()
  const { data: projectUsers, loading, error } = useQuery(GET_USER_PROJECTS, {
    variables: {
      userId: user && user.id
    }
  })
  const projectDropdowns = projectUsers && projectUsers.getUserProjects ? projectUsers.getUserProjects.map(projectUser => {
    return {
      label: projectUser.project && projectUser.project.name,
      value: projectUser.project && projectUser.project.id
    }
  }) : [{
    label: '',
    value: ''
  }]
  const resetState = useCallback(() => {
    setGoalText('')
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
    if (goal) {
      setGoalText((goal && goal.name) || '')
      setPriority(goal && goal.priority)
      setLink(goal && goal.additionalData && goal.additionalData.link)
      setAddLink(!!(goal && goal.additionalData && goal.additionalData.link))
      setMedia((goal && goal.additionalData && goal.additionalData.images) || [])
      setCameraOpen(false)
      setGalleryOpen(false)
      setDueDate((goal && goal.dueDate) ? new Date(goal.dueDate) : toDate(initialDueDate))
      setDescription((goal && goal.detail) || '')
      setCompleted(goal && goal.status === 'completed')
      setVideo(goal && goal.muxPlaybackId || null)
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
      onPress={() => Keyboard.dismiss()}>
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
                if (goal) {
                  resetState()
                  setModalVisible(false)
                } else {
                  setModalVisible(false)
                }
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
                  fontSize: 24
                }}>
                  {goal ? 'Edit' : 'New'} goal
                </Subheading>
              </View>
              <View style={{
                flex: 1,
              }}>
              <Pressable style={{
                ...modalStyles.createUpdateButton,
                backgroundColor: (imageUploading || videoUploading) ? palette.grey800 : palette.blue500
              }} onPress={async () => {
                if (!project) {
                  setErrors({
                    createError: 'Project is required'
                  })
                } else if (videoUploading) {
                  setErrors({
                    submitError: 'Videos are still uploading!'
                  })
                } else if (imageUploading) {
                  setErrors({
                    submitError: 'Images are still uploading!'
                  })
                } else {
                  let finalStatus = 'created'
                  if (archived) {
                    finalStatus = 'archived'
                  }
                  if (completed && goal && goal?.status !== 'completed') {
                    try {
                      await completeGoalMutation({
                        variables: {
                          goalId: goal?.id,
                          currentTimezone: getLocale()
                        }
                      })
                    } catch (err) {
                      console.error('Cannot complete task')
                    }
                  }
                  submit({
                    name: goalText,
                    detail: description,
                    priority,
                    dueDate,
                    ...(!completed && {
                      status: finalStatus,
                    }),
                    link,
                    privacyLevel: privacy,
                    errors,
                    setErrors,
                    media,
                    projectId: project,
                    filePrefix: FILE_PREFIX,
                    mutation: goalMutation,
                    firstTime,
                    video,
                    type: 'goal',
                    ...(goal && {
                      updateId: goal.id,
                      updateKey: 'goalId'
                    }),
                    ...(!goal && {
                      completed
                    })
                  })
                  setModalVisible(false)
                  if (!goal) {
                    resetState()
                  }
                }
              }}>
                <RegularText color={theme.palette} style={{
                  fontSize: 16
                }}>
                  {goal ? 'Update': 'Create' }
                </RegularText>
              </Pressable>
              </View>
            </View>
            <View style={modalStyles.infoContainer}>
              <View style={modalStyles.inputContainer}>
                <TextEditorContext.Provider value={{
                  content: goalText,
                  setContent: setGoalText,
                  placeholder: 'Add goal...'
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
                      <Paragraph color={theme.palette} style={{
                        marginRight: spacingUnit * 0.4
                      }}>
                        Task Completed
                      </Paragraph>
                      <Checkmark color={theme.palette} style={{
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
                      <Paragraph color={palette.green400}>
                        Mark as complete
                      </Paragraph>
                    </Pressable>
                  }
                                    {
                    goal &&
                    <>
                    {
                      archived 
                      ?
                      <Pressable style={modalStyles.archivedButton} onPress={() => setArchived(false)}>
                        <Paragraph color={theme.palette}>
                          Archived
                        </Paragraph>
                      </Pressable>
                      :
                      <Pressable style={modalStyles.markAsArchivedButton} onPress={() => {
                        if (!completed) {
                          setArchived(true)
                        }
                      }}>
                        <Paragraph color={palette.grey800}>
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
                      <RegularText color={palette.grey800} style={modalStyles.editRowText}>
                        Project
                      </RegularText>
                    </View>
                    <ModalDropdown value={project} setValue={setProject} items={projectDropdowns} placeholder='Select a project' zIndex={5000} />
                  </View>
                  {/* <View style={[
                    modalStyles.editRowContainer,
                    Platform.OS !== 'android' && {
                      zIndex: 4000
                    }
                  ]}>
                    <View style={modalStyles.editRowTextContainer}>
                      <RegularText color={palette.grey800} style={modalStyles.editRowText}>
                        Privacy
                      </RegularText>
                    </View>
                    <ModalDropdown value={privacy} items={privacyDropdown} setValue={setPrivacy} placeholder='Select privacy level' />
                  </View> */}
                  <View style={modalStyles.editRowContainer}>
                    <View style={modalStyles.editRowTextContainer}>
                      <RegularText color={palette.grey800} style={modalStyles.editRowText}>
                        Priority
                      </RegularText>
                    </View>
                    <PriorityList priority={priority} setPriority={setPriority} />
                  </View>
                  <View style={modalStyles.editRowContainer}>
                        <View style={modalStyles.editRowTextContainer}>
                          <RegularText color={palette.grey800} style={modalStyles.editRowText}>
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
                    <LinkIcon color={palette.grey800} style={{
                      marginRight: spacingUnit * 2
                    }} onPress={() => setAddLink(true)} />
                    <CameraIcon onPress={() => {
                      setErrors({
                        ...errors,
                        mediaError: null
                      })
                      setCameraOpen(true)
                    }} color={palette.grey800} style={{
                      marginRight: spacingUnit * 2
                    }} />
                    <ImageIcon color={palette.grey800} onPress={() => {
                      setErrors({
                        ...errors,
                        mediaError: null
                      })
                      setGalleryOpen(true)
                    }} style={{
                      marginRight: spacingUnit * 2
                    }} />
                    <VideoIcon color={palette.grey800} onPress={() => {
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
                  <ScrollView keyboardDismissMode='interactive' keyboardShouldPersistTaps='handled'contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{
                      flex: 1
                    }}>
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
                             <RegularText color={palette.grey800} style={{
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
                         <RegularText color={palette.grey800} style={{
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
                    </View>
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
