import React, { useCallback, useState } from 'react'
import { SafeAreaView, ScrollView, View, TextInput, TouchableWithoutFeedback, Keyboard, Pressable, ActivityIndicator } from 'react-native'
import Modal from 'react-native-modal'
import { useQuery } from '@apollo/client'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { TextEditor } from '../../storybook/stories/TextEditor'
import { TextEditorContext } from '../../utils/contexts'
import { Black, White, Blue400, Blue500, Grey800 } from '../../constants/Colors'
import { ErrorText, Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { spacingUnit } from '../../utils/common'
import { GET_USER_PROJECTS } from '../../graphql/queries/project'
import { UPDATE_PROJECT_DISCUSSION, CREATE_PROJECT_DISCUSSION } from '../../graphql/mutations/projectDiscussion'
import Camera from '../../components/Camera'
import { submit, modalStyles, ImageDisplay, ModalDropdown, pickVideo, VideoThumbnail } from './common'
import CameraIcon from '../../assets/images/camera'
import ImageIcon from '../../assets/images/image'
import LinkIcon from '../../assets/images/link'
import ImageBrowser from './ImageBrowser'
import { useNavigation } from '@react-navigation/native'
import { useMe } from '../../components/withAuth'
import VideoIcon from '../../assets/images/video'
import { VideoDisplay } from '../../storybook/stories/Carousel'

const FILE_PREFIX = 'tmp/projectDiscussion/new/'

export const FullScreenDiscussionModal = ({ projectDiscussion, isVisible, setModalVisible, projectDiscussionMutation, project, projectId }) => {
  const initialMedia = (projectDiscussion && projectDiscussion.additionalData && projectDiscussion.additionalData.images) || []
  const initialLink = projectDiscussion && projectDiscussion.additionalData && projectDiscussion.additionalData.link
  const initialContent = (projectDiscussion && projectDiscussion.content) || ''
  const initialProject = projectDiscussion && projectDiscussion.projectId
  const [link, setLink] = useState(initialLink)
  const [addLink, setAddLink] = useState(!!(link))
  const [media, setMedia] = useState(initialMedia)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [content, setContent] = useState(initialContent)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const user = useMe()
  const [errors, setErrors] = useState({})
  const [video, setVideo] = useState(projectDiscussion && projectDiscussion.muxPlaybackId || null)
  const [videoUploading, setVideoUploading] = useState(null)
  const navigation = useNavigation()

  const resetState = useCallback(() => {
    setLink(null)
    setAddLink(false)
    setMedia([])
    setCameraOpen(false)
    setGalleryOpen(false)
    setContent('')
    setErrors({})
    setVideo(null)
    if (projectDiscussion) {
      setContent(initialContent)
      setLink(initialLink)
      setAddLink(!!(initialLink))
      setMedia(initialMedia)
      setCameraOpen(false)
      setGalleryOpen(false)
      setVideo(projectDiscussion && projectDiscussion.muxPlaybackId || null)
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
        <KeyboardAwareScrollView enableResetScrollToCoords={false}keyboardDismissMode='interactive' keyboardShouldPersistTaps='handled'>
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
                setErrors={setErrors}
              />
            }
            <View style={modalStyles.topRowContainer}>
              <Pressable onPress={() => {
                if (projectDiscussion) {
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
                flex: 2
              }}>
                <Subheading color={Black} style={{
                  fontSize: 20
                }}>
                  {projectDiscussion ? 'Edit' : 'New'} discussion
                </Subheading>
              </View>
              <View style={{
                flex: 1,
              }}>
              <Pressable style={{
                ...modalStyles.createUpdateButton,
                backgroundColor: videoUploading ? Grey800 : Blue500
              }} onPress={() => {
                if (videoUploading) {
                  setErrors({
                    submitError: 'Videos are still uploading!'
                  })
                } else {
                  console.log('what', project)
                  submit({
                    type: 'projectDiscussion',
                    content,
                    link,
                    errors,
                    setErrors,
                    media,
                    projectId: projectId || project?.id || projectDiscussion?.projectId,
                    filePrefix: FILE_PREFIX,
                    mutation: projectDiscussionMutation,
                    video,
                    ...(projectDiscussion && {
                      updateId: projectDiscussion.id,
                      updateKey: 'projectDiscussionId'
                    }),
                  })
                  setModalVisible(false)
                  if (!projectDiscussion) {
                    resetState()
                  }
                }
              }}>
                <RegularText color={White} style={{
                  fontSize: 16
                }}>
                  {projectDiscussion ? 'Update': 'Create' }
                </RegularText>
              </Pressable>
            </View>
            </View>
            <View style={modalStyles.infoContainer}>
            <View style={[modalStyles.inputContainer, {
              marginBottom: spacingUnit * 5
            }]}>
              <TextEditorContext.Provider value={{
                  content,
                  setContent,
                  placeholder: `Post feedback, new ideas or any thoughts you have on the project`
                }}>
                  <View style={{flex: 1}}>
                <TextEditor autoFocus  multiline style={modalStyles.nameTextInput}
                renderSuggestionStyle={modalStyles.renderSuggestion}
                />
                </View>
                </TextEditorContext.Provider>
      
              </View>
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
            <View style={modalStyles.attachmentRow}>
                    <CameraIcon onPress={() =>{
                      setErrors({
                        ...errors,
                        mediaError: null
                      })
                       setCameraOpen(true)
                      }} color={Grey800} style={{
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
                      (media || video) &&
                      <View style={modalStyles.mediaRows}>
                        {
                          !!(video) &&
                          <VideoThumbnail source={video} setVideo={setVideo} video={video} errors={errors} setErrors={setErrors} filePrefix={FILE_PREFIX} videoUploading={videoUploading} setVideoUploading={setVideoUploading} />

                        }
                        {media.map(image => (
                          <ImageDisplay setMedia={setMedia} media={media} image={image} imagePrefix={FILE_PREFIX} />
                        ))}
                      </View>
                    }
                  </ScrollView>
                  </View>
        </KeyboardAwareScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
      }
    </Modal>
  )
}

export default FullScreenDiscussionModal
