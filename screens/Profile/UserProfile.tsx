
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { Dimensions, Image, Pressable, SafeAreaView, ActivityIndicator, View, RefreshControl, FlatList } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { useMutation, useLazyQuery, useQuery } from '@apollo/client'
import * as Linking from 'expo-linking'
import isEqual from 'lodash.isequal'
import ConfettiCannon from 'react-native-confetti-cannon'

import { withAuth, useMe } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { profileStyles } from './style'
import { spacingUnit, wait, isEmptyObject, usePrevious } from '../../utils/common'
import BottomTabNavigator from '../../navigation/BottomTabNavigator'
import { UploadImage, SafeImage } from '../../storybook/stories/Image'
import { WONDER_BASE_URL } from '../../constants/'
import { UPDATE_USER, UPDATE_ASK, UPDATE_TASK, UPDATE_GOAL, COMPLETE_GOAL, COMPLETE_TASK, FOLLOW_USER, UNFOLLOW_USER } from '../../graphql/mutations'
import { GET_USER, GET_USER_ADDITIONAL_INFO, GET_USER_FEED, GET_USER_ACTIONS, GET_ASKS_FROM_USER, WHOAMI, GET_USER_STREAK } from '../../graphql/queries'
import { Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { SecondaryButton } from '../../storybook/stories/Button'
import { Black, Grey300, White, Blue400, Grey800 } from '../../constants/Colors'
import { ProfileContext } from '../../utils/contexts'
import {
  ProfilePlaceholder,
  ProjectInfoText,
  SectionsHeader,
  DetermineUserProgress,
  renderProfileItem,
  StatusSelector,
  onSwipe
} from './common'
import { EditProfileModal } from './EditProfileModal'
import Link from '../../assets/images/link'
import { sortByDueDate } from '../../utils/date'
import apollo from '../../services/apollo'
import { Streak } from '../../components/Streak'
import { GoalCongratsModal, TaskCongratsModal } from '../../components/Modal'
import { GET_USER_REVIEWS } from '../../graphql/queries/review'

const getUserId = ({ route, user }) => {
  if (route && route.params && route.params.userId) {
    return route.params.userId
  }
  return user && user.id
}

const fetchUser = async ({ userId, setUser }) => {
  const newUserResponse = await apollo.query({
    query: GET_USER,
    variables: {
      userId
    }
  })

  setUser(newUserResponse && newUserResponse.data && newUserResponse.data.getUser)
}

function UserProfile({
  navigation,
  route
}: StackScreenProps<RootStackParamList, 'UserProfile'>) {
  const loggedInUser = useMe()
  const finalUserId = getUserId({ route, user: loggedInUser })
  let noGoingBack = route && route.params && route.params.noGoingBack
  const tab = route && route.params && route.params.tab
  const userOwned = loggedInUser && (loggedInUser.id === finalUserId)
  const {
    fetchedUser,
    initialSection
  } = route.params
  const [status, setStatus] = useState('created')
  const [section, setSection] = useState(initialSection || 'feed')
  const [refreshing, setRefreshing] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false)
  const [userFeed, setUserFeed] = useState([])
  const prevFeed = usePrevious(userFeed)
  const [reviews, setReviews] = useState([])
  const prevReviews = usePrevious(reviews)
  const [taskCompleteModal, setTaskCompleteModal] = useState(false)
  const [goalCompletemodal, setGoalCompleteModal] = useState(false)
  const [loading, setLoading] = useState(false)
  // const [offset, setOffset] = useState(null)
  const [followUser] = useMutation(FOLLOW_USER, {
    variables: {
      followingId: finalUserId
    },
    update(cache) {
      cache.modify({
        fields: {
          users() {
            const newUser = {...loggedInUser}
            const newArr = [finalUserId, ...(loggedInUser ? loggedInUser.usersFollowing : [])]
            newUser.usersFollowing = newArr
            return [newUser]
          }
        }
      })
    }
  })
    const [unfollowUser] = useMutation(UNFOLLOW_USER, {
    variables: {
      followingId: finalUserId
    },
    update(cache) {
      cache.modify({
        fields: {
          users() {
            const newUser = {...loggedInUser}
            const newExistingFollowing = loggedInUser && loggedInUser.usersFollowing.filter(existingFollowingItem => existingFollowingItem !== finalUserId)
            newUser.usersFollowing = newExistingFollowing
            return [newUser]
          }
        }
      })
    }
  })
  const [following, setFollowing] = useState(loggedInUser && loggedInUser.usersFollowing && loggedInUser.usersFollowing.includes(finalUserId))
  const [confetti, setConfetti] = useState(false)
  const [updateGoal] = useMutation(UPDATE_GOAL)
  const [updateTask] = useMutation(UPDATE_TASK)
  const [completeGoal] = useMutation(COMPLETE_GOAL, {
    refetchQueries: [
      { query: GET_USER_STREAK, variables: {
        userId: loggedInUser && loggedInUser.id
      } }
    ]
  })

  const [completeTask] = useMutation(COMPLETE_TASK, {
    refetchQueries: [
      { query: GET_USER_STREAK, variables: {
        userId: loggedInUser && loggedInUser.id
      } },
    ]
  })
  const [updateAsk] = useMutation(UPDATE_ASK)
  const {
    loading: additionalInfoLoading,
    data: additionalInfoData,
    error: additionalInfoError
  } = useQuery(GET_USER_ADDITIONAL_INFO, {
    variables: {
      userId: finalUserId
    }
  })

  const {
    loading: userFeedLoading,
    data: userFeedData,
    error: userFeedError,
    fetchMore: feedFetchMore,
    refetch: feedRefetch
  } = useQuery(GET_USER_FEED, {
    variables: {
      userId: finalUserId
    },
    fetchPolicy: 'network-only'
  })
  const [getUserActions, {
    loading: userActionLoading,
    data: userActionData,
    error: userActionError
  }] = useLazyQuery(GET_USER_ACTIONS, {
    variables: {
      userId: finalUserId,
      status
    },
    fetchPolicy: 'network-only'
  })

  const [getUserAsks, {
    loading: userAsksLoading,
    data: userAsksData,
    error: userAsksError
  }] = useLazyQuery(GET_ASKS_FROM_USER, {
    variables: {
      userId: finalUserId,
      status
    },
    fetchPolicy: 'network-only'
  })

  const {
    data: userReviewData,
    fetchMore: reviewFetchMore,
    refetch: reviewRefetch
  } = useQuery(GET_USER_REVIEWS, {
    variables: {
      userId: finalUserId
    },
    fetchPolicy: 'network-only'
  })

  const [user, setUser] = useState(fetchedUser)
  const previousUser = usePrevious(user)
  const { data: streakData } = useQuery(GET_USER_STREAK, {
    variables: {
      userId: finalUserId
    }
  })
  const [profilePicture, setProfilePicture] = useState(user && user.profilePicture)
  const [updateUser] = useMutation(UPDATE_USER, {
    update(cache, { data: { updateUser }}) {
      cache.modify({
        fields: {
          users() {
            setUser(updateUser)
            return [updateUser]
          }
        }
      })
    }
  })

  const feedSelected = section === 'feed'
  const actionSelected = section === 'action'
  const asksSelected = section === 'asks'
  const reviewSelected = section === 'reviews'

  const onRefresh = useCallback((feedSelected, actionSelected, asksSelected) => {
    setRefreshing(true)
    if (feedSelected) {
      if (feedRefetch) {
        feedRefetch()
      }
    } else if (actionSelected) {
      getUserActions({
        variables: {
          userId: finalUserId,
          status
        }
      })
    } else if (asksSelected) {
      getUserAsks({
        variables: {
          userId: finalUserId,
          status
        }
      })
    } else if (reviewSelected) {
      if (reviewRefetch) {
        reviewRefetch()
      }
    }
    wait(2000).then(() => setRefreshing(false))
  }, [])

  useEffect(() => {
    if (actionSelected) {
      getUserActions({
        variables: {
          userId: finalUserId,
          status
        }
      })
    } else if (asksSelected) {
      getUserAsks({
        variables: {
          userId: finalUserId,
          status
        }
      })
    } else if (reviewSelected) {

    }
    if (userOwned) {
      setUser(loggedInUser)
    } else {

      if (finalUserId && !user) {
        fetchUser({ userId: finalUserId, setUser })
      }
    }
    if (!profilePicture && user && !isEqual(user, previousUser)) {
      setProfilePicture(user.profilePicture)
    }
    if (userFeedData && userFeedData.getUserFeed) {
      if (!isEqual(userFeedData.getUserFeed, prevFeed)) {
        setUserFeed(userFeedData.getUserFeed)
      }
    }
    if (userReviewData && userReviewData.getReviewsFromUser) {
      if (!isEqual(userReviewData.getReviewsFromUser, prevReviews)) {
        setReviews(userReviewData.getReviewsFromUser)
      }
    }
  }, [user && user.profilePicture, feedSelected, actionSelected, asksSelected, finalUserId, status, userFeedData, userReviewData ])

  const additionalInfo = additionalInfoData && additionalInfoData.getUserAdditionalInfo
  const getCorrectData = section => {
    if (section === 'feed') {
      return userFeed
    } else if (section === 'action') {
      const actions = userActionData && userActionData.getUserActions
      if ((actions && actions.goals.length === 0 && actions.tasks.length === 0) && status === 'created') {
        return ['none']
      } else {
        if (actions && actions.goals && actions.tasks) {
          return sortByDueDate([
            ...actions.goals,
            ...actions.tasks
          ])
        } else if (actions && actions.goals) {
          return sortByDueDate(actions.goals)
        } else if ( actions && actions.tasks) {
          return sortByDueDate(actions.tasks)
        }
        return []
      }
    } else if (section === 'asks') {
      const asks = userAsksData && userAsksData.getAsksFromUser
 
      if (asks && asks.length === 0 && status === 'created') {
        return ['none']
      }
      return asks
    } else if (section === 'reviews') {
      if (reviews.length === 0 ) {
        return ['none']
      }
      return reviews
    }
  }
  const profileData = getCorrectData(section)

  const itemRefs = useRef(new Map())
  
  const onSwipeLeft = (item, type) => onSwipe({
    item,
    type,
    status: 'archived',
    completeGoal,
    updateGoal,
    project: false,
    user,
    actions: userActionData && userActionData.getUserActions,
    completeTask,
    updateTask,
    updateAsk,
    projectAskData: null,
    userAsksData,
    loggedInUser
  })
  const onSwipeRight = (item, type) => {
    onSwipe({
      item,
      type,
      status: 'completed',
      completeGoal,
      updateGoal,
      project: false,
      user,
      actions: userActionData && userActionData.getUserActions,
      completeTask,
      updateTask,
      updateAsk,
      projectAskData: null,
      userAsksData,
      setConfetti,
      loggedInUser,
      setTaskCompleteModal,
      setGoalCompleteModal
    })
  }

  function ProfileHeader () {
    return (
      <View style={profileStyles.profileContainer}>
        
              <View style={[profileStyles.profileInfoContainer, {
                // justifyContent: 'space-between',
              }]}>
                <View style={profileStyles.imageContainer}>
                {
                  profilePicture ?
                  <SafeImage style={{
                    ...profileStyles.profileImage,
                    width: spacingUnit * 10,
                    height: spacingUnit * 10,
                    borderRadius: spacingUnit * 5
                  }} src={profilePicture || user.profilePicture} setImage={setProfilePicture} />
                  :
                  <ProfilePlaceholder projectOwnedByUser={userOwned} user={true} />
                }
                </View>
                <Pressable onPress={() => navigation.navigate('Root', {
                  screen: tab || 'Profile',
                  params: {
                    screen: 'ProjectList',
                    params: {
                      userId: finalUserId,
                      user
                    }
                  }
                })}>
                <ProjectInfoText style={{
                  marginRight: spacingUnit * 4,
                  marginLeft: spacingUnit * 4
                }} count={additionalInfo && additionalInfo.projectCount} type={additionalInfo && additionalInfo.projectCount === 1 ? 'project' : 'projects'} />
                </Pressable>
                <Pressable onPress={() => navigation.navigate('Root', {
                  screen: tab || 'Profile',
                  params: {
                    screen: 'UserList',
                    params: {
                      followers: true,
                      userId: finalUserId
                    }
                  }
                })}>
                <ProjectInfoText style={{
                  marginRight: spacingUnit * 4
                }} count={additionalInfo && additionalInfo.followerCount} type={additionalInfo && additionalInfo.followerCount === 1 ? 'follower': 'followers'} />
                </Pressable>
                <Pressable onPress={() => navigation.navigate('Root', {
                  screen: tab || 'Profile',
                  params: {
                    screen: 'UserList',
                    params: {
                      following: true,
                      userId: finalUserId
                    }
                  }
                })}>
                  <ProjectInfoText count={additionalInfo && additionalInfo.followingCount} type='following' />
                </Pressable>
                {/* <ProjectInfoText count={user.tasksCompleted} type='tasks completed' /> */}
              </View>
              <View style={[profileStyles.profileInfoContainer, {
                marginTop: spacingUnit,
                alignItems: 'flex-start'
              }]}>
                <View style={{
                  flexDirection: 'column'
                }}>
                <Subheading style={{
                  fontSize: 18
                }} color={Black}>
                  {user.firstName} {user.lastName}
                </Subheading>
                <Paragraph color={Grey800}>@{user.username}</Paragraph>
                </View>
                {
                  userOwned ?
                  <>
                    <SecondaryButton style={profileStyles.editButton} onPress={() => setModalVisible(true)}>
                      <RegularText color={Black}>
                        Edit Profile
                      </RegularText>
                    </SecondaryButton>
                  </>
                  :
                  <>
                  {
                  following ?
                  <Pressable style={profileStyles.followingButton} onPress={() => {
                    setFollowing(false)
                    unfollowUser()
                  }}>
                    <Paragraph color={Black}>
                      Following
                    </Paragraph>
                  </Pressable>
                  :
                  <Pressable onPress={() => {
                    setFollowing(true)
                    followUser()
                  }} style={profileStyles.followButton}>
                    <Paragraph color={White}>
                      Follow
                    </Paragraph>
                  </Pressable>
                  }
                  </>
                }
                  <Streak viewing={userOwned ? false : user && user.username} streak={streakData && streakData.getUserStreak} streakContainerStyle={{
                    marginLeft: spacingUnit
                  }} />
              </View>
              {
                user.bio &&
                <View style={[profileStyles.profileInfoContainer, {
                  marginTop: spacingUnit * 2,
                }]}>
                  <Paragraph color={Black} style={{
                    flexWrap: 'wrap',
                    textAlign: 'left'
                  }}>
                    {user.bio}
                  </Paragraph>
                </View>
              }
              {user && user.links && !isEmptyObject(user.links) && 
              <Pressable style={{
                paddingLeft: spacingUnit * 2,
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: spacingUnit
              }} onPress={() => {
                navigation.navigate('Root', {
                  screen: tab || 'Profile',
                  params: {
                    screen: 'Links',
                    params: {
                      links: user.links,
                      name: user.username
                    }
                  }
                })
              }}>
                <Link color={Grey800} style={{
                  marginRight: spacingUnit * 0.5,
                  width: spacingUnit * 2.5,
                  height: spacingUnit * 2.5
                }} />
                <Paragraph color={Blue400}>
                  Personal links
                </Paragraph>
              </Pressable>
            }

              <SectionsHeader />
              {
                (actionSelected || asksSelected) &&
                <StatusSelector setStatus={setStatus} status={status} />
              }
              {
                reviewSelected &&
                <View style={{
                  marginTop: spacingUnit * 3
                }} />
              }
      </View>
    )
  }

  return (
    <SafeAreaView style={{
      backgroundColor: White,
      flex: 1
    }}>
      <Header noGoingBack={noGoingBack} share={`${WONDER_BASE_URL}/user/${finalUserId}`} />
      {
        confetti &&
        <ConfettiCannon count={200} origin={{x: -10, y: 0}} />
      }
      {
        user &&
        <>
        <EditProfileModal user={user} isVisible={isModalVisible} setModalVisible={setModalVisible} saveMutation={updateUser} />

        <GoalCongratsModal user={user} isVisible={goalCompletemodal} setModalVisible={setGoalCompleteModal} />
        <TaskCongratsModal user={user} isVisible={taskCompleteModal} setModalVisible={setTaskCompleteModal} />
        </>
      }
      <ProfileContext.Provider value={{
        section,
        setSection,
        refreshing,
        setRefreshing,
        // projectFeedData,
        // projectFeedLoading,
        // projectFeedError,
        // getProjectFeed,
        onSwipeLeft,
        onSwipeRight,
        status,
        setStatus,
        setLoading,
        setModalVisible,
        type: 'user'
      }}>
        {userOwned &&
          <UploadImage isVisible={isModalVisible} setModalVisible={setModalVisible} image={profilePicture} setImage={setProfilePicture} saveImageMutation={updateUser} imagePrefix={`user/${finalUserId}/`} saveImageMutationVariable={[{userId: finalUserId, input: { profilePicture }}, ['input', 'profilePicture']]}  />
        }
        {
          user &&
          <View style={{
            // flex: 1,
            // paddingLeft: spacingUnit * 2,
            // paddingRight: spacingUnit * 2
          }}>
          <FlatList    refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => onRefresh(feedSelected, actionSelected, asksSelected)} />
          }
          ItemSeparatorComponent={() => (
            <View
              style={[feedSelected && {
                borderBottomColor: Grey300,
                borderBottomWidth: 1,
              }]}
            />
          )}
          ListHeaderComponent={ProfileHeader()}

          data={profileData}
          contentContainerStyle={{
            paddingBottom: spacingUnit * 10
          }}
          keyExtractor={item => item.id}
          scrollEventThrottle={400}
          renderItem={({ item }) => renderProfileItem({ item, section, user, userOwned, navigation, itemRefs, onSwipeLeft, onSwipeRight, tab, loggedInUser })}
          ListEmptyComponent={() => {
            return (
              <View style={{
                marginTop: spacingUnit * 3
              }}>
                {
                  (userFeedLoading || userActionLoading) &&
                  <ActivityIndicator />
                }
              </View>
            )
          }}
          onEndReached={async () => {
            if (section === 'feed') {
                if (feedFetchMore) {
                  try {
                    const result = await feedFetchMore({
                      variables: {
                        offset: userFeed.length
                      }
                    })
                    if (result && result.data && result.data.getUserFeed) {
                      setUserFeed([...userFeed, ...result.data.getUserFeed])
                    }
                  } catch (err) {
                    console.log('err fetching more', err)
                  }
                }
              
            } else if (section === 'reviews') {
                if (reviewFetchMore) {
                  try {
                    const result = await reviewFetchMore({
                      variables: {
                        offset: reviews.length
                      }
                    })
                    if (result && result.data && result.data.getReviewsFromUser) {
                      setReviews([...reviews, ...result.data.getReviewsFromUser ])
                    }
                  } catch (err) {
                    console.log('err fetching more reviews', err)
                  }
                }
              
            }
          }}
          >
  
          </FlatList>
          </View>
        }
        </ProfileContext.Provider>
    </SafeAreaView>
  )
}

export default withAuth(UserProfile)
