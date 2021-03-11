import React, { useCallback, useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Text, View, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Pressable, Dimensions, Linking } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import Clipboard from 'expo-clipboard'

import { Grey300, Black, Grey150, Grey200, Grey600, Grey700, Red400, White, Blue400, Grey800 } from '../../constants/Colors'
import { GET_HOME_FEED, WHOAMI } from '../../graphql/queries'
import { DELETE_FEED_COMMENT, REACT_FEED_COMMENT, REACT_FEED_ITEM } from '../../graphql/mutations'
import { SafeImage, SvgImage } from '../../storybook/stories/Image'
import { TinyText, RegularText, Subheading, Paragraph } from '../../storybook/stories/Text'
import { SecondaryButton } from '../../storybook/stories/Button'
import { spacingUnit, capitalizeFirstLetter, renderMentionString, wait, usePrevious } from '../../utils/common'
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
import Options from '../../assets/images/options'

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
    fontSize: 18,
    flex: 1
  },
  confetti: {
    marginRight: spacingUnit,
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
  const route = useRoute()
  const {
    tab
  } = route
  if (item.objectType === 'project') {
    return (
      <View style={{
        paddingRight: spacingUnit * 3
      }}>
          <Paragraph onPress={() => navigation.navigate('Root', {
            screen: tab || 'Profile',
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
              screen: tab || 'Profile',
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
                screen: tab || 'Profile',
                params: {
                  screen: 'GoalPage',
                  params: {
                    goalId: item.objectId
                  }
                }
              })
            } else if (item.objectType === 'task' && standAlone) {
              navigation.navigate('Root', {
                screen: tab || 'Profile',
                params: {
                  screen: 'TaskPage',
                  params: {
                    taskId: item.objectId
                  }
                }
              })
            }
          }
        }}>{renderMentionString({ content: item.itemContent ? item.itemName + '. ' + item.itemContent : item.itemName, navigation, tab })} </Paragraph>

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
                screen: route && route.params && route.params.tab || 'Profile',
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
                  screen: route && route.params && route.params.tab || 'Profile',
                  params: {
                    screen: 'AskPage',
                    params: {
                      askId: item.objectId
                    }
                  }
                })
              }
            }
          }}>{renderMentionString({ content: item.itemContent, navigation, tab })} </Paragraph>
  
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
  const route = useRoute()
  if (item.projectName) {
    return (
      <Paragraph color={Grey200} style={{
        fontSize: 16,
        fontFamily: 'Rubik SemiBold',
        textDecorationLine: 'underline'
      }} onPress={() => navigation.navigate('Root', {
          screen: route && route.params && route.params.tab || 'Profile',
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

export const getNewExistingItems = ({ existingItems, liked, comment, item, readField, reactionCount }) => {
  const newExistingFeedComments = existingItems.map(itemRef => {
    const split = itemRef.__ref.split(':')
    const itemId = split[split.length - 1]
    if (itemId === item.id) {
      const itemObj = getItemFromRef(itemRef, readField)
      if (!liked) {
        return {
          ...itemObj,
          reactionCount: reactionCount + 1,
          media: itemObj.media || {
            media: null,
            link: null,
            __typename: 'Media'
          },
          ...(comment && {
            commentReacted: false
          })
        }
      } else if (liked) {
        return {
          ...itemObj,
          reactionCount: reactionCount - 1,
          media: itemObj.media || {
            media: null,
            link: null,
            __typename: 'Media'
          },
          ...(comment && {
            commentReacted: true
          })
        }
      }
    }
    return itemRef
  })
  return [...newExistingFeedComments]
}

export const DeleteCommentModal = ({ isVisible, setModalVisible, deleteMutation }) => {
  return (
    <FlexRowContentModal
    headerText='Delete comment'
    setModalVisible={setModalVisible}
    isVisible={isVisible}
    >
      <View />
      <Pressable onPress={() => {
        deleteMutation()
        setModalVisible(false)
      }}>
        <Paragraph color={Red400} style={{

        }}>
          Delete comment
        </Paragraph>
      </Pressable>
      <View />
    </FlexRowContentModal>
  )
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
  const route = useRoute()

  const [liked, setLiked] = useState(null)
  const [reactionCount, setReactionCount] = useState(Number(item.reactionCount) || 0)
  const [commentLiked, setCommentLiked] = useState(null)
  const [isModalVisible, setModalVisible] = useState(false)
  const [deleteVisible, setDeleteVisible] = useState(false)
  const previousReactionCount = usePrevious(item.reactionCount)
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
  const [deleteFeedComment] = useMutation(DELETE_FEED_COMMENT, {
    update(cache) {
      cache.modify({
        fields: {
          getFeedItemComments(existingFeedComments=[], { readField }) {
            return existingFeedComments.filter(
              commentRef => item.id !== readField('id', commentRef)
            )
          }
        }
      })
    },
    variables: {
      feedCommentId: item.id
    }
  })

  const [reactFeedComment] = useMutation(REACT_FEED_COMMENT, {
    update(cache) {
      cache.modify({
        fields: {
          getFeedItemComments(existingFeedComments=[], { readField }) {
            return getNewExistingItems({ existingItems: existingFeedComments, liked: commentLiked, comment: true, item, readField, reactionCount })
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
            const newItems = getNewExistingItems({ existingItems: existingFeedItems, liked, comment: false, item, readField, reactionCount})
            return newItems
          },
          users(existingUser = {}) {
            if (liked && user && user.reactedFeedItems && user.reactedFeedItems.includes(item.id)) {
              // Unliked
              const newReactedFeedComments = user.reactedFeedItems.filter(reactedFeedComment => {
                return reactedFeedComment !== item.id
              })

              return [{
                ...user,
                reactedFeedItems: newReactedFeedComments
              }]
            } else if (!liked && user && user.reactedFeedItems && !user.reactedFeedItems.includes(item.id)) {
              return [{
                ...user,
                reactedFeedItems: [...user.reactedFeedItems, item.id]
              }]
            }
          }
        }
      })
    }
  })

  useEffect(() => {

    if (user && user.reactedFeedItems && user.reactedFeedItems.includes(item.id)) {
      setLiked(true)
    } else {
      setLiked(false)
    }
    if (previousReactionCount && previousReactionCount !== item.reactionCount) {
      setReactionCount(item.reactionCount)
    }
    setCommentLiked(item.commentReacted)
  }, [user && user.reactedFeedItems, item.reactionCount, item.commentReacted])
  const likeFeedItem = useCallback(async (liked, reactionCount) => {
    if (!liked) {
      setReactionCount(Number(reactionCount) + 1)
    } else if (liked) {
      setReactionCount(Number(reactionCount) - 1 >= 0 ? Number(reactionCount) - 1 : 0)
    }
    setLiked(!liked)
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

  const SHARE_URL = `https://wonderapp.co/app/feed/${item.id}`
  const CONTENT = 'Check this discussion from Wonder!'

  return (
    <>
    <DeleteCommentModal isVisible={deleteVisible} setModalVisible={setDeleteVisible} deleteMutation={deleteFeedComment} />
    <ShareModal isVisible={isModalVisible} url={SHARE_URL} content={CONTENT} setModalVisible={setModalVisible} />
    <View style={feedStyles.feedItemContainer}>
      <View style={feedStyles.feedItemName}>
        <Pressable onPress={() => navigation.navigate('Root', {
          screen: route && route.params && route.params.tab || 'Profile',
          params: {
            screen: 'UserProfile',
            params: {
              userId: item.userId
            }
          }
        })}>
          <SafeImage style={feedStyles.feedItemImage} src={item.actorThumbnail || item.actorProfilePicture} defaultImage={DefaultProfilePicture} />
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
            screen: route && route.params && route.params.tab || 'Profile',
            params: {
              screen: 'UserProfile',
              params: {
                userId: item.userId
              }
            }
          })}         
          >{item.actorFirstName} {item.actorLastName}{` `}
                    {!comment && !(item.objectType === 'post') &&
            <Paragraph color={Grey200}>
              {getActionString(item)} {
                item.objectType !== 'project' &&
                <>
{item.projectName && 'in'} {getProjectString(item)}
                </>
              }
            </Paragraph>
          }
          </Paragraph>
          <RegularText style={{
            lineHeight: 18
          }} color={Grey200}>{timeAgo.format(new Date(item.timestamp))}</RegularText>     
          </View>
          </View>
        </View>
      </View>
      <View style={feedStyles.feedItemContent}>
        {/* <SvgImage width="24" height="24" srcElement={getCorrectSrc(item.objectType)} style={{
          marginRight: spacingUnit
        }}/> */}
        {comment ?
          <Paragraph style={feedStyles.feedText}>
          {renderMentionString({ content: item.itemContent, textStyle: feedStyles.feedText,  navigation, tab: route && route.params && route.params.tab })}
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
          <Pressable onPress={() => likeFeedItem(liked, reactionCount)} > 
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
          <RegularText color={Grey600} style={{
            marginRight: spacingUnit * 3,
          }}>{reactionCount}</RegularText>
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
            comment && item.userId === user.id &&
            <Pressable style={{
              marginLeft: spacingUnit * 3
            }} onPress={() => setDeleteVisible(true)}>
            <Options color={Grey700} />
          </Pressable>
          } 
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
            <Pressable onPress={() => navigation.navigate('Root', {
              screen: route && route.params && route.params.tab || 'Profile' || 'Profile',
              params: {
                screen: 'UserList',
                params: {
                  feedItemId: item.id
                }
              }
            })}>
              <RegularText style={feedStyles.likeCount}>
                {reactionCount} {reactionCount === '1' || reactionCount === 1 ? 'like' : 'likes'}
              </RegularText>
              <View
                style={{
                  borderBottomColor: Grey300,
                  borderBottomWidth: 1,
                }}
              />
            </Pressable>
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
      onEndReached={async () => {
        if (fetchMore) {
          try {
            const result = await fetchMore({
              variables: {
                offset: feed.length
              }
            })
            if (result && result.data && result.data.getHomeFeed) {
              setFeed([...feed, ...result.data.getHomeFeed])
            }
          } catch (err) {
            console.log('err fetching more', err)
          }
        }
      }}
    >
    </FlatList>
    </>
  )
}
