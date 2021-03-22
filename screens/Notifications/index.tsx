import React, { useCallback, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { SafeAreaView, RefreshControl, Image, StyleSheet, View, FlatList, ActivityIndicator, Pressable } from 'react-native'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { createStackNavigator } from '@react-navigation/stack'

import { useMe, withAuth } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { White, Grey300, Black, Grey800, Blue100 } from '../../constants/Colors'
import { GET_NOTIFICATIONS, GET_FEED_ITEM_FOR_FEED_COMMENT, GET_FEED_ITEM, GET_POST_ITEM, GET_UNREAD_NOTIFICATION_COUNT, GET_PROJECT_INVITE_FROM_NOTIFICATION } from '../../graphql/queries'
import { MARK_NOTIFICATION_AS_VIEWED, ACCEPT_PROJECT_INVITE } from '../../graphql/mutations'
import DefaultProfilePicture from '../../assets/images/default-profile-picture.jpg'
import LogoImage from '../../assets/images/logo.png'
import { RegularText } from '../../storybook/stories/Text'
import { SafeImage } from '../../storybook/stories/Image'
import { spacingUnit, wait } from '../../utils/common'
import apollo from '../../services/apollo'
import UserProfile from '../Profile/UserProfile'
import ProjectProfile from '../Profile/ProjectProfile'
import ProjectList from '../Profile/ProjectList'
import WorkflowWelcome from '../Workflow/Welcome'
import SetupGoal from '../Workflow/SetupGoal'
import SetupTask from '../Workflow/SetupTask'
import SetupAsk from '../Workflow/SetupAsk'
import StreakIntro from '../Workflow/StreakIntro'
import Links from '../Profile/Links'
import UserList from '../Profile/UserList'
import ProjectSetupCategory from '../SignupFlow/ProjectSetupCategory'
import ProjectTagSelectionScreen from '../SignupFlow/ProjectTagSelectionScreen'
import FeedItem from '../FeedItem'
import GoalPage from '../Actions/Goal'
import TaskPage from '../Actions/Task'
import AskPage from '../Actions/Ask'
import ActionList from '../Actions/ActionList'
import ReviewIcon from '../../assets/images/notification/review'
import ReviewWelcome from '../Review/ReviewWelcome'
import CreateReview from '../Review/CreateReview'
import IdChecker from '../Profile/IdChecker'
import HouseKeeping from '../Review/HouseKeeping'
import ReviewPage from '../Review/ReviewPage'
import { GET_REVIEW_FROM_REVIEW_COMMENT } from '../../graphql/queries/review'
import { listStyles } from '../Profile/style'

TimeAgo.locale(en)
const timeAgo = new TimeAgo('en-US')

const Stack = createStackNavigator()

const notificationStyles = StyleSheet.create({
  notificationItemContainer: {
    padding: spacingUnit * 2,
    paddingTop: spacingUnit * 3,
    paddingBottom: spacingUnit * 3,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  notificationItemName: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  notificationItemContent: {
    flex: 1,
    flexDirection: 'row',
    marginTop: spacingUnit * 3,
    alignContent: 'center',
    flexShrink: 1
  },
  notificationImage: {
    marginRight: 8,
    width: spacingUnit * 6,
    height: spacingUnit * 6,
    borderRadius: spacingUnit * 3
  }
});


export const getNotificationPressFunction = async ({ notificationInfo, navigation, tab, notifications, push=false }) => {
  const {
    type,
    objectId,
    objectType,
    id,
    actorId
  } = notificationInfo
  if (type !== 'welcome') {
    try {
      apollo.mutate({
        mutation: MARK_NOTIFICATION_AS_VIEWED,
        variables: {
          notificationId: id
        },
        refetchQueries: [
          {query: GET_UNREAD_NOTIFICATION_COUNT}
        ],
        update: (cache, { data }) => {
          cache.modify({
            fields: {
              getNotifications() {
                // console.log('existingGoals', existingGoals)
                if (notifications) {
                  const newNotifications = notifications.map(notification => {
                    if (notification.id === id) {
                      const newNotification = {...notification}
                      newNotification.viewedAt = new Date()
                      return newNotification
                    }
                    return notification
                  })
                  return newNotifications
                }
              }
            }
          })
        }
      })
    } catch (e) {
      console.log('error marking as viewed')
    }
  }

  switch(type) {
    case 'welcome':
      navigation.push('Root', {
        screen: tab || 'Profile',
        params: {
          screen: 'UserProfile'
        }
      })
      break
    case 'mention':
      let actionScreen = ''
      let params = {}
      if (objectType === 'goal') {
        actionScreen = 'GoalPage'
        params = {
          goalId: objectId
        }
      } else if (objectType === 'task') {
        actionScreen = 'TaskPage'
        params = {
          taskId: objectId
        }
      } else if (objectType === 'ask') {
        actionScreen = 'AskPage'
        params = {
          askId: objectId
        }
      } else if (objectType === 'post') {
        const postResponse = await apollo.query({
          query: GET_POST_ITEM,
          variables: {
            postId: objectId
          }
        })
        if (postResponse && postResponse.data && postResponse.data.getPostItem) {
          navigation.push('Root', {
            screen : tab || 'Profile',
            params: {
              screen: 'ProfileItem',
              params: {
                item: postResponse.data.getPostItem,
                comment: true,
                standAlone: true
              }
            }
          })
        }
        break
      } else if (objectType === 'feed_comment') {
        // Fetch feed review id and then navigate there
        const feedResponse = await apollo.query({
          query: GET_FEED_ITEM_FOR_FEED_COMMENT,
          variables: {
            commentId: objectId
          }
        })
        if (feedResponse && feedResponse.data && feedResponse.data.getFeedItemForFeedComment) {
          navigation.push('Root', {
            screen: tab || 'Profile',
            params: {
              screen: 'ProfileItem',
              params: {
                item: feedResponse.data.getFeedItemForFeedComment,
                comment: true,
                standAlone: true
              }
            }
          })
        }
        break
      } else if (objectType === 'review_comment') {
        const reviewResponse = await apollo.query({
          query: GET_REVIEW_FROM_REVIEW_COMMENT,
          variables: {
            commentId: objectId
          }
        })
        if (reviewResponse && reviewResponse.data && reviewResponse.data.getReviewFromReviewComment) {
          navigation.push('Root', {
            screen: tab || 'Profile',
            params: {
              screen: 'ReviewPage',
              params: {
                initialReview: reviewResponse.data.getReviewFromReviewComment,
                reviewId: reviewResponse.data.getReviewFromReviewComment.id
              }
            }
          })
        }
        break
      } else if (objectType === 'review') {
        navigation.push('Root', {
          screen: tab || 'Profile',
          params: {
            screen: 'ReviewPage',
            params: {
              reviewId: objectId
            }
          }
        })
        break
      }

      navigation.push('Root', {
        screen: tab || 'Profile',
        params: {
          screen: actionScreen,
          params
        }
      })
      break
    case 'reaction':
      if (objectType === 'feed_item') {
        const feedItemResponse = await apollo.query({
          query: GET_FEED_ITEM,
          variables: {
            feedItemId: objectId
          }
        })
        if (feedItemResponse && feedItemResponse.data && feedItemResponse.data.getFeedItem) {
          navigation.push('Root', {
            screen: tab || 'Profile',
            params: {
              screen : 'ProfileItem',
              params: {
                item: feedItemResponse.data.getFeedItem,
                comment: true,
                standAlone: true
              }
            }
          })
        }
      } else if (objectType === 'feed_comment') {
        console.log('objectId', notificationInfo)
        const feedItemCommentResponse = await apollo.query({
          query: GET_FEED_ITEM_FOR_FEED_COMMENT,
          variables: {
            commentId: objectId
          }
        })
        if (feedItemCommentResponse?.data?.getFeedItemForFeedComment) {
          navigation.push('Root', {
            screen: tab || 'Profile',
            params: {
              screen : 'ProfileItem',
              params: {
                item: feedItemCommentResponse.data.getFeedItemForFeedComment,
                comment: true,
                standAlone: true
              }
            }
          })
        } 
      }
      break
    case 'comment':
      if (objectType === 'feed_comment') {
        const feedItemCommentResponse = await apollo.query({
          query: GET_FEED_ITEM_FOR_FEED_COMMENT,
          variables: {
            commentId: objectId
          }
        })
        if (feedItemCommentResponse && feedItemCommentResponse.data && feedItemCommentResponse.data.getFeedItemForFeedComment) {
          navigation.push('Root', {
            screen: tab || 'Profile',
            params: {
              screen : 'ProfileItem',
              params: {
                item: feedItemCommentResponse.data.getFeedItemForFeedComment,
                comment: true,
                standAlone: true
              }
            }
          })
        } 
      } else if (objectType === 'review_comment') {
        const reviewResponse = await apollo.query({
          query: GET_REVIEW_FROM_REVIEW_COMMENT,
          variables: {
            commentId: objectId
          }
        })
        if (reviewResponse && reviewResponse.data && reviewResponse.data.getReviewFromReviewComment) {
          navigation.push('Root', {
            screen: tab || 'Profile',
            params: {
              screen: 'ReviewPage',
              params: {
                initialReview: reviewResponse.data.getReviewFromReviewComment,
                reviewId: reviewResponse.data.getReviewFromReviewComment.id
              }
            }
          })
        }
      } 
      break
      case 'review_reminder':
        navigation.push('Root', {
          screen: tab || 'Profile',
          params: {
            screen: 'ReviewWelcome'
          }
        })
        break
      case 'now_following':
        if (push) {
          navigation.push('Root', {
            screen : 'Notifications'
          })
        } else {
          if (notificationInfo.objectType === 'project' && notificationInfo.objectName) {
            navigation.push('Root', {
              screen: tab || 'Profile',
              params: {
                screen: 'ProjectProfile',
                params: {
                  projectId: objectId
                }
              }
            })
          } else {
            navigation.push('Root', {
              screen: 'Notifications',
                params: {
                  screen: 'UserProfile',
                  params: {
                    userId: actorId
                }
              }
            })
          }
        }
        break
      case 'streak_reminder':
        navigation.push('Root', {
          screen: tab || 'Profile',
          params: {
            screen: 'UserProfile',
            params: {
              initialSection: 'action'
            }
          }
        })
        break
      case 'friend_project_creation':
        navigation.push('Root', {
          screen: tab || 'Profile',
          params: {
            screen: 'ProjectProfile',
            params: {
              projectId: objectId
            }
          }
        })
        break
      case 'project_invite':
        if (push) {
          navigation.push('Root', {
            screen : 'Notifications'
          })
        } else {
          navigation.push('Root', {
            screen: tab || 'Profile',
            params: {
              screen: 'ProjectProfile',
              params: {
                projectId: objectId
              }
            }
          })
        }
        break
      case 'project_invite_accept':
        if (push) {
          navigation.push('Root', {
            screen: 'Notifications'
          })
        } else {
          navigation.push('Root', {
            screen: tab || 'Profile',
            params: {
              screen: 'ProjectProfile',
              params: {
                projectId: objectId
              }
            }
          })
        }
        break
      case 'expiring_action_reminder':
        navigation.push('Root', {
          screen: tab || 'Profile',
          params: {
            screen: 'UserProfile',
            params: {
              initialSection: 'action'
            }
          }
        })
        break
      case 'expired_action_reminder':
        navigation.push('Root', {
          screen: tab || 'Profile',
          params: {
            screen: 'UserProfile',
            params: {
              initialSection: 'action'
            }
          }
        })
        break
    
  }
}

const formatNotificationMessage = ({ notificationInfo, tab, projectInvite }) => {
  let displayMessage = '';
  switch (notificationInfo.type) {
    case 'welcome':
      displayMessage =(
        <RegularText color={Black}>
          Welcome to Wonder! We're here to help your dream projects succeed.
        </RegularText>
      )
      break
    case 'mention':
      displayMessage = formatNotificationMentionMessage(notificationInfo);
      break
    case 'reaction':
      displayMessage = formatNotificationReactionMessage(notificationInfo);
      break
    case 'comment':
      displayMessage = formatNotificationCommentMessage(notificationInfo);
      break
    case 'review_reminder':
      displayMessage = (
        <RegularText color={Black}>
          Enter your weekly update! This will help reflect on your progress and keep your followers up to date.
        </RegularText>
      )
      break
    case 'now_following':
      let followingString = ''
      if (notificationInfo.objectType === 'project' && notificationInfo.objectName) {
        followingString = <RegularText style={{
          fontFamily: 'Rubik SemiBold'
        }}>
          {notificationInfo.objectName}
          </RegularText>
      } else {
        followingString = 'you'
      }
      displayMessage = (
        <RegularText color={Black}>
          <RegularText style={{
            fontFamily: 'Rubik SemiBold'
          }}>
            @{notificationInfo.actorUsername} 
            </RegularText> is now following {followingString}.
        </RegularText>
      )
      break
    case 'project_invite':
      displayMessage = formatProjectInvite(notificationInfo, projectInvite)
      break
    case 'project_invite_accept':
      displayMessage = formatProjectInviteAccept(notificationInfo, projectInvite)
      break
    case 'expiring_action_reminder':
      displayMessage = (
        <RegularText color={Black}>
          {notificationInfo.additionalData && notificationInfo.additionalData.message}
        </RegularText>
      )
      break
    case 'expired_action_reminder':
      displayMessage = (
        <RegularText color={Black}>
          {notificationInfo.additionalData && notificationInfo.additionalData.message}
        </RegularText>
      )
      break
    case 'streak_reminder':
      displayMessage = (
        <RegularText color={Black}>
          Keep your <RegularText style={{
            fontFamily: 'Rubik SemiBold'
          }}>{notificationInfo.additionalData && notificationInfo.additionalData.currentStreakCount} day streak</RegularText> by taking action!
        </RegularText>
      )
      break
    default:
      displayMessage = <></>;
  }
  return displayMessage;
}

const formatProjectInviteAccept = (notificationInfo, projectInvite) => {
  if (projectInvite) {
    return (
      <>
        <RegularText color={Black}>
            <RegularText style={{
              fontFamily: 'Rubik SemiBold'
            }}>
              @{projectInvite.invitee.username}{` `} 
              </RegularText>accepted your invite to work on <RegularText style={{
              fontFamily: 'Rubik SemiBold'
            }}>
              {projectInvite.project.name}
              </RegularText>
        </RegularText>
      </>
    )
  }
}

const formatProjectInvite = (notificationInfo, projectInvite) => {

  if (projectInvite) {
    return (
      <>
        <RegularText color={Black}>
            <RegularText style={{
              fontFamily: 'Rubik SemiBold'
            }}>
              @{projectInvite.invitor.username}{` `} 
              </RegularText>invited you to work on <RegularText style={{
              fontFamily: 'Rubik SemiBold'
            }}>
              {projectInvite.project.name}
              </RegularText>
        </RegularText>
      </>
    )
  }
  return null
}

const formatNotificationMentionMessage = (notificationInfo) => {
  let displayMessage = ''
  switch (notificationInfo.objectType) {
    case 'goal':
      return (
        <RegularText color={Black}>
          <RegularText style={{
            fontFamily: 'Rubik SemiBold'
          }}>
            @{notificationInfo.actorUsername}{` `} 
            </RegularText>
            mentioned you in a goal.
        </RegularText>
      )
    case 'task':
      return (
        <RegularText color={Black}>
        <RegularText style={{
          fontFamily: 'Rubik SemiBold'
        }}>
          @{notificationInfo.actorUsername}{` `} 
          </RegularText>
          mentioned you in a task.
      </RegularText>
      )
    case 'ask':
      return (
        <RegularText color={Black}>
        <RegularText style={{
          fontFamily: 'Rubik SemiBold'
        }}>
          @{notificationInfo.actorUsername}{` `} 
          </RegularText>
          mentioned you in an ask.
      </RegularText>
      )
    case 'post':
      return (
        <RegularText color={Black}>
        <RegularText style={{
          fontFamily: 'Rubik SemiBold'
        }}>
          @{notificationInfo.actorUsername}{` `}  
          </RegularText>
          mentioned you in a post.
      </RegularText>
      )
    case 'feed_comment':
      return (
        <RegularText color={Black}>
        <RegularText style={{
          fontFamily: 'Rubik SemiBold'
        }}>
            @{notificationInfo.actorUsername}{` `}  
            </RegularText>
            mentioned you in a comment.
        </RegularText>
      )
    case 'review_comment':
      return (
        <RegularText color={Black}>
        <RegularText style={{
          fontFamily: 'Rubik SemiBold'
        }}>
            @{notificationInfo.actorUsername}{` `}  
            </RegularText>
            mentioned you in a comment.
        </RegularText>
      )
    default:
      displayMessage = <></>;
  }
  return displayMessage;
}
const formatNotificationReactionMessage = (notificationInfo) => {
  let displayMessage = ''
  switch (notificationInfo.objectType) {
    case 'feed_item':
      return (
        <RegularText color={Black}>
        <RegularText style={{
          fontFamily: 'Rubik SemiBold'
        }}>
            @{notificationInfo.actorUsername}{` `} 
            </RegularText>
            reacted to your action.
        </RegularText>
      )
    case 'feed_comment':
      return (
        <RegularText color={Black}>
        <RegularText style={{
          fontFamily: 'Rubik SemiBold'
        }}>
            @{notificationInfo.actorUsername}{` `} 
            </RegularText>
            reacted to your comment.
        </RegularText>
      )
    default:
      displayMessage = <></>;
  }
  return displayMessage;
}
const formatNotificationCommentMessage = (notificationInfo) => {
  const {
    actorProfilePicture: profilePicture,
    objectType,
    actorThumbnail
  } = notificationInfo
  let string = ''
  if (objectType === 'review_comment') {
    string = 'review'
  } else if (objectType === 'feed_comment') {
    string = 'activity'
  }
  return (
    <RegularText color={Black}>
    <RegularText style={{
      fontFamily: 'Rubik SemiBold'
    }}>
        @{notificationInfo.actorUsername}{` `}
        </RegularText>
        commented on your {string}.
    </RegularText>
  )
}

export const NotificationDisplay = ({ notificationInfo, tab, notifications }) => {
  const {
    objectId,
    actorId,
    userId,
    actorProfilePicture: profilePicture,
    timestamp,
    type,
    viewedAt,
    actorThumbnail
  } = notificationInfo
  const [projectInvite, setProjectInvite] = useState(null)
  const [acceptInvite, setAcceptInvite] = useState(null)
  const [acceptInviteMutation] = useMutation(ACCEPT_PROJECT_INVITE)
  const [getInvite, {
    data: projectInviteData
  }] = useLazyQuery(GET_PROJECT_INVITE_FROM_NOTIFICATION, {
    variables: {
      projectId: objectId,
      invitorId: actorId,
      inviteeId: userId
    }
  })
  useEffect(() => {
    if (type === 'project_invite') {
      getInvite()
    } else if (type === 'project_invite_accept') {
      getInvite({
        variables: {
          projectId: objectId,
          invitorId: userId,
          inviteeId: actorId
        }
      })
    }
    if (projectInviteData) {
      setProjectInvite(projectInviteData.getProjectInviteFromNotification)
      if (projectInviteData.getProjectInviteFromNotification.response === 'accepted') {
        setAcceptInvite(true)
      }
    }
  }, [projectInviteData])
  const displayMessage = formatNotificationMessage({ notificationInfo, tab, projectInvite })
  const navigation = useNavigation()

  const defaultImage = () => {
    if (type === 'welcome' || type === 'expiring_action_reminder' || type === 'expired_action_reminder' || type === 'streak_reminder') {
      return (
        <Image source={LogoImage} style={notificationStyles.notificationImage} />
      )
    }
    if (type === 'review_reminder') {
      return (
        <ReviewIcon 
          style={notificationStyles.notificationImage}
        />
      )
    }
    return (
      <Image source={DefaultProfilePicture} style={notificationStyles.notificationImage} />
    )
  }
  return (
    <Pressable onPress={() => getNotificationPressFunction({ notificationInfo, navigation, tab, notifications })} style={{
      ...notificationStyles.notificationItemContainer,
      backgroundColor: viewedAt ? White: Blue100
    }}>
      {
          profilePicture && profilePicture !== 'None' ?
          <SafeImage
          src={actorThumbnail || profilePicture} style={notificationStyles.notificationImage} />
          :
          defaultImage()
                    
      }
      <View style={{
        flex: 1,
        marginRight: spacingUnit
      }}>
      {displayMessage}
      {
        type !== 'welcome' &&
        <RegularText color={Grey800} style={{
          fontSize: 13,
          lineHeight: 18,
          marginTop: spacingUnit * 0.5
        }}>
        {timeAgo.format(new Date(timestamp))}
        </RegularText>
      }
      </View>
      {
        type === 'project_invite' &&
        <View>
          {
            acceptInvite ?
            <Pressable style={listStyles.followingButton}>
            <RegularText color={Black}>
              Accepted
            </RegularText>
          </Pressable>
          :
          <Pressable onPress={() => {
            setAcceptInvite(true)
            acceptInviteMutation({
              variables: {
                projectInviteId: projectInvite.id
              }
            })
          }} style={listStyles.followButton}>
            <RegularText color={White}>
              Accept
            </RegularText>
          </Pressable>
          }
        </View>
      }
    </Pressable>
  )
}

export const NotificationFeed = ({ route }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const user = useMe()
  const [notifications, setNotifications] = useState([])
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    wait(2000).then(() => setRefreshing(false))
  }, [])


  const { loading, data, error, refetch, fetchMore } = useQuery(GET_NOTIFICATIONS, {
    fetchPolicy: 'network-only'
  })
  if (error) {
    console.log('Error fetching Notification', error)
  }

  useEffect(() => {
    if (data && data.getNotifications) {
      setNotifications(data.getNotifications)
    }
  }, [data])

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

  const tab = route && route.params && route.params.tab
  const filteredNotifications = notifications.filter(item => {
    return item && (item.actorId !== user.id)
  })

  const welcomeObject = [
    {
      type: 'welcome',
      viewedAt: new Date()
    }
  ]
  return (
    <>
      <FlatList
        contentContainerStyle={{
          paddingBottom: spacingUnit * 10
        }}
        data={filteredNotifications && filteredNotifications.length > 0 ? filteredNotifications : welcomeObject}
        renderItem={({ item, index, separators }) => (
          <NotificationDisplay notificationInfo={item}  tab={tab} notifications={filteredNotifications} />
        )}
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
                  offset: notifications && notifications.length
                }
              })
              if (result && result.data && result.data.getNotifications) {
                setNotifications([...data && data.getNotifications, ...result.data.getNotifications])
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

const AuthFeed = withAuth(NotificationFeed)
function NotificationScreen({
  navigation,
  route
}: StackScreenProps<RootStackParamList, 'Dashboard'>) {

  return (
    <SafeAreaView style={{
      backgroundColor: White,
      flex: 1
    }}>
      <Header noGoingBack={true} />
      <AuthFeed route={route} />
    </SafeAreaView>
  )
}

function NotificationScreenRoutes({
  navigation,
  route
}) {
  return (
    <Stack.Navigator screenOptions={{ 
      headerShown: false,
      gestureResponseDistance: { vertical: 200, horizontal: 250 },
    }}>
      <Stack.Screen name='Default' component={NotificationScreen} initialParams={{
        tab: 'Notifications',
        noGoingBack: true
      }} />
      <Stack.Screen name='UserProfile' component={UserProfile} initialParams={{
        tab: 'Notifications'
      }} />
      <Stack.Screen name='OtherUserProfile' component={UserProfile} initialParams={{
        tab: 'Notifications'
      }} />
      <Stack.Screen name='ProjectProfile' component={ProjectProfile} options={{ gestureEnabled: false }}initialParams={{
        tab: 'Notifications'
      }} />
      <Stack.Screen name='ProfileItem' component={FeedItem} initialParams={{
        tab: 'Notifications'
      }}/>
      <Stack.Screen name='WorkflowWelcome' component={WorkflowWelcome} initialParams={{
        tab: 'Notifications'
      }} />
      <Stack.Screen name='SetupGoal' component={SetupGoal} options={{ gestureEnabled: false }} initialParams={{
        tab: 'Notifications'
      }}/>
      <Stack.Screen name='SetupTask' component={SetupTask} options={{ gestureEnabled: false }} initialParams={{
        tab: 'Notifications'
      }} />
      <Stack.Screen name='StreakIntro' component={StreakIntro} initialParams={{
        tab: 'Notifications'
      }} />
      <Stack.Screen name='SetupAsk' component={SetupAsk} options={{gestureEnabled: false}} initialParams={{
        tab: 'Notifications'
      }} />
      <Stack.Screen name='ProjectList' component={ProjectList} initialParams={{
        tab: 'Notifications'
      }}/>
      <Stack.Screen name='UserList' component={UserList} initialParams={{
        tab: 'Notifications'
      }}/>
      <Stack.Screen name='EditProjectCategory' component={ProjectSetupCategory} initialParams={{
        tab: 'Notifications'
      }} />
      <Stack.Screen name='EditProjectTags' component={ProjectTagSelectionScreen} initialParams={{
        tab: 'Notifications'
      }} />
      <Stack.Screen name='Links' component={Links} initialParams={{
        tab: 'Notifications'
      }} />
      <Stack.Screen name='GoalPage' component={GoalPage} options={{ gestureEnabled: false }} initialParams={{
        tab: 'Notifications'
      }} />
      <Stack.Screen name='TaskPage' component={TaskPage} options={{ gestureEnabled: false }} initialParams={{
        tab: 'Notifications'
      }} />
      <Stack.Screen name='ActionList' component={ActionList} options={{ gestureEnabled: false }} initialParams={{
        tab: 'Notifications'
      }}/>
      <Stack.Screen name='AskPage' component={AskPage} options={{ gestureEnabled: false }} initialParams={{
        tab: 'Notifications'
      }}/>
      <Stack.Screen name='ReviewWelcome' component={ReviewWelcome} initialParams={{
        tab: 'Notifications'
      }} />
      <Stack.Screen name='CreateReview' component={CreateReview} initialParams={{
        tab: 'Notifications'
      }} />
      <Stack.Screen name='IdChecker' component={IdChecker}  initialParams={{
        tab: 'Notifications'
      }} /> 
      <Stack.Screen name='HouseKeeping' component={HouseKeeping} initialParams={{
        tab: 'Notifications'
      }} options={{ gestureEnabled: false }} />
      <Stack.Screen name='ReviewPage' component={ReviewPage} initialParams={{
        tab: 'Notifications'
      }} />
    </Stack.Navigator>
    )
}
export default withAuth(NotificationScreenRoutes)