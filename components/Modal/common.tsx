import React, { useCallback, useEffect, useState } from 'react'
import { View, Pressable, StyleSheet, Dimensions, Platform, SafeAreaView, Image } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import { mentionRegEx } from 'react-native-controlled-mentions'
import Modal from 'react-native-modal'
import * as ImagePicker from 'expo-image-picker'
import * as VideoThumbnails from 'expo-video-thumbnails'
import { Video } from 'expo-av'

import { Black, White, Blue400, Grey400, Grey800, Grey750, Blue500, Red400, Yellow300, Green400 } from '../../constants/Colors'
import { ErrorText, Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { SafeImage } from '../../storybook/stories/Image'
import { getMentionArray, spacingUnit } from '../../utils/common'
import PriorityFlame from '../../assets/images/modal/priority'
import CancelIcon from '../../assets/images/cancel'
import { getFilenameAndType, uploadVideo } from '../../utils/image'
import ImageBrowser from './ImageBrowser'
import { FlexRowContentModal } from './index'

import { capitalizeFirstLetter } from '../../utils/common'
import { useNavigation } from '@react-navigation/native'
import { MAX_VIDEO_LIMIT, MUX_URL_ENDING, MUX_URL_PREFIX } from '../../constants'

export const VideoThumbnail = ({ source, width, height, setVideo, video, errors, setErrors, filePrefix, videoUploading, setVideoUploading }) => {
  const [image, setImage] = useState('')
  const [isVisible, setModalVisible] = useState(false)
  const generateThumbnail = async () => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        source,
        {
          time: 0,
        }
      );
      setImage(uri);
    } catch (e) {
      console.warn(e);
    }
  }
  useEffect(() => {
    generateThumbnail()
  }, [source])

  return (
    <View>
     <FlexRowContentModal 
        isVisible={isVisible}
        setModalVisible={setModalVisible}
        headerText='Edit picture'
        centered={true}
        cancelButtonStyle={{
          marginTop: spacingUnit * 2
        }}
        flexDirection='column'
      >
        <Pressable onPress={() => {
          pickVideo({ video, errors, setErrors, videoUploading, setVideoUploading })
        }} style={{
          marginBottom: spacingUnit * 3,
          alignSelf: 'center',
        }}>
        <Subheading color={Blue400}>
          Replace video
        </Subheading>
        </Pressable>
        <Pressable style={{
          alignSelf: 'center'
        }} onPress={() => {
          setVideo(null)
          setModalVisible(false)
        }}>
        <Subheading color={Red400}>
          Delete video
        </Subheading>
        </Pressable>
      </FlexRowContentModal>
      {
        video?.startsWith('file://')
        ?
        <Image style={{
          ...modalStyles.mediaItem,
          ...(width && {
            width,
            height
          })
        }} source={{
          uri: image
        }} />
        :
        <Video
        style={{
          ...modalStyles.mediaItem,
          ...(width && {
            width,
            height
          })
        }}
          source={{
            uri: `${MUX_URL_PREFIX}${video}${MUX_URL_ENDING}`,
          }}
          useNativeControls
          resizeMode="contain"
          isLooping
      />
      }
            <View style={{
          position: 'absolute',
          backgroundColor: Grey800,
          borderRadius: 12,
          right: 12,
          top: 12
        }}>
          <CancelIcon color={White} onPress={() => setModalVisible(true)} />
        </View>
      </View>
  )
}
export const pickVideo = async ({ setVideo, setErrors, setVideoUploading }) => {
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }
  }
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (result)
  if (!result.cancelled) {
    if (setErrors && Number(result.duration) > MAX_VIDEO_LIMIT) {
      setErrors({
        mediaError: 'Video can only be 10 seconds max.'
      })
    } else {
      // Upload video
      const {
        fileType,
        filename
      } = getFilenameAndType(result.uri)
      const newFileName = `video/${filename}`

      setVideoUploading(true)
      await uploadVideo({ filename: newFileName, localUrl: result.uri, fileType })
      setVideoUploading(false)
      setVideo(result.uri)
    }
  }
}

export const PRIVACY_LEVELS = ['public', 'private']

export const privacyDropdown = PRIVACY_LEVELS.map(privacy => ({
  'label': capitalizeFirstLetter(privacy),
  'value': privacy
}))
const mediaItemWidth = (Dimensions.get('window').width - (spacingUnit * 6)) / 2
export const modalStyles = StyleSheet.create({
  fullScreenContainer: {
    backgroundColor: White,
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').height),
    alignSelf: 'center',
    marginBottom: 0
  },
  errorText: {
    marginTop: spacingUnit,
    marginBottom: spacingUnit
  },
  topRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: spacingUnit * 2,
    paddingRight: spacingUnit * 2,
    marginTop: spacingUnit * 3
  },
  infoContainer: {
    paddingLeft: spacingUnit * 2,
    paddingRight: spacingUnit * 2,
    marginTop: spacingUnit * 3,
    ...(Platform.OS !== 'android' && {
      zIndex: 100,
    })
  },
  completedButton: {
    backgroundColor: Green400,
    padding: spacingUnit,
    borderRadius: spacingUnit,
    marginBottom: spacingUnit * 2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  markAsCompleteButton: {
    borderColor: Green400,
    borderRadius: spacingUnit,
    borderWidth: 1,
    padding: spacingUnit,
    marginBottom: spacingUnit * 2
  },
  inputContainer: {

  },
  createUpdateButton: {
    alignSelf: 'flex-end',
    width: spacingUnit * 10,
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: Blue500,
    borderRadius: spacingUnit,
    alignItems: 'center'
  },
  title: {
    fontSize: 18
  },
  editContainer: {
    borderTopColor: Grey400,
    borderTopWidth: 1,
    marginTop: spacingUnit * 2,
    paddingTop: spacingUnit * 2
  },
  editRowContainer: {
    flexDirection: 'row',
    marginBottom: spacingUnit * 2.5,
    alignItems: 'center',
  },
  completeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  editRowTextContainer: {
    marginRight: spacingUnit * 2
  },
  editRowText: {
    color: Grey800,
    fontSize: 16,
    width: spacingUnit * 7.5
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  priorityRowItem: {
    padding: spacingUnit * 0.5,
    paddingLeft: spacingUnit * 0.75,
    paddingRight: spacingUnit * 0.75,
    flexDirection: 'row',
    marginRight: spacingUnit,
    borderRadius: 4
  },
  descriptionBox: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: Grey400,
    minHeight: spacingUnit * 9,
    padding: spacingUnit,
    color: Black,
    borderRadius: 4,
    alignSelf: 'stretch',
    flex: 1,
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacingUnit * 2
  },
  link: {
    fontFamily: 'Rubik Light',
    fontSize: 16,
    color: Blue400
  },
  addLinkButton: {
    padding: spacingUnit
  },
  mediaRows: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacingUnit * 2,
    flexWrap: 'wrap'
  },
  mediaItem: {
    marginTop: spacingUnit,
    width: mediaItemWidth,
    height: mediaItemWidth / 4 * 3,
    borderRadius: 4,
    marginRight: spacingUnit
  },
  nameTextInput: {
    borderWidth: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    fontSize: 18
  },
  renderSuggestion: {
    marginLeft: -(2 * spacingUnit)
  }
})

export const DateDisplay = ({ dueDate, onDateChange, editDate, setEditDate }) => {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center'
    }}>
      {/* <DueDateIcon /> */}
      <DateTimePicker
          testID="dateTimePicker"
          value={dueDate}
          mode={'date'}
          display="default"
          onChange={(e, date) => {
            if (date) {
              onDateChange(new Date(date))
            }
          }}
          style={{
            flex: 1,
            marginLeft: spacingUnit
          }}
        />
    </View>
  )
}

export const ModalDropdown = ({ items, value, setValue, placeholder }) => {

  return (
      <DropDownPicker
      defaultValue={value}
      style={{
        backgroundColor: Grey750,
        // borderColor: 'rgba(47,46,65, 0.54)'
      }}
      placeholder={placeholder}
      containerStyle={{
        flex: 1,
        height: 40
      }}
      labelStyle={{
        color: Black,
        fontSize: 16,
        fontFamily: 'Rubik Light'
      }}
      itemStyle={{justifyContent: 'flex-start'}}
      selectedLabelStyle={{
        fontFamily: 'Rubik Light',
        fontWeight: '500'
      }}
      onChangeItem={item => setValue(item.value)}
      searchable={true}
        items={items}
      />
  )
}

export const PriorityList = ({ priority, setPriority }) => {
  const priorityHigh = priority === 'high'
  const priorityMedium = priority === 'medium'
  const priorityLow = priority === 'low'

  return (
    <View style={modalStyles.priorityRow}>
      <Pressable onPress={() => setPriority('high')} style={{
        ...modalStyles.priorityRowItem,
        ...(priorityHigh && {
          backgroundColor: Red400
        })
      }}>
        <PriorityFlame color={priorityHigh ? White : Red400} style={{
          marginRight: 0.5 * spacingUnit
        }} />
        <Paragraph color={priorityHigh ? White : Grey800}>
          High
        </Paragraph>
      </Pressable>
      <Pressable onPress={() => setPriority('medium')} style={{
        ...modalStyles.priorityRowItem,
        ...(priorityMedium && {
          backgroundColor: Yellow300
        })
      }}>
        <PriorityFlame color={priorityMedium ? White: Yellow300} style={{
          marginRight: 0.5 * spacingUnit
        }} />
        <Paragraph color={priorityMedium ? White : Grey800}>
          Medium
        </Paragraph>
      </Pressable>
      <Pressable onPress={() => setPriority('low')} style={{
        ...modalStyles.priorityRowItem,
        ...(priorityLow && {
          backgroundColor: Blue400
        })
      }}>
        <PriorityFlame color={priorityLow ? White : Blue400} style={{
          marginRight: 0.5 * spacingUnit
        }}/>
        <Paragraph color={priorityLow ? White : Grey800}>
          Low
        </Paragraph>
      </Pressable>
    </View>
  )
}

export const VideoDisplay = async({ setVideo, video }) => {
  const [isVisible, setModalVisible] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const navigation = useNavigation()
  return (
    <View>
              <FlexRowContentModal 
        isVisible={isVisible}
        setModalVisible={setModalVisible}
        headerText='Edit picture'
        centered={true}
        cancelButtonStyle={{
          marginTop: spacingUnit * 2
        }}
        flexDirection='column'
      >
        <Pressable onPress={() => {
          setGalleryOpen(true)
        }} style={{
          marginBottom: spacingUnit * 3,
          alignSelf: 'center',
        }}>
        <Subheading color={Blue400}>
          Replace photo
        </Subheading>
        </Pressable>
        <Pressable style={{
          alignSelf: 'center'
        }} onPress={() => {
          const newArr = media.filter(mediaItem => mediaItem !== image)
          setMedia(newArr)
          setModalVisible(false)
        }}>
        <Subheading color={Red400}>
          Delete photo
        </Subheading>
        </Pressable>
      </FlexRowContentModal>
      
    </View>
  )
}

export const ImageDisplay = ({ setMedia, image, imagePrefix, media, width, height, setImageUploading }) => {
  const [isVisible, setModalVisible] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const navigation = useNavigation()

  return (
    <View>
        {
          galleryOpen ?
          <Modal isVisible={galleryOpen}>
            <ImageBrowser edit={image} setImageBrowser={(arg) => {
              setGalleryOpen(arg)
              setModalVisible(arg)
            }} media={media} navigation={navigation} setMedia={setMedia} imagePrefix={imagePrefix} setImageUploading={setImageUploading} />
          </Modal>
        :
        <FlexRowContentModal 
        isVisible={isVisible}
        setModalVisible={setModalVisible}
        headerText='Edit picture'
        centered={true}
        cancelButtonStyle={{
          marginTop: spacingUnit * 2
        }}
        flexDirection='column'
      >
        <Pressable onPress={() => {
          setGalleryOpen(true)
        }} style={{
          marginBottom: spacingUnit * 3,
          alignSelf: 'center',
        }}>
        <Subheading color={Blue400}>
          Replace photo
        </Subheading>
        </Pressable>
        <Pressable style={{
          alignSelf: 'center'
        }} onPress={() => {
          const newArr = media.filter(mediaItem => mediaItem !== image)
          setMedia(newArr)
          setModalVisible(false)
        }}>
        <Subheading color={Red400}>
          Delete photo
        </Subheading>
        </Pressable>
      </FlexRowContentModal>
        }
      <SafeImage key={image} src={image} style={{
        ...modalStyles.mediaItem,
        ...(width && {
          width,
          height
        })
      }} />
      <View style={{
        position: 'absolute',
        backgroundColor: Grey800,
        borderRadius: 12,
        right: 12,
        top: 12
      }}>
        <CancelIcon color={White} onPress={() => setModalVisible(true)} />
      </View>
      </View>
  )
}

const populateMentionArr = ({ nameMentions, detailMentions, contentMentions, completedMessageMentions }) => {
  let mentions = null
  if (nameMentions && detailMentions) {
    const mergedMentions = [...new Set([
      ...nameMentions,
      ...detailMentions
    ])]
    if (mergedMentions.length > 0) {
        mentions = mergedMentions
    }
  } else if (nameMentions && nameMentions.length > 0) {
    mentions = nameMentions
  } else if (detailMentions && detailMentions.length > 0) {
    mentions = detailMentions
  } else if (contentMentions) {
    mentions = contentMentions
  } else if (completedMessageMentions) {
    mentions = completedMessageMentions
  }
  return mentions
}

export const submit = async ({
  name,
  detail,
  type,
  media,
  priority,
  dueDate,
  link,
  privacyLevel,
  setErrors,
  errors,
  mutation,
  projectId,
  goalId,
  taskId,
  filePrefix,
  firstTime,
  updateId,
  updateKey,
  content,
  relatedGoalIds,
  relatedTaskIds,
  status,
  completedMessage,
  completedImages,
  completed,
  video,
  title
}) => {

  if (!name && type !== 'ask' && type !== 'post' && type !== 'projectDiscussion' && type !== 'completed') {
    setErrors({
      ...errors,
      nameError: 'Name is required'
    })
  } else if (type === 'projectDiscussion' && !title) {
    setErrors({
      ...errors,
      nameError: 'Title is required'
    })
  } else if (!content && (type === 'ask' || type === 'post') && type !== 'completed') {
    setErrors({
      ...errors,
      nameError: 'Content required'
    })
  } else if (!projectId && type !== 'post' && type !== 'ask' && type !== 'completed') {
    setErrors({
      ...errors,
      nameError: 'Please select a project'
    })
  } else {
    // Parse media:
    const finalMediaArr = media && media.map(image => {
      if (image?.startsWith('file://')) {
        const {
          filename
        } = getFilenameAndType(image)
        return filePrefix + filename
      }
      return image
    })
    const finalCompletedImagesArr = completedImages && completedImages.map(image => {
      if (image?.startsWith('file://')) {
        const {
          filename
        } = getFilenameAndType(image)
        return filePrefix + filename
      }
      return image
    })
    let finalVideo = video
    if (video) {
      if (video.startsWith('file://')) {
        const {
          filename: videoFilename
        } = getFilenameAndType(video)
        finalVideo = `video/${videoFilename}`
      }
    }
    const {
      mentionedUsers: nameMentionedUsers,
      mentionedProjects: nameMentionedProjects
    } = getMentionArray(name)

    const {
      mentionedUsers: detailMentionedUsers,
      mentionedProjects: detailMentionedProjects
    } = getMentionArray(detail)

    const {
      mentionedUsers: contentMentionedUsers,
      mentionedProjects: contentMentionedProjects
    } = getMentionArray(content)
  
    const {
      mentionedUsers: completedMessageUsers,
      mentionedProjects: completedMessageProjects
    } = getMentionArray(completedMessage)
  
    const userMentions = populateMentionArr({ nameMentions: nameMentionedUsers, detailMentions: detailMentionedUsers, contentMentions: contentMentionedUsers, completedMessageMentions: completedMessageUsers })
    const projectMentions = populateMentionArr({ nameMentions: nameMentionedProjects, detailMentions: detailMentionedProjects, contentMentions: contentMentionedProjects, completedMessageMentions: completedMessageProjects })

    try {
      const result = await mutation({
        variables: {
          ...(updateId && updateKey &&  {
            [updateKey]: updateId
          }),
          input: {
            ...(name && {
              name
            }),
            ...(title && {
              title
            }),
            ...(detail && {
              detail
            }),
            ...(media && {
              media: finalMediaArr
            }),
            ...(priority && {
              priority
            }),
            ...(dueDate && {
              dueDate
            }),
            ...(status && {
              status
            }),
            link,
            ...(privacyLevel && {
              privacyLevel
            }),
            ...(content && {
              content
            }),
            ...(projectId && {
              projectId
            }),
            ...(goalId && {
              goalId
            }),
            ...(taskId && {
              taskId
            }),
            ...(firstTime && {
              firstTime
            }),
            ...(relatedGoalIds && {
              relatedGoalIds
            }),
            ...(relatedTaskIds && {
              relatedTaskIds
            }),
            ...(userMentions && {
              userMentions
            }),
            ...(projectMentions && {
              projectMentions
            }),
            ...(completedImages && {
              completedImages: finalCompletedImagesArr
            }),
            ...(completedMessage && {
              completedMessage
            }),
            ...(video && {
              videoUploadSlug: finalVideo
            }),
            completed
          }
        }
      })
      // console.log('result', result)
    } catch (err) {
      console.log('err', err)
    }
  }
}
