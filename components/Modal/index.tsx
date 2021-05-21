import React, { useState, useCallback, useEffect } from 'react'
import { ScrollView, View, Dimensions, StyleSheet, Pressable, TouchableWithoutFeedback, Keyboard, Image } from 'react-native'
import Modal from 'react-native-modal'
import Clipboard from 'expo-clipboard'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ProgressCircle from 'react-native-progress-circle'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import * as Progress from 'react-native-progress'

import { Grey300, Black, Grey150, White, Grey800, Blue500, Blue400, Orange } from '../../constants/Colors'
import { ErrorText, Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { PrimaryButton, SecondaryButton } from '../../storybook/stories/Button'
import { SafeImage } from '../../storybook/stories/Image'
import { spacingUnit, renderMentionString } from '../../utils/common'
import DefaultProfilePicture from '../../assets/images/default-profile-picture.jpg'
import { TwitterShare, FacebookShare, CopyLink, LinkedinShare } from '../../assets/images/share'
import { tweetNow, linkedinShare, postOnFacebook  } from '../Share'
import { useMutation } from '@apollo/client'
import { UPDATE_GOAL, UPDATE_TASK } from '../../graphql/mutations'
import { TextEditorContext } from '../../utils/contexts'
import { TextEditor } from '../../storybook/stories/TextEditor'
import CameraIcon from '../../assets/images/camera'
import Camera from '../../components/Camera'
import ImageIcon from '../../assets/images/image'
import { modalStyles as commonModalStyles, ImageDisplay, submit } from './common'
import { useNavigation, useRoute } from '@react-navigation/core'
import ImageBrowser from './ImageBrowser'
import { renderProfileItem } from '../../screens/Profile/common'
import { useUserCongrats } from '../../utils/hooks'

export const modalStyles = StyleSheet.create({
  fixedContainer: {
    backgroundColor: White,
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get("window").width,
    alignSelf: 'center',
    flex: 1,
    borderTopLeftRadius: spacingUnit * 3,
  },
  confetti: {
    marginBottom: spacingUnit * 4,
    alignSelf: 'center'
  },
  buttons: {
    backgroundColor: Grey150,
    alignSelf: 'center',
    maxWidth: Dimensions.get('window').width - (spacingUnit * 6),
    marginBottom: spacingUnit * 2,
  },
  icon: {
    width: 26,
    height: 26
  },
  iconContainer: {
    marginLeft: spacingUnit * 2
  }
})

const imageItemWidth = (Dimensions.get('window').width - (spacingUnit * 10)) / 2
const imageItemHeight = imageItemWidth / 4 * 3

export const CompleteCongratsModal = ({ shareContent, shareUrl,  message, isVisible: item, updateKey, setModalVisible, updateMutation, filePrefix }) => {
  const onboarding = item?.additionalData?.onboarding
  const userCongratsHook = useUserCongrats()
  const user = userCongratsHook?.user
  const profilePicture = user?.profilePicture
  const incompleteRingActions = userCongratsHook?.incompleteRingActions
  const completedRingActions = userCongratsHook?.completedRingActions
  const percentage =  incompleteRingActions + completedRingActions === 0 ? 0 : (completedRingActions / (completedRingActions + incompleteRingActions)) * 100
  const increasedPercentage = incompleteRingActions + completedRingActions === 0 ? 0 : ((completedRingActions + 1) / (completedRingActions + incompleteRingActions)) * 100
  const [increased, setIncreased] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [media, setMedia] = useState([])
  const [cameraOpen, setCameraOpen] = useState(false)
  const [completedMessage, setCompletedMessage] = useState('')
  const [imageUploading, setImageUploading] = useState(null)
  const [errors, setErrors] = useState({})
  const navigation = useNavigation()
  const route = useRoute()
  const {
    id,
    name
  } = item
  const resetState = useCallback(() => {
    setMedia([])
    setCameraOpen(false)
    setGalleryOpen(false)
    setCompletedMessage('')
    setErrors({})
  }, [])

  useEffect(() => {
    if (id) {
      setTimeout(() => {
        setIncreased(true)
    }, 1000)
    }
  }, [id])
  return (
    <Modal
    isVisible={id}
    onBackdropPress={() => setModalVisible(false)}
    style={{ margin: spacingUnit * 2 }}
    >
      {
        galleryOpen
        ?
        <View style={{
          flex: 1
        }}>
        <ImageBrowser setImageBrowser={setGalleryOpen} media={media} navigation={navigation} setMedia={setMedia} imagePrefix={filePrefix} setImageUploading={setImageUploading} />
        </View>
        :
        <TouchableWithoutFeedback 
        onPress={() => Keyboard.dismiss()}>
        <View style={{
          backgroundColor: White,
          borderRadius: spacingUnit
        }}>
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
          filePrefix={filePrefix}
        />
            }
          <KeyboardAwareScrollView style={{
            padding: spacingUnit * 2,
            paddingTop: spacingUnit * 5
          }}>
            <View style={{
              alignItems: 'center',
              marginBottom: spacingUnit * 2
            }}>
                <AnimatedCircularProgress
                prefill={percentage}
                  fill={increased ? increasedPercentage : percentage}
                  size={80}
                  width={8}
                  backgroundColor={Grey300}
                  tintColor={Orange}
                  style={{
                    position: 'absolute',
                    top: -spacingUnit
                  }}
                  rotation={0}
                />
                {
                  profilePicture ?
                  <SafeImage style={{
                    width: spacingUnit * 8,
                    height: spacingUnit * 8,
                    borderRadius: spacingUnit * 4
                  }} profilePicture src={user.thumbnailPicture || user.profilePicture} />
                  :
                  (
                    <Image source={DefaultProfilePicture} style={{
                      width: spacingUnit * 7,
                      height: spacingUnit * 7,
                      borderRadius: spacingUnit * 3.5
                    }} />
                  )
                }
              </View>
          <Subheading style={{
            marginBottom: spacingUnit * 2,
            fontFamily: 'Rubik SemiBold',
            textAlign: 'center'
  
          }} color={Black}>
            {message} <Subheading color={Blue400}>
              
              { renderMentionString({ content: name, navigation, tab: route?.params?.tab })}!
            </Subheading>
          </Subheading>
          {
            !onboarding &&
            <View style={[commonModalStyles.editRowContainer, {
              marginBottom: spacingUnit
            }]}>
              <TextEditorContext.Provider value={{
                    content: completedMessage,
                    setContent: setCompletedMessage,
                    placeholder: 'Add message...' 
                  }}>
                    <View style={{flex: 1}}>
                  <TextEditor multiline style={commonModalStyles.descriptionBox} renderSuggestionStyle={commonModalStyles.renderSuggestion} />
                              </View>
                    </TextEditorContext.Provider>
            </View>
          }
          <View style={[commonModalStyles.attachmentRow, {
            marginBottom: spacingUnit,
            justifyContent: 'flex-start',
          }]}>
              <CameraIcon onPress={() => setCameraOpen(true)} color={Grey800} style={{
                marginRight: spacingUnit * 2,
                ...modalStyles.icon
              }} />
              <ImageIcon color={Grey800} onPress={() => setGalleryOpen(true)} style={modalStyles.icon} />
              <View style={{
                flex: 1
              }} />
             <Pressable onPress={() => {
                tweetNow({ twitterShareURL: shareUrl, tweetContent: shareContent })
              }}>
              <View style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <TwitterShare style={modalStyles.icon} />
              </View>
              </Pressable>
              <Pressable style={modalStyles.iconContainer}  onPress={() => {
                linkedinShare({ linkedinShareUrl: shareUrl, linkedinContent: shareContent })
              }}>
              <View style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <LinkedinShare style={modalStyles.icon}  />
              </View>
              </Pressable>
              <Pressable style={modalStyles.iconContainer}  onPress={() => {
                postOnFacebook({ facebookShareURL: shareUrl, postContent: shareContent })
              }}>
              <View style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <FacebookShare style={modalStyles.icon}  />
              </View>
              </Pressable>
              <Pressable style={modalStyles.iconContainer} onPress={() => {
                Clipboard.setString(shareUrl)
              }}>
              <View style={modalStyles.iconContainer}  style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <CopyLink style={modalStyles.icon}  />
              </View>
              </Pressable>
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
                    {
                      media && 
                      <View style={commonModalStyles.mediaRows}>
                        {media.map(image => (
                          <ImageDisplay setMedia={setMedia} media={media} image={image} imagePrefix={filePrefix} width={imageItemWidth}  height={imageItemHeight} />
                        ))}
                      </View>
                    }
                    </View>
                  </ScrollView>
          {/* <Paragraph color={Black} style={{
            fontSize: 20
          }}>
            Share your accomplishment!
          </Paragraph> */}
          {/* <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacingUnit * 2
          }}>
            <Paragraph color={Black} style={{
              fontFamily: 'Rubik SemiBold'
            }}>
              Share:
            </Paragraph>
  
          </View> */}
          <PrimaryButton style={{
            ...modalStyles.buttons,
            ...{
              backgroundColor: imageUploading ? Grey800: Blue500,
              marginTop: spacingUnit * 4,
            }
            }} onPress={() => {
              if (imageUploading) {
                setErrors({
                  ...errors,
                  mediaError: 'Images still uploading!'
                })
              } else {
                submit({
                  type: 'completed',
                  completedImages: media,
                  completedMessage,
                  errors,
                  setErrors,
                  filePrefix,
                  mutation: updateMutation,
                  updateId: id,
                  updateKey: updateKey
                })
                resetState()
                setModalVisible(false)
              }
            }}>
            <RegularText color={White} style={{
                fontFamily: 'Rubik SemiBold'
              }}>
                {onboarding ? 'Done' : 'Post'}
            </RegularText>
          </PrimaryButton>
          {/* <SecondaryButton style={modalStyles.buttons} onPress={() => setModalVisible(false)}>
              <RegularText color={Black} style={{
                fontFamily: 'Rubik SemiBold'
              }}>
              Cancel
              </RegularText>
            </SecondaryButton> */}
            </KeyboardAwareScrollView>
        </View>
        </TouchableWithoutFeedback>
      }
      
    </Modal>
  )
}

export const TaskCongratsModal = ({ user, isVisible: task, setModalVisible,  }) => {
  let message, shareContent = ''
  if (user && user.usageProgress && !user.usageProgress.taskCompleted && !task?.additionalData?.onboarding) {
    message = 'You finished your first task - '
    shareContent = 'Finished my first task on Wonder! Follow my journey here'
  } else {
    message = 'Well done for completing the task -'
    shareContent = 'Finished a goal on Wonder! Come see more of my progress'
  }
  const shareUrl = `https://wonderapp.co/app/user/${user?.id}`
  const [updateTask] = useMutation(UPDATE_TASK, {
    variables: {
      taskId: task && task.id
    }
  })
  return <CompleteCongratsModal message={message} shareContent={shareContent} shareUrl={shareUrl} isVisible={task} setModalVisible={setModalVisible} updateMutation={updateTask} updateKey='taskId' filePrefix={'tmp//task/new/'} />
}

export const GoalCongratsModal = ({ user, isVisible: goal, setModalVisible }) => {
  let message, shareContent = ''
  if (user && user.usageProgress && !user.usageProgress.goalCompleted) {
    message = 'You finished your first goal - '
    shareContent = 'Finished my first goal on Wonder! Follow my journey here'
  } else {
    message = 'Well done for completing the goal -'
    shareContent = 'Finished a goal on Wonder! Come see more of my progress'
  }
  const shareUrl = `https://wonderapp.co/app/user/${user?.id}`
  const [updateGoal] = useMutation(UPDATE_GOAL, {
    variables: {
      goalId: goal && goal.id
    }
  })

  return <CompleteCongratsModal message={message} shareContent={shareContent} shareUrl={shareUrl} isVisible={goal} setModalVisible={setModalVisible} updateMutation={updateGoal} updateKey='goalId' filePrefix={'tmp/goal/new/'} />
}

export const FlexRowContentModal = ({ isVisible, headerText, children, setModalVisible, centered, cancelButtonStyle, flexDirection='row', ...props }) => {

  return (
    <Modal isVisible={isVisible} onBackdropPress={() => setModalVisible(false)} {...props}>
      <View style={modalStyles.fixedContainer}>
        <Subheading color={Black} style={{
          padding: spacingUnit * 2,
          paddingLeft: spacingUnit * 3
        }}>
          {headerText}
        </Subheading>
        <View
          style={{
            borderBottomColor: Grey300,
            borderBottomWidth: 1,
            marginBottom: spacingUnit
          }}
        />
        <View style={{
          flexDirection,
          justifyContent: centered ? 'center' : 'space-between',
          padding: spacingUnit * 2,
          paddingLeft: spacingUnit * 3,
        }}>
          { children }
        </View>
        <SecondaryButton style={{
            backgroundColor: Grey150,
            marginTop: spacingUnit * 2,
            alignSelf: 'center',
            maxWidth: Dimensions.get('window').width - (spacingUnit * 6),
            marginBottom: spacingUnit * 3,
            ...cancelButtonStyle
          }} onPress={() => setModalVisible(false)}>
            <RegularText color={Black} style={{
              fontFamily: 'Rubik SemiBold'
            }}>
            Cancel
            </RegularText>
          </SecondaryButton>
      </View>
    </Modal>
  )
}