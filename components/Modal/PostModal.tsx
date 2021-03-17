import React, { useCallback, useState } from 'react'
import { SafeAreaView, ScrollView, View, TextInput, TouchableWithoutFeedback, Keyboard, Pressable, ActivityIndicator } from 'react-native'
import Modal from 'react-native-modal'
import { useQuery } from '@apollo/client'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { TextEditor } from '../../storybook/stories/TextEditor'
import { TextEditorContext } from '../../utils/contexts'
import { Black, White, Blue400, Blue500, Grey800 } from '../../constants/Colors'
import { ErrorText, RegularText, Subheading } from '../../storybook/stories/Text'
import { spacingUnit } from '../../utils/common'
import { GET_USER_PROJECTS } from '../../graphql/queries/project'
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

const FILE_PREFIX = 'tmp/post/new/'

export const FullScreenPostModal = ({ post, isVisible, setModalVisible, postMutation }) => {
  const initialMedia = (post && post.additionalData && post.additionalData.images) || []
  const initialLink = post && post.additionalData && post.additionalData.link
  const initialContent = (post && post.content) || ''
  const initialProject = post && post.projectId
  const [project, setProject] = useState(initialProject)
  const [link, setLink] = useState(initialLink)
  const [addLink, setAddLink] = useState(!!(link))
  const [media, setMedia] = useState(initialMedia)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [content, setContent] = useState(initialContent)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const user = useMe()
  const [errors, setErrors] = useState({})
  const [video, setVideo] = useState(post && post.muxPlaybackId || null)
  const [videoUploading, setVideoUploading] = useState(null)
  const { data: projectUsers, loading, error } = useQuery(GET_USER_PROJECTS, {
    variables: {
      userId: user && user.id
    }
  })
  const navigation = useNavigation()

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
    setLink(null)
    setAddLink(false)
    setMedia([])
    setCameraOpen(false)
    setGalleryOpen(false)
    setContent('')
    setErrors({})
    setProject(null)
    setVideo(null)
    if (post) {
      setContent(initialContent)
      setLink(initialLink)
      setAddLink(!!(initialLink))
      setMedia(initialMedia)
      setProject(initialProject)
      setCameraOpen(false)
      setGalleryOpen(false)
      setVideo(post && post.muxPlaybackId || null)
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
                setVideo={setVideo} 
                setVideoUploading={setVideoUploading}
                setErrors={setErrors}
              />
            }
            <View style={modalStyles.topRowContainer}>
              <Pressable onPress={() => {
                if (post) {
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
                  {post ? 'Edit' : 'New'} post
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
                  submit({
                    type: 'post',
                    content,
                    link,
                    errors,
                    setErrors,
                    media,
                    projectId: project,
                    filePrefix: FILE_PREFIX,
                    mutation: postMutation,
                    video,
                    ...(post && {
                      updateId: post.id,
                      updateKey: 'postId'
                    }),
                  })
                  setModalVisible(false)
                  if (!post) {
                    resetState()
                  }
                }
              }}>
                <RegularText color={White} style={{
                  fontSize: 16
                }}>
                  {post ? 'Update': 'Create' }
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
                  placeholder: `What's new?`
                }}>
                  <View style={{flex: 1}}>
                <TextEditor autoFocus  multiline style={modalStyles.nameTextInput}
                renderSuggestionStyle={modalStyles.renderSuggestion}
                />
                </View>
                </TextEditorContext.Provider>
      
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
                    <ModalDropdown value={project} setValue={setProject} items={projectDropdowns} placeholder='Select a project' zIndex={5000} />
                  </View>
            <View style={modalStyles.attachmentRow}>
                    <LinkIcon color={Grey800} style={{
                      marginRight: spacingUnit * 2
                    }} onPress={() => setAddLink(true)} />
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
                      pickVideo({ setVideo, video, errors, setErrors, filePrefix: FILE_PREFIX, videoUploading, setVideoUploading })
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

export default FullScreenPostModal
