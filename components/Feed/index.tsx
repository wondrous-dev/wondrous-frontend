import React, { useCallback, useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Text, View, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Pressable, Dimensions, Linking } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { mentionRegEx, replaceMentionValues } from 'react-native-controlled-mentions'
import regexifyString from 'regexify-string'
import Modal from 'react-native-modal'
import Clipboard from 'expo-clipboard'

import { Grey300, Black, Grey150, Grey200, Grey600, Grey700, Red400, White, Blue400, Grey800 } from '../../constants/Colors'
import { GET_HOME_FEED, WHOAMI } from '../../graphql/queries'
import { REACT_FEED_COMMENT, REACT_FEED_ITEM } from '../../graphql/mutations'
import { SafeImage, SvgImage } from '../../storybook/stories/Image'
import { TinyText, RegularText, Subheading, Paragraph } from '../../storybook/stories/Text'
import { SecondaryButton } from '../../storybook/stories/Button'
import { spacingUnit, capitalizeFirstLetter, renderMentionString, wait } from '../../utils/common'
import DefaultProfilePicture from '../../assets/images/default-profile-picture.jpg'
import ProjectIcon from '../../assets/images/actions/project'
import GoalIcon from '../../assets/images/actions/goal'
import TaskIcon from '../../assets/images/actions/task.svg'
import { LikeOutline, LikeFilled } from '../../assets/images/reactions/like'
import { TwitterShare, FacebookShare, CopyLink, LinkedinShare } from '../../assets/images/share'
import CommentIcon from '../../assets/images/reactions/comment'
import ShareIcon from '../../assets/images/share/feed'
import { useMe } from '../withAuth'
import { tweetNow, linkedinShare, postOnFacebook  } from '../Share'
import { useProfile } from '../../utils/hooks'
import { FlexRowContentModal } from '../../components/Modal'
import { MyCarousel } from '../../storybook/stories/Carousel'
import Link from '../../assets/images/link'
import Celebration from '../../assets/images/celebrations/signupConfetti.svg'

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
    width: spacingUnit * 6,
    height: spacingUnit * 6,
    borderRadius: spacingUnit * 3,
    marginRight: spacingUnit
  },
  feedItemContent: {
    // flex: 1,
    // flexDirection: 'row',
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
  },
  mentionedText: {
    fontSize: 14,
    lineHeight: 22
  },
  feedText: {
    fontSize: 18
  },
  confetti: {
    marginRight: spacingUnit * 0.5,
    marginTop: -spacingUnit
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

const FeedString = ({ item, standAlone }) => {
  const navigation = useNavigation()
  if (item.objectType === 'project') {
    return (
      <View style={{
        paddingRight: spacingUnit * 3
      }}>
          <Paragraph onPress={() => navigation.navigate('Root', {
            screen: 'Profile',
            params: {
              screen: 'ProjectProfile',
              params: {
                projectId: item.projectId
              }
            }
          })} color={Blue400} style={{
            ...feedStyles.feedText,
            fontSize: standAlone ? 18 : 16
          }}>{item.projectName} </Paragraph>
      </View>
    )
  } else if (item.objectType === 'goal' || item.objectType === 'task') {
    return (
      <View style={{
        paddingRight: spacingUnit * 3,
        flexDirection: 'row',
        alignItems: 'flex-start'
      }}>
         {
  item.verb === 'complete' &&
  <SvgImage width="30" height="30" srcElement={Celebration} style={feedStyles.confetti} />
}
       <Paragraph color={Black} style={{
         ...feedStyles.feedText,
        fontSize: standAlone ? 18 : 16,
        }} onPress={() => {
          if (!standAlone) {
            navigation.navigate('Root', {
              screen: 'Profile',
              params: {
                screen: 'ProfileItem',
                params: {
                  item,
                  liked: false,
                  comment: true,
                  standAlone: true
                }
              }
            })
          } else {
            if (item.objectType === 'goal' && standAlone) {
              navigation.navigate('Root', {
                screen: 'Profile',
                params: {
                  screen: 'GoalPage',
                  params: {
                    goalId: item.objectId
                  }
                }
              })
            } else if (item.objectType === 'task' && standAlone) {
              navigation.navigate('Root', {
                screen: 'Profile',
                params: {
                  screen: 'TaskPage',
                  params: {
                    taskId: item.objectId
                  }
                }
              })
            }
          }
        }}>{renderMentionString({ content: item.itemContent ? item.itemName + '. ' + item.itemContent : item.itemName, navigation })} </Paragraph>

      </View>
    )
  } 
  else if (item.objectType === 'ask' || item.objectType === 'post') {
    return (
      <View style={{
        paddingRight: spacingUnit * 3,
      }}>
       <Paragraph color={Black} style={{
         ...feedStyles.feedText,
         fontSize: standAlone ? 18 : 16,
          }} onPress={() => {
            if (!standAlone) {
              navigation.navigate('Root', {
                screen: 'Profile',
                params: {
                  screen: 'ProfileItem',
                  params: {
                    item,
                    liked: false,
                    comment: true,
                    standAlone: true
                  }
                }
              })
            } else {
              if (item.objectType === 'ask') {
                navigation.navigate('Root', {
                  screen: 'Profile',
                  params: {
                    screen: 'AskPage',
                    params: {
                      askId: item.objectId
                    }
                  }
                })
              }
            }
          }}>{renderMentionString({ content: item.itemContent, navigation })} </Paragraph>
  
      </View>
    )
  }
  return null
}


const getActionString = (item) => {
  if (item.verb === 'create') {
    if (item.objectType === 'ask') {
      return `needs help`
    }
    return `created a ${item.objectType}`
  } else if (item.verb === 'complete') {
    return `completed a ${item.objectType}` 
  }
}

const getProjectString = (item) => {
  const navigation = useNavigation()
  if (item.projectName) {
    return (
      <Paragraph color={Grey200} style={{
        fontSize: 16,
        fontFamily: 'Rubik SemiBold',
        textDecorationLine: 'underline'
      }} onPress={() => navigation.navigate('Root', {
          screen: 'Profile',
          params: {
            screen: 'ProjectProfile',
            params: {
              projectId: item.projectId
            }
          }
      })}>
        {item.projectName ? `${item.projectName}` : ''}
      </Paragraph>
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

export const getNewExistingItems = ({ existingItems, liked, comment, item, readField }) => {
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

export const ShareModal = ({ isVisible, url, content, setModalVisible }) => {

  return (
    <FlexRowContentModal
      headerText='Share post via...'
      setModalVisible={setModalVisible}
      isVisible={isVisible}
    >
            <Pressable onPress={() => {
              tweetNow({ twitterShareURL: url, tweetContent: content })
            }}>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <TwitterShare />
              <RegularText style={{
                marginTop: spacingUnit * 0.5
              }}>
                Twitter
              </RegularText>
            </View>
            </Pressable>
            <Pressable onPress={() => {
              linkedinShare({ linkedinShareUrl: url, linkedinContent: content })
            }}>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <LinkedinShare />
              <RegularText style={{
                marginTop: spacingUnit * 0.5
              }}>
                Linkedin
              </RegularText>
            </View>
            </Pressable>
            <Pressable onPress={() => {
              postOnFacebook({ facebookShareURL: url, postContent: content })
            }}>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <FacebookShare />
              <RegularText style={{
                marginTop: spacingUnit * 0.5
              }}>
                Facebook
              </RegularText>
            </View>
            </Pressable>
            <Pressable onPress={() => {
              Clipboard.setString(url)
              setModalVisible(false)
            }}>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <CopyLink />
              <RegularText style={{
                marginTop: spacingUnit * 0.5
              }}>
                Copy Link
              </RegularText>
            </View>
            </Pressable>
     </FlexRowContentModal>  

  )
}

export const FeedItem = ({ item, standAlone, comment, onCommentPress, onLikePress }) => {
  const user = useMe()
  const navigation = useNavigation()
  const [liked, setLiked] = useState(null)
  const [reactionCount, setReactionCount] = useState(0)
  const [commentLiked, setCommentLiked] = useState(null)
  const [isModalVisible, setModalVisible] = useState(false)
  const pressComment = () => {
    if (standAlone || comment) {
      onCommentPress(`@[${item.actorUsername}](${item.userId})`)
    } else {
      navigation.navigate('Root', {
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
      })
    }
  }
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
            if (liked && user && user.reactedFeedComments && user.reactedFeedComments.includes(item.id)) {
              // Unliked
              const newReactedFeedComments = user.reactedFeedComments.filter(reactedFeedComment => {
                return reactedFeedComment !== item.id
              })

              return [{
                ...user,
                reactedFeedComments: newReactedFeedComments
              }]
            } else if (!liked && user && user.reactedFeedComments && !user.reactedFeedComments.includes(item.id)) {
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
    if (user && user.reactedFeedComments && user.reactedFeedComments.includes(item.id)) {
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

  const SHARE_URL = `https://wonderapp.co/feed/${item.id}`
  const CONTENT = 'Check this discussion from Wonder!'
  return (
    <>
    <ShareModal isVisible={isModalVisible} url={SHARE_URL} content={CONTENT} setModalVisible={setModalVisible} />
    <View style={feedStyles.feedItemContainer}>
      <View style={feedStyles.feedItemName}>
        <Pressable onPress={() => navigation.navigate('Root', {
          screen: 'Profile',
          params: {
            screen: 'UserProfile',
            params: {
              userId: item.userId
            }
          }
        })}>
          <SafeImage style={feedStyles.feedItemImage} src={item.actorProfilePicture} defaultImage={DefaultProfilePicture} />
        </Pressable>
        <View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'flex-start'
          }}>
            <View>
          <Paragraph style={{
          }} style={{
            fontFamily: 'Rubik SemiBold'
          }} color={Black}
          onPress={() => navigation.navigate('Root', {
            screen: 'Profile',
            params: {
              screen: 'UserProfile',
              params: {
                userId: item.userId
              }
            }
          })}         
          >{item.actorFirstName} {item.actorLastName}{` `}</Paragraph>
          <RegularText style={{
            lineHeight: '18'
          }} color={Grey200}>{timeAgo.format(new Date(item.timestamp))}</RegularText>     
          </View>
                    {!comment && !(item.objectType === 'post') &&
            <Paragraph color={Grey200} style={{

            }}>
              {getActionString(item)} {
                item.objectType !== 'project' &&
                <>
{item.projectName && 'in'} {getProjectString(item)}
                </>
              }
            </Paragraph>
          }
          </View>
        </View>
      </View>
      <View style={feedStyles.feedItemContent}>
        {/* <SvgImage width="24" height="24" srcElement={getCorrectSrc(item.objectType)} style={{
          marginRight: spacingUnit
        }}/> */}
        {comment ?
          <Paragraph style={feedStyles.feedText}>
          {renderMentionString({ content: item.itemContent, textStyle: feedStyles.mentionedText, navigation })}
          </Paragraph>
          :
          <FeedString item={item} standAlone={standAlone} />
        }
        {
          item.media &&
          <View style ={{
            flex: 1,
            flexDirection:'column',
            marginTop: spacingUnit * 2
          }}>
          {item.media.link && 
          <View style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>
          <Link color={Grey800} style={{
            marginRight: spacingUnit * 0.5,
            width: spacingUnit * 2.5,
            height: spacingUnit * 2.5
          }} />
          <Paragraph color={Blue400} style={{
            fontSize: standAlone ? 18 : 16,
          }} onPress={() => Linking.openURL(item.media.link)}>
            {item.media.link}
          </Paragraph>
          </View>
          }
          {
            item.media.images &&
            <MyCarousel data={item.media.images} images={true} passiveDotColor={Grey800} activeDotColor={Blue400} containerStyle={{

            }}/>
          }
          </View>
        }
      </View>

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
          <Pressable onPress={pressComment}>
          <CommentIcon color={Grey700} style={{
            marginRight: spacingUnit
          }}/>
          </Pressable>
          <RegularText color={Grey600} style={{
            marginRight: spacingUnit * 3
          }}>{item.commentCount}</RegularText>
          <Pressable onPress={() => setModalVisible(true)}>
            <ShareIcon color={Grey700} />
          </Pressable>  
        </View>

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
                {reactionCount} {reactionCount === '1' || reactionCount === 1 ? 'like' : 'likes'}
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

export const renderItem = ({ item, navigation, screen, params }) => {
  return (
    <Pressable key={item && item.id} onPress={() => navigation.navigate(screen, params)}>
      <FeedItem item={item} key={item.id} />
    </Pressable>
  )
}



export const ProjectFeed = () => {
  const navigation = useNavigation()
  const {
    refreshing,
    setRefreshing,
    projectFeedData,
    projectFeedLoading,
    projectFeedError,
    getProjectFeed
  } = useProfile()

  useEffect(() => {
    getProjectFeed()
  }, [])
  if (projectFeedData && !projectFeedLoading) {
    setRefreshing(false)
  }
  return (
    <>
    <FlatList 
      contentContainerStyle={{
        paddingBottom: spacingUnit * 10
      }}
      data={projectFeedData}
      renderItem={({ item }) => renderItem({ item, navigation })}
      keyExtractor={item => item.id}
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
    </>
  )
}

export const HomeFeed = () => {
  const user = useMe()
  const [refreshing, setRefreshing] = useState(false)
  const [feed, setFeed] = useState([])
  const navigation = useNavigation()
  const {loading, data, error, refetch, fetchMore} = useQuery(GET_HOME_FEED, {
    fetchPolicy: 'network-only'
  })
  if (error) {
    console.log('Error fetching Feed', error)
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    if (refetch) {
      refetch()
    }
    wait(2000).then(() => setRefreshing(false))
  }, [])

  useEffect(() => {
    if (data && data.getHomeFeed) {
      setFeed(data && data.getHomeFeed)
    }
  }, [data && data.getHomeFeed])

  if (loading) {
    return (
      <View style={{
        backgroundColor: White,
        paddingTop: 16
      }}>
        <ActivityIndicator />
      </View>
      )
  }
  const filteredData = (feed.filter(feedItem => {

    return user && (user.id !== feedItem.userId)
  }))
  return (
    <>
    <FlatList 
      contentContainerStyle={{
        paddingBottom: spacingUnit * 10
      }}
      data={filteredData}
      renderItem={({ item }) => renderItem({ item, navigation, screen: 'Root', params: {
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
      }   })}
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
    </>
  )
}
