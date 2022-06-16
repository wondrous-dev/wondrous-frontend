import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { View, Pressable } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

import palette from 'theme/palette'
import { CLOSE_PROJECT_DISCUSSION, UPDATE_PROJECT_DISCUSSION } from '../../graphql/mutations'
import { SafeImage } from '../../storybook/stories/Image'
import { RegularText, Paragraph } from '../../storybook/stories/Text'
import { FullScreenDiscussionModal } from '../../components/Modal/ProjectDiscussionModal'
import { spacingUnit, renderMentionString } from '../../utils/common'
import DefaultProfilePicture from '../../assets/images/default-profile-picture.jpg'
import CommentIcon from '../../assets/images/reactions/comment'
import ShareIcon from '../../assets/images/share/feed'
import { useMe } from '../withAuth'
import { feedStyles, ShareModal } from '../Feed'
import { MyCarousel, VideoDisplay } from '../../storybook/stories/Carousel'
import Options from '../../assets/images/options'
import { FlexRowContentModal } from '../Modal'

TimeAgo.locale(en)
const timeAgo = new TimeAgo('en-US')

export const ProjectDiscussionItem = ({ item: initialItem, userOwned, standAlone, comment, onCommentPress, projectId, activityPage }) => {
  const user = useMe()
  const navigation = useNavigation()

  const [item, setItem] = useState(initialItem)
  const [updateProjectDiscussion] = useMutation(UPDATE_PROJECT_DISCUSSION, {
    variables: {
      projectDiscussionId: item?.id
    },
    update: (cache, { data: updateProjectDiscussion} ) => {
      if (updateProjectDiscussion) {
        setItem(updateProjectDiscussion?.updateProjectDiscussion)
      }
      cache.modify({
        fields: {
          getProjectDiscussions(existingItems) {
            const newItems = existingItems.map(itemRef => {
              let itemId
              if (itemRef.__ref) {
                const split = itemRef.__ref.split(':')
                itemId = split[split.length - 1]
              } else {
                itemId = itemRef.id
              }
              if (itemId === item?.id) {
                return updateProjectDiscussion?.updateProjectDiscussion
              }
              return itemRef
            })
            return newItems
          }
        }
      })
    }
  })

  const [closeDiscussion] = useMutation(CLOSE_PROJECT_DISCUSSION, {
    variables: {
      projectDiscussionId: item?.id
    }
  })

  const route = useRoute()
  const [isModalVisible, setModalVisible] = useState(false)
  const [editVisible, setEditVisible] = useState(false)
  const [preEditVisible, setPreEditVisible] = useState(false)
  const [closed, setClosed] = useState(false)
  const pressComment = () => {
    if (standAlone || comment) {
      onCommentPress(`@[${item.creatorUsername || item.actorUsername}](${item.createdBy || item.userId})`)
    } else {
      navigation.navigate('Root', {
        screen: route?.params?.tab || 'Dashboard',
        params: {
          screen: 'ProjectDiscussionItem',
          params: {
            item,
            liked: false,
            comment: true,
            standAlone: true,
            userOwned
          }
        }
      })
    }
  }

  useEffect(() => {
    if (initialItem) {
      setItem(initialItem)
      setClosed(initialItem?.closedAt)
    }
  }, [initialItem])
  const SHARE_URL = `https://wonderapp.co/app/feed/${item.id}`
  const CONTENT = 'Check this discussion from Wonder!'
  let deleteMutation, editMutation
  // if (objectType === 'post') {
  //   editMutation = editPost
  // }
  // if (comment) {
  //   editMutation = editComment
  // }

  return (
    <>
    <FullScreenDiscussionModal isVisible={editVisible} setModalVisible={setEditVisible} projectDiscussion={item} projectDiscussionMutation={updateProjectDiscussion} projectId={projectId} />
    <EditDiscussionModal isVisible={preEditVisible} setModalVisible={setPreEditVisible} setEditModalVisible={setEditVisible} />
    <ShareModal isVisible={isModalVisible} url={SHARE_URL} content={CONTENT} setModalVisible={setModalVisible} />
    <View style={feedStyles.feedItemContainer}>
      <View style={feedStyles.feedItemName}>
        <Pressable onPress={() => navigation.navigate('Root', {
          screen: route && route.params && route.params.tab || 'Profile',
          params: {
            screen: 'UserProfile',
            params: {
              userId: item.createdBy
            }
          }
        })}>
          <SafeImage style={feedStyles.feedItemImage} src={item.creatorThumbnail || item.creatorProfilePicture || item?.actorProfilePicture || item?.actorThumbnail} defaultImage={DefaultProfilePicture} />
        </Pressable>
        <View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingRight: spacingUnit * 2,
          }}>
          <View style={{
            flexShrink: 1,
            paddingRight: spacingUnit,
          }}>
          <Paragraph style={{
            fontFamily: 'Rubik SemiBold',
            lineHeight: spacingUnit * 2.5,
            flex: 1,
            flexWrap: 'wrap',
            paddingRight: spacingUnit * 2
          }} color={palette.black}
          onPress={() => {
            if (standAlone || comment) {
              navigation.navigate('Root', {
                screen: route && route.params && route.params.tab || 'Profile',
                params: {
                  screen: 'UserProfile',
                  params: {
                    userId: comment ? item.userId : item.createdBy
                  }
                }
              })
            } else {
              navigation.navigate('Root', {
                screen: route?.params?.tab || 'Profile',
                params: {
                  screen: 'ProjectDiscussionItem',
                  params: {
                    item,
                    liked: false,
                    comment: true,
                    standAlone: true,
                    userOwned
                  }
                }
              })
            }
          }}         
          >
            {item?.creatorFirstName || item?.actorFirstName} {item?.creatorLastName || item?.creatorFirstName}
          </Paragraph>
          <RegularText style={{
            lineHeight: 18,
            marginTop: spacingUnit * 0.5
          }} color={palette.grey200}>{timeAgo.format(new Date(item.createdAt))}</RegularText>     
          </View>
          </View>
        </View>
      </View>
      <View style={feedStyles.feedItemContent}>
        {
          <Paragraph style={feedStyles.feedText}>
          {renderMentionString({ content: item.title || item.content || item.itemContent, textStyle: feedStyles.feedText,  navigation, tab: route && route.params && route.params.tab })}
          </Paragraph>
        }
            <>
              {(!item.images) && item.playbackId &&
                <VideoDisplay video={item.playbackId} />
              }
              {
                item.images?.length > 0 &&
                <MyCarousel data={item.playbackId ? [
                  {
                    video: item.playbackId
                  },
                  ...item.images
                ] : item.images} images={true} passiveDotColor={palette.grey800} activeDotColor={palette.blue400} />
              }
            </>
      </View>

        <View style={feedStyles.reactions}>
          <Pressable onPress={() => {
            if (comment) {
              navigation.navigate('Root', {
                screen: route && route.params && route.params.tab || 'Profile',
                params: {
                  screen: 'UserList',
                  params: {
                    feedCommentId: item.id
                  }
                }
              })
            }
          }}>
          </Pressable>
          <Pressable onPress={pressComment}>
          <CommentIcon color={palette.grey700} style={{
            marginRight: item.commentCount ? spacingUnit : 0
          }}/>
          </Pressable>
          <RegularText color={palette.grey600} style={{
            marginRight: spacingUnit * 3
          }}>{item.commentCount}</RegularText>
          <Pressable onPress={() => setModalVisible(true)}>
            <ShareIcon color={palette.grey700} />
          </Pressable> 
          {
            (item.createdBy === user.id) &&
            <Pressable style={{
              marginLeft: spacingUnit * 3
            }} onPress={() => {
              if (item.createdBy === user.id) {
                setEditVisible(true)
              }
            }}>
            <Options color={palette.grey700} />
          </Pressable>
          }
          {
            <View style={{
              flex: 1
            }} />
          }
          {
            userOwned &&
            <>
            {
              closed
              ?
              <Pressable style={{
                backgroundColor: palette.green400,
                padding: spacingUnit * 0.5,
                paddingLeft: spacingUnit,
                paddingRight: spacingUnit,
                borderRadius: spacingUnit,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
              <RegularText color={palette.white} style={{
                marginRight: spacingUnit * 0.4
              }}>
                Closed
              </RegularText>
            </Pressable>
            :
            <Pressable style={{
              borderColor: palette.green400,
              borderRadius: spacingUnit,
              borderWidth: 1,
              padding: spacingUnit * 0.5,
              paddingLeft: spacingUnit,
              paddingRight: spacingUnit
            }} onPress={() => {
              setClosed(true)
              closeDiscussion()
            }}>
              <RegularText color={palette.green400}>
                Close discussion
              </RegularText>
            </Pressable>
            }
          </>
          }
        </View>
        {
          standAlone &&
          <View
          style={{
            borderBottomColor: palette.grey300,
            borderBottomWidth: 1,
            marginTop: spacingUnit * 2
          }}
        />
        }
    </View>
    </>
  )
}


export const renderDiscussionItem = ({ projectId, userOwned, item, navigation, screen, params, activityPage }) => {
  if (item?.privacyLevel === 'private') {
    return null
  }

  return (
    <Pressable key={item && item.id} onPress={() => navigation.push(screen, params)}>
      <ProjectDiscussionItem userOwned={userOwned} item={item} key={item.id} activityPage={activityPage} projectId={projectId} />
    </Pressable>
  )
}

export const EditDiscussionModal = ({ isVisible, setModalVisible, setEditModalVisible }) => {
  return (
    <FlexRowContentModal
    headerText='Edit discussion'
    setModalVisible={setModalVisible}
    isVisible={isVisible}
    >
      <View />
      <Pressable onPress={() => {
        setEditModalVisible(true)
        setModalVisible(false)
      }}>
        <Paragraph>
          Edit Discussion
        </Paragraph>
      </Pressable>
      <View />
    </FlexRowContentModal>
  )
}