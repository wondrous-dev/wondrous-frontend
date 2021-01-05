import React, { useCallback, useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { Text, View, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Pressable, Dimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { mentionRegEx, replaceMentionValues } from 'react-native-controlled-mentions'
import regexifyString from 'regexify-string'

import { Grey300, Black, Grey200, Grey600, Grey700, Red400, White, Blue400 } from '../../constants/Colors'
import { GET_HOME_FEED, WHOAMI } from '../../graphql/queries'
import { REACT_FEED_COMMENT, REACT_FEED_ITEM } from '../../graphql/mutations'
import { SafeImage, SvgImage } from '../../storybook/stories/Image'
import { TinyText, RegularText } from '../../storybook/stories/Text'
import { spacingUnit, capitalizeFirstLetter, insertComponentsIntoText, getRegexGroup } from '../../utils/common'
import DefaultProfilePicture from '../../assets/images/default-profile-picture.jpg'
import ProjectIcon from '../../assets/images/actions/project.svg'
import GoalIcon from '../../assets/images/actions/goal.svg'
import TaskIcon from '../../assets/images/actions/task.svg'
import { LikeOutline, LikeFilled } from '../../assets/images/reactions/like'
import CommentIcon from '../../assets/images/reactions/comment'
import ShareIcon from '../../assets/images/share/feed'
import { useMe } from '../withAuth'

const FeedItemTypes = [
  'id',
  'timestamp',
  'userId',
  'verb',
  'objectType',
  'objectId',
  'projectId',
  'projectName',
  'privacyLevel',
  'actorFirstName',
  'actorLastName',
  'actorUsername',
  'actorProfilePicture',
  'parentCommentId',
  'itemName',
  'itemContent',
  'commentCount',
  'reactionCount',
  'media',
]

TimeAgo.locale(en)
const timeAgo = new TimeAgo('en-US')

const feedStyles = StyleSheet.create({
  feedItemContainer: {
    padding: spacingUnit * 2
  },
  feedItemName: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  feedItemImage: {
    width: spacingUnit * 3,
    height: spacingUnit * 3,
    borderRadius: spacingUnit * 1.25,
    marginRight: spacingUnit
  },
  feedItemContent: {
    flex: 1,
    flexDirection: 'row',
    marginTop: spacingUnit * 3,
    alignContent: 'center',
    flexShrink: 1
  },
  reactions: {
    flexDirection: 'row',
    marginTop: spacingUnit * 3,
    alignItems: 'center'
  },
  likeCount: {
    paddingLeft: spacingUnit * 2,
    paddingTop: spacingUnit,
    paddingBottom: spacingUnit
  }
})

const getCorrectSrc = (itemType) => {
  switch(itemType) {
    case 'project':
      return ProjectIcon
    case 'goal':
      return GoalIcon
    case 'task':
      return TaskIcon
    default:
      return ''
  }
}

const FeedString = ({ item }) => {
  if (item.objectType === 'project') {
    return (
      <View style={{
        paddingRight: spacingUnit * 2
      }}>
        <RegularText color={Black} style={{
          flex: 1,
          flexWrap: 'wrap'
        }}>
          {capitalizeFirstLetter(item.verb)} {item.objectType} - <RegularText style={{
            fontFamily: 'Rubik SemiBold',
            textDecorationLine: 'underline'
          }}> {item.projectName} </RegularText>
        </RegularText>
      </View>
    )
  }
  if (item.objectType === 'goal' || item.objectType === 'task') {
    return (
      <View style={{
        paddingRight: spacingUnit * 2,
        flexDirection: 'row'
      }}>
      <RegularText color={Black} style={{
          flexWrap: 'wrap',
          flexShrink: 1
      }}>
        {capitalizeFirstLetter(item.verb)} {item.objectType} <RegularText style={{
          fontFamily: 'Rubik SemiBold',
          textDecorationLine: 'underline',
        }}>{item.itemName} </RegularText> for <RegularText style={{
          fontFamily: 'Rubik SemiBold',
          textDecorationLine: 'underline'
        }}> {item.projectName} </RegularText>
      </RegularText>
      </View>
    )
  }
  return null
}

const getItemFromRef = (ref, readField) => {
  const finalItem = {}
  FeedItemTypes.forEach(item => {
    const field = readField(item, ref)
    finalItem[item] = field
  })
  return {
    ...finalItem,
    __typename: 'FeedItem'
  }
}

const getNewExistingItems = ({ existingItems, liked, comment, item, readField }) => {
  const newExistingFeedComments = existingItems.map(itemRef => {
    const itemObj = getItemFromRef(itemRef, readField)
    if (itemObj.id === item.id) {
      if (liked) {
        return {
          ...itemObj,
          reactionCount: itemObj.reactionCount - 1,
          ...(comment && {
            commentReacted: false
          })
        }
      } else if (!liked) {
        return {
          ...itemObj,
          reactionCount: itemObj.reactionCount + 1,
          ...(comment && {
            commentReacted: true
          })
        }
      }
    }
    return itemObj
  })
  return newExistingFeedComments
}


export const renderMentionString = (content, navigation) => {
  const final = regexifyString({
    pattern: mentionRegEx,
    decorator: (match, index) => {
      const mentionExp = /(?<original>(?<trigger>.)\[(?<name>([^[]*))]\((?<id>([\d\w-]*))\))/.exec(match)
      if (!mentionExp) {
        return match
      }
      const { id, name } = mentionExp.groups
      return (
        <Pressable onPress={() => navigation.navigate('Root', {
          screen: 'Profile',
          params: {
              userId: id
          }
        })} style={{
          marginTop: -5.5
        }}>
          <RegularText color={Blue400}>
            {`@${name}`}
          </RegularText>
        </Pressable>
      )
    },
    input: content
  })

  return final
}
export const FeedItem = ({ item, standAlone, comment, onCommentPress, onLikePress }) => {
  const user = useMe()
  const navigation = useNavigation()
  const [liked, setLiked] = useState(null)
  const [reactionCount, setReactionCount] = useState(0)
  const [commentLiked, setCommentLiked] = useState(null)
  const [reactFeedComment] = useMutation(REACT_FEED_COMMENT, {
    update(cache) {
      cache.modify({
        fields: {
          getFeedItemComments(existingFeedComments=[], { readField }) {
            return getNewExistingItems({ existingItems: existingFeedComments, liked: commentLiked, comment: true, item, readField })
          }
        }
      })
    }
  })
  const [reactFeedItem] = useMutation(REACT_FEED_ITEM, {
    update(cache) {
      cache.modify({
        fields: {
          getHomeFeed(existingFeedItems = [], { readField }) {
            return getNewExistingItems({ existingItems: existingFeedItems, liked, comment: false, item, readField})
          },
          users(existingUser = {}) {
            if (liked && user && user.reactedFeedComments.includes(item.id)) {
              // Unliked
              const newReactedFeedComments = user.reactedFeedComments.filter(reactedFeedComment => {
                return reactedFeedComment !== item.id
              })

              return [{
                ...user,
                reactedFeedComments: newReactedFeedComments
              }]
            } else if (!liked && user && !user.reactedFeedComments.includes(item.id)) {
              return [{
                ...user,
                reactedFeedComments: [...user.reactedFeedComments, item.id]
              }]
            }
          }
        }
      })
    }
  })

  useEffect(() => {
    if (user && user.reactedFeedComments.includes(item.id)) {
      setLiked(true)
    } else {
      setLiked(false)
    }

    setReactionCount(Number(item.reactionCount))
    setCommentLiked(item.commentReacted)
  }, [user && user.reactedFeedComments, item.reactionCount, item.commentReacted])

  const likeFeedItem = useCallback(async liked => {
    if (comment) {
      try {
        reactFeedComment({
          variables: {
            feedCommentId: item.id
          }
        })
      } catch (error) {
        console.log('error reacting to comment', JSON.stringify(error, null, 2))
      }
    } else {
      try {
        reactFeedItem({
          variables: {
            feedItemId: item.id
          }
        })
      } catch (error) {
        console.log("error", JSON.stringify(error, null, 2))
      }
    }
  }, [])


  return (
    <>
    <View style={feedStyles.feedItemContainer}>
      <View style={feedStyles.feedItemName}>
        <SafeImage style={feedStyles.feedItemImage} src={item.actorProfilePicture} defaultImage={DefaultProfilePicture} />
        <RegularText style={{
          marginRight: spacingUnit
        }} color={Black}>{item.actorFirstName} {item.actorLastName}</RegularText>
        <RegularText style={{
          marginRight: spacingUnit * 0.5
        }} color={Grey200}>{item.actorUsername}</RegularText>
        <RegularText style={{
          marginRight: spacingUnit * 0.5,
          marginTop: -spacingUnit
        }} color={Grey200}>.</RegularText>
        <RegularText style={{
          marginRight: spacingUnit
        }} color={Grey200}>{timeAgo.format(new Date(item.timestamp))}</RegularText>
      </View>
      <View style={feedStyles.feedItemContent}>
        {/* <SvgImage width="24" height="24" srcElement={getCorrectSrc(item.objectType)} style={{
          marginRight: spacingUnit
        }}/> */}
        {comment ?
          <RegularText>
          {renderMentionString(item.itemContent, navigation)}
          </RegularText>
          :
          <FeedString item={item} />
        }
      </View>
      {
        standAlone ?
        <View style={[feedStyles.reactions, {
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }]}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>
          <Pressable onPress={() => likeFeedItem(liked)} > 
          {
            liked || commentLiked ?
            <LikeFilled color={Red400} style={{
              marginRight: spacingUnit
            }} />
            :
            <LikeOutline color={Grey700} style={{
              marginRight: spacingUnit
            }} />
          }
          </Pressable>
          {/* <RegularText color={Grey600} style={{
            marginRight: spacingUnit * 3,
          }}>{item.reactionCount}</RegularText> */}
          </View>
          <CommentIcon color={Grey700} style={{
            marginRight: spacingUnit,
            width: spacingUnit * 3.5,
            height: spacingUnit * 3.5
          }}/>
          <ShareIcon color={Grey700} style={{
            width: spacingUnit * 3.5,
            height: spacingUnit * 3.5
          }} />
        </View>
      :
        <View style={feedStyles.reactions}>
          <Pressable onPress={() => likeFeedItem(liked)} > 
          {
            liked || commentLiked ?
            <LikeFilled color={Red400} style={{
              marginRight: spacingUnit
            }} />
            :
            <LikeOutline color={Grey700} style={{
              marginRight: spacingUnit
            }} />
          }
          </Pressable>
          <RegularText color={Grey600} style={{
            marginRight: spacingUnit * 3,
          }}>{reactionCount}</RegularText>
          <CommentIcon color={Grey700} style={{
            marginRight: spacingUnit
          }}/>
          <RegularText color={Grey600} style={{
            marginRight: spacingUnit * 3
          }}>{item.commentCount}</RegularText>
          <ShareIcon color={Grey700} />
        </View>
      }

    </View>
    {standAlone &&
      <>
        <View
          style={{
            borderBottomColor: Grey300,
            borderBottomWidth: 1,
          }}
        />
        {
          Number(reactionCount) > 0 &&
          <View>
            <>
              <RegularText style={feedStyles.likeCount}>
                {reactionCount} {reactionCount === '1' ? 'like' : 'likes'}
              </RegularText>
              <View
                style={{
                  borderBottomColor: Grey300,
                  borderBottomWidth: 1,
                }}
              />
            </>
      </View>
        }
      </>
    }
    </>
  )
}

export const renderItem = ({ item, navigation }) => {
  return (
    <Pressable onPress={() => navigation.navigate('Root', {
      screen: 'Dashboard',
      params: {
        screen: 'FeedItem',
        params: {
          item,
          liked: false,
          comment: true,
          standAlone: true
        }
      }
    })}>
      <FeedItem item={item} key={item.id} />
    </Pressable>
  )
}

const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

export const HomeFeed = () => {
  const [refreshing, setRefreshing] = useState(false)
  const navigation = useNavigation()
  const [getItems, {loading, data, error, refetch, fetchMore}] = useLazyQuery(GET_HOME_FEED, {
    fetchPolicy: 'network-only'
  })
  if (error) {
    console.log('Error fetching Feed', error)
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    getItems()
    wait(2000).then(() => setRefreshing(false))
  }, [])

  useEffect(() => {
    getItems()
  }, [])

  if (loading) {
    return (
      <View style={{
        height: Dimensions.get("window").height,
        backgroundColor: White,
        paddingTop: 16
      }}>
        <ActivityIndicator />
      </View>
      )
  }

  return (
    <FlatList 
      contentContainerStyle={{
        paddingBottom: spacingUnit * 10
      }}
      data={data && data.getHomeFeed}
      renderItem={({ item }) => renderItem({ item, navigation })}
      keyExtractor={item => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ItemSeparatorComponent={() => (
        <View
          style={{
            borderBottomColor: Grey300,
            borderBottomWidth: 1,
          }}
        />
      )}
    >
    </FlatList>
  )
}
