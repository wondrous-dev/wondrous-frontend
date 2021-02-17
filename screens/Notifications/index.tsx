import React, { useCallback, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { SafeAreaView, RefreshControl, Text, StyleSheet, View, FlatList, ActivityIndicator, Pressable } from 'react-native'
import { useLazyQuery } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { createStackNavigator } from '@react-navigation/stack'

import { withAuth } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { White, Grey300, Black, Grey800, Blue100 } from '../../constants/Colors'
import { GET_NOTIFICATIONS, GET_FEED_ITEM_FOR_FEED_COMMENT, GET_FEED_ITEM, GET_POST_ITEM, GET_UNREAD_NOTIFICATION_COUNT } from '../../graphql/queries'
import { MARK_NOTIFICATION_AS_VIEWED } from '../../graphql/mutations'
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

TimeAgo.locale(en)
const timeAgo = new TimeAgo('en-US')

const Stack = createStackNavigator()

const notificationStyles = StyleSheet.create({
  notificationItemContainer: {
    padding: spacingUnit * 2,
    paddingTop: spacingUnit * 3,
    paddingBottom: spacingUnit * 3,
    flexDirection: 'row',
    alignItems: 'center'
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
});

const getNotificationPressFunction = async ({ notificationInfo, navigation, tab, getFeedItem, notifications }) => {
  const {
    type,
    objectId,
    objectType,
    id
  } = notificationInfo
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
      })
    }
  })

  switch(type) {
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
        actionsScreen = 'AskPage'
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
          navigation.navigate('Root', {
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
          break
        }
      }

      navigation.navigate('Root', {
        screen: tab || 'Profile',
        params: {
          screen: actionScreen,
          params
        }
      })
      break
    case 'reaction':
      const feedItemResponse = await apollo.query({
        query: GET_FEED_ITEM,
        variables: {
          feedItemId: objectId
        }
      })
      if (feedItemResponse && feedItemResponse.data && feedItemResponse.data.getFeedItem) {
        navigation.navigate('Root', {
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
      break
    case 'comment':
      const feedItemCommentResponse = await apollo.query({
        query: GET_FEED_ITEM_FOR_FEED_COMMENT,
        variables: {
          commentId: objectId
        }
      })
      if (feedItemCommentResponse && feedItemCommentResponse.data && feedItemCommentResponse.data.getFeedItemForFeedComment) {
        navigation.navigate('Root', {
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
      break
  }
}

const formatNotificationMessage = ({ notificationInfo, tab}) => {
  let displayMessage = '';
  switch (notificationInfo.type) {
    case 'mention':
      displayMessage = formatNotificationMentionMessage(notificationInfo);
      break
    case 'reaction':
      displayMessage = formatNotificationReactionMessage(notificationInfo);
      break
    case 'comment':
      displayMessage = formatNotificationCommentMessage(notificationInfo);
      break
    default:
      displayMessage = <></>;
  }
  return displayMessage;
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
    case 'comment':
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
      break
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
            reacted to your activity.
        </RegularText>
      )
    default:
      displayMessage = <></>;
  }
  return displayMessage;
}
const formatNotificationCommentMessage = (notificationInfo) => {
  const {
    actorProfilePicture: profilePicture
  } = notificationInfo
  return (
    <RegularText color={Black}>
    <RegularText style={{
      fontFamily: 'Rubik SemiBold'
    }}>
        @{notificationInfo.actorUsername}{` `}
        </RegularText>
        commented on your activity.
    </RegularText>
  )
}

export const NotificationDisplay = ({ notificationInfo, tab, notifications }) => {
  const displayMessage = formatNotificationMessage({ notificationInfo, tab })
  const navigation = useNavigation()

  const {
    actorProfilePicture: profilePicture,
    timestamp,
    viewedAt
  } = notificationInfo
  return (
    <Pressable onPress={() => getNotificationPressFunction({ notificationInfo, navigation, tab, notifications })} style={{
      ...notificationStyles.notificationItemContainer,
      backgroundColor: viewedAt ? White: Blue100
    }}>
      {
          profilePicture && profilePicture !== 'None' ?
          <SafeImage
          src={profilePicture} style={{
            width: spacingUnit * 6,
            height: spacingUnit * 6,
            borderRadius: spacingUnit * 3,
            marginRight: 8
          }} />
          :
          <Image source={DefaultProfilePicture} style={{
            marginRight: 8,
            width: spacingUnit * 6,
            height: spacingUnit * 6,
            borderRadius: spacingUnit * 3
          }} />
                    
      }
      <View>
      {displayMessage}
      <RegularText color={Grey800} style={{
        fontSize: 13,
        lineHeight: 18
      }}>
      {timeAgo.format(new Date(timestamp))}
      </RegularText>
      </View>
    </Pressable>
  )
}

export const NotificationFeed = ({ route }) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    getItems()
    wait(2000).then(() => setRefreshing(false))
  }, [])


  const [getItems, { loading, data, error, refetch, fetchMore }] = useLazyQuery(GET_NOTIFICATIONS, {
    fetchPolicy: 'network-only'
  })
  if (error) {
    console.log('Error fetching Notification', error)
  }

  useEffect(() => {
    getItems()
  }, [])

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
  return (
    <>
      <FlatList
        contentContainerStyle={{
          paddingBottom: spacingUnit * 10
        }}
        data={data && data.getNotifications}
        renderItem={({ item, index, separators }) => (
          <NotificationDisplay notificationInfo={item}  tab={tab} notifications={data && data.getNotifications} />
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
      >
      </FlatList>
    </>
  )

}

function NotificationScreen({
  navigation,
  route
}: StackScreenProps<RootStackParamList, 'Dashboard'>) {

  return (
    <SafeAreaView style={{
      backgroundColor: White,
      flex: 1
    }}>
      <Header />
      <NotificationFeed route={route} />
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
        tab: 'Notifications'
      }} />
      <Stack.Screen name='UserProfile' component={UserProfile}initialParams={{
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
    </Stack.Navigator>
    )
}
export default withAuth(NotificationScreenRoutes)