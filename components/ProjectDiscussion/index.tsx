import React, { useCallback, useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Text, View, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Pressable, Dimensions, Linking, Alert } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import Clipboard from 'expo-clipboard'

import { Grey300, Black, Grey150, Grey200, Grey600, Grey700, Red400, White, Blue400, Grey800 } from '../../constants/Colors'
import { GET_HOME_FEED, GET_PUBLIC_FEED, WHOAMI } from '../../graphql/queries'
import { UPDATE_PROJECT_DISCUSSION } from '../../graphql/mutations'
import { SafeImage, SvgImage } from '../../storybook/stories/Image'
import { TinyText, RegularText, Subheading, Paragraph } from '../../storybook/stories/Text'
import { SecondaryButton } from '../../storybook/stories/Button'
import { spacingUnit, capitalizeFirstLetter, renderMentionString, wait, usePrevious } from '../../utils/common'
import DefaultProfilePicture from '../../assets/images/default-profile-picture.jpg'
import { TwitterShare, FacebookShare, CopyLink, LinkedinShare } from '../../assets/images/share'
import CommentIcon from '../../assets/images/reactions/comment'
import ShareIcon from '../../assets/images/share/feed'
import { useMe } from '../withAuth'
import { feedStyles, ShareModal, EditCommentModal } from '../Feed'
import { MyCarousel, VideoDisplay } from '../../storybook/stories/Carousel'
import Link from '../../assets/images/link'
import Options from '../../assets/images/options'

TimeAgo.locale(en)
const timeAgo = new TimeAgo('en-US')

export const ProjectDiscussionItem = ({ item, standAlone, comment, onCommentPress, projectId, activityPage }) => {
  const user = useMe()
  const navigation = useNavigation()
  const route = useRoute()
  const [isModalVisible, setModalVisible] = useState(false)
  const [editVisible, setEditVisible] = useState(false)
  const pressComment = () => {
    if (standAlone || comment) {
      onCommentPress(`@[${item.creatorUsername || item.actorUsername}](${item.createdBy || item.userId})`)
    } else {
      navigation.push('Root', {
        screen: 'Dashboard',
        params: {
          screen: 'ProjectDiscussionItem',
          params: {
            item,
            liked: false,
            comment: true,
            standAlone: true
          }
        }
      })
    }
  }

  const SHARE_URL = `https://wonderapp.co/app/feed/${item.id}`
  const CONTENT = 'Check this discussion from Wonder!'
  let deleteMutation, editMutation
  // if (objectType === 'post') {
  //   editMutation = editPost
  // }
  // if (comment) {
  //   editMutation = editComment
  // }
  console.log('item', item)
  return (
    <>
    <EditCommentModal isVisible={editVisible} setModalVisible={setEditVisible} editMutation={editMutation} />
    <ShareModal isVisible={isModalVisible} url={SHARE_URL} content={CONTENT} setModalVisible={setModalVisible} />
    <View style={feedStyles.feedItemContainer}>
      <View style={feedStyles.feedItemName}>
        <Pressable onPress={() => navigation.push('Root', {
          screen: route && route.params && route.params.tab || 'Profile',
          params: {
            screen: 'UserProfile',
            params: {
              userId: item.userId
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
          }} color={Black}
          onPress={() => {
            if (standAlone || comment) {
              navigation.push('Root', {
                screen: route && route.params && route.params.tab || 'Profile',
                params: {
                  screen: 'UserProfile',
                  params: {
                    userId: item.userId
                  }
                }
              })
            } else {
              navigation.push('Root', {
                screen: route?.params?.tab || 'Profile',
                params: {
                  screen: 'ProjectDiscussionItem',
                  params: {
                    item,
                    liked: false,
                    comment: true,
                    standAlone: true
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
          }} color={Grey200}>{timeAgo.format(new Date(item.createdAt))}</RegularText>     
          </View>
          </View>
        </View>
      </View>
      <View style={feedStyles.feedItemContent}>
        {/* <SvgImage width="24" height="24" srcElement={getCorrectSrc(item.objectType)} style={{
          marginRight: spacingUnit
        }}/> */}
        {
          <Paragraph style={feedStyles.feedText}>
          {renderMentionString({ content: item.content || item.itemContent, textStyle: feedStyles.feedText,  navigation, tab: route && route.params && route.params.tab })}
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
                ] : item.images} images={true} passiveDotColor={Grey800} activeDotColor={Blue400} />
              }
            </>
      </View>

        <View style={feedStyles.reactions}>
          <Pressable onPress={() => {
            if (comment) {
              navigation.push('Root', {
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
          <CommentIcon color={Grey700} style={{
            marginRight: item.commentCount ? spacingUnit : 0
          }}/>
          </Pressable>
          <RegularText color={Grey600} style={{
            marginRight: spacingUnit * 3
          }}>{item.commentCount}</RegularText>
          <Pressable onPress={() => setModalVisible(true)}>
            <ShareIcon color={Grey700} />
          </Pressable> 
          {
            item.userId === user.id &&
            <Pressable style={{
              marginLeft: spacingUnit * 3
            }} onPress={() => {
              if (comment) {
                setEditVisible(true)
              }
            }}>
            <Options color={Grey700} />
          </Pressable>
          }
        </View>
        {
          standAlone &&
          <View
          style={{
            borderBottomColor: Grey300,
            borderBottomWidth: 1,
            marginTop: spacingUnit * 2
          }}
        />
        }
    </View>
    </>
  )
}


export const renderDiscussionItem = ({ projectId, item, navigation, screen, params, activityPage }) => {
  if (item?.privacyLevel === 'private') {
    return null
  }

  return (
    <Pressable key={item && item.id} onPress={() => navigation.push(screen, params)}>
      <ProjectDiscussionItem item={item} key={item.id} activityPage={activityPage} projectId={projectId} />
    </Pressable>
  )
}