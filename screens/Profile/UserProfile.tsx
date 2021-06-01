
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { Pressable, SafeAreaView, ActivityIndicator, View, RefreshControl, FlatList } from 'react-native'
import { useMutation, useLazyQuery, useQuery } from '@apollo/client'
import * as Linking from 'expo-linking'
import isEqual from 'lodash.isequal'
import ConfettiCannon from 'react-native-confetti-cannon'
import Toast from 'react-native-toast-message'
import ProgressCircle from 'react-native-progress-circle'

import { FullScreenGoalModal } from '../../components/Modal/GoalModal'
import { FullScreenAskModal } from '../../components/Modal/AskModal'
import { withAuth, useMe } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { profileStyles } from './style'
import { spacingUnit, wait, isEmptyObject, usePrevious, getRingActions } from '../../utils/common'
import BottomTabNavigator from '../../navigation/BottomTabNavigator'
import { UploadImage, SafeImage } from '../../storybook/stories/Image'
import { WONDER_BASE_URL } from '../../constants/'
import { UPDATE_USER, UPDATE_ASK, UPDATE_TASK, UPDATE_GOAL, COMPLETE_GOAL, COMPLETE_TASK, FOLLOW_USER, UNFOLLOW_USER, CREATE_GOAL, CREATE_ASK, BLOCK_USER } from '../../graphql/mutations'
import { GET_USER, GET_USER_ADDITIONAL_INFO, GET_USER_FEED, GET_USER_ACTIONS, GET_ASKS_FROM_USER, WHOAMI, GET_USER_STREAK, CHECK_USER_FOLLOWS_BACK, GET_USER_RING_ACTION_COUNT } from '../../graphql/queries'
import { Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { PrimaryButton, SecondaryButton } from '../../storybook/stories/Button'
import { Black, Grey300, White, Blue400, Grey800, Grey700, Orange } from '../../constants/Colors'
import { ProfileContext, UserCongratsContext } from '../../utils/contexts'
import {
  ProfilePlaceholder,
  ProjectInfoText,
  SectionsHeader,
  DetermineUserProgress,
  renderProfileItem,
  onSwipe,
  getPinnedFeed,
  fetchActions
} from './common'
import { EditProfileModal } from './EditProfileModal'
import Link from '../../assets/images/link'
import { sortByDueDate } from '../../utils/date'
import apollo from '../../services/apollo'
import { Streak } from '../../components/Streak'
import { GoalCongratsModal, TaskCongratsModal } from '../../components/Modal'
import { GET_USER_REVIEWS } from '../../graphql/queries/review'
import Settings from '../../assets/images/settings'
import { SettingsModal } from '../../components/Modal/SettingsModal'
import { OtherUserProfileModal } from '../../components/Modal/OtherUserProfileModal'
import { ContactsModal } from './ContactsModal'
import ProfilePictureModal from './ProfilePictureModal'
import { StatusSelector } from '../../components/Status/StatusSelector'
import AddIcon from '../../assets/images/add-dark-button'

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
  if (!finalUserId) {
    return null
  }
  let noGoingBack = route && route.params && route.params.noGoingBack
  const tab = route && route.params && route.params.tab
  const userOwned = loggedInUser && (loggedInUser.id === finalUserId)
  const {
    fetchedUser,
    initialSection
  } = route.params
  const [status, setStatus] = useState('created')
  const prevStatus = usePrevious(status)
  const [section, setSection] = useState(initialSection || 'feed')
  const prevSection = usePrevious(section)
  const [refreshing, setRefreshing] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false)
  const [userFeed, setUserFeed] = useState([])
  const prevFeed = usePrevious(userFeed)

  const [reviews, setReviews] = useState([])
  const prevReviews = usePrevious(reviews)
  const [asks, setAsks] = useState([])
  const prevAsks = usePrevious(asks)
  const [taskCompleteModal, setTaskCompleteModal] = useState(false)
  const [goalCompletemodal, setGoalCompleteModal] = useState(false)
  const [goalModalVisible, setGoalModalVisible] = useState(false)
  const [askModalVisible, setAskModalVisible] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [following, setFollowing] = useState(loggedInUser && loggedInUser.usersFollowing && loggedInUser.usersFollowing.includes(finalUserId))
  const [confetti, setConfetti] = useState(false)
  const [followBack, setFollowBack] = useState(null)
  const [user, setUser] = useState(fetchedUser)
  const [settingsModal, setSettingsModal] = useState(false)
  const [optionsModal, setOptionsModal] = useState(false)
  const [contactsModal, setContactsModal] = useState(false)
  const [profilePicture, setProfilePicture] = useState(user && (user.thumbnailPicture || user.profilePicture))
  const [profilePictureModal, setProfilePictureModal] = useState(false)
  const [profilePictureDimensions, setProfilePictureDimensions] = useState({})
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
      {
        query: GET_USER_RING_ACTION_COUNT,
        variables: {
          userId: loggedInUser && loggedInUser.id
        }
      }
    ]
  })

  const [updateAsk] = useMutation(UPDATE_ASK)

  const [checkUserFollowsBack, {
    data: followBackData
  }] = useLazyQuery(CHECK_USER_FOLLOWS_BACK, {
    fetchPolicy: 'network-only'
  })

  const {
    loading: additionalInfoLoading,
    data: additionalInfoData,
    error: additionalInfoError
  } = useQuery(GET_USER_ADDITIONAL_INFO, {
    variables: {
      userId: finalUserId
    },
    fetchPolicy: 'network-only'
  })

  const {
    loading: userFeedLoading,
    data: userFeedData,
    error: userFeedError,
    fetchMore: feedFetchMore,
    refetch: feedRefetch
  } = useQuery(GET_USER_FEED, {
    variables: {
      userId: finalUserId,
      limit: 10,
      offset: 0
    }
  })

  const [blockUser] = useMutation(BLOCK_USER, {
    variables: {
      blockedId: user?.id
    },
    update(cache, { data: { createBlockedUser }}) {
      cache.modify({
        fields: {
          users() {
            const newUser = {...loggedInUser}
            const newArr = [...loggedInUser.blockedUsers, createBlockedUser?.blockedId]
            newUser.blockedUsers = newArr
            console.log('newArr', newUser)
            return [newUser]
          }
        }
      })
    }
  })
  const [getUserActions, {
    loading: userActionDataLoading,
    data: userActionData,
    error: userActionError,
    fetchMore: actionFetchMore
  }] = useLazyQuery(GET_USER_ACTIONS, {
    variables: {
      userId: finalUserId,
      limit: 100,
      status
    },
    fetchPolicy: 'network-only'
  })
  const [ringProfileOptions, setRingProfileOptions] = useState(false)
  const {
    data: userRingActionCountData
  } = useQuery(GET_USER_RING_ACTION_COUNT, {
    variables: {
      userId: finalUserId
    }, 
    fetchPolicy: 'network-only'
  })

  const {
    percentage,
    incompleteRingActions,
    completedRingActions
  } = getRingActions(userRingActionCountData)

  const [createGoal] = useMutation(CREATE_GOAL, {
    refetchQueries: [
      { query: GET_USER_STREAK,
      variables: {
        userId: user && user.id
      } },
      {
        query: GET_USER_ACTIONS,
        variables: {
          userId: finalUserId,
          limit: 100,
          status: 'created'
        }
      }
    ],
    onCompleted: () => {
      Toast.show({
        text1: 'Goal successfully created',
        position: 'bottom',
      })
    }
  })

  const [userActionLoading, setUserActionLoading] = useState(userActionDataLoading)
  const [getUserAsks, {
    loading: userAsksLoading,
    data: userAsksData,
    error: userAsksError,
    fetchMore: askFetchMore
  }] = useLazyQuery(GET_ASKS_FROM_USER, {
    variables: {
      userId: finalUserId,
      status
    },
    fetchPolicy: 'network-only'
  })

  const [createAsk] = useMutation(CREATE_ASK, {
    refetchQueries: [
      {
        query: GET_ASKS_FROM_USER,
        variables: {
          userId: finalUserId,
          status: 'created'
        }
      }
    ],
    onCompleted: () => {
      Toast.show({
        text1: 'Ask successfully created',
        position: 'bottom',
      })
    }
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

  const previousUser = usePrevious(user)
  const { data: streakData } = useQuery(GET_USER_STREAK, {
    variables: {
      userId: finalUserId
    }
  })

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
            status,
            limit: 100,
          }
        })
      } else if (asksSelected && (!isEqual(section, prevSection) || !isEqual(status, prevStatus))) {
        getUserAsks({
          variables: {
            userId: finalUserId,
            status
          }
        })
      } else if (reviewSelected) {
  
      }
      if (userOwned && !user && loggedInUser) {
          setUser(loggedInUser)
      } else {
        if (finalUserId && !user) {
          fetchUser({ userId: finalUserId, setUser })
        }
      }
      if (!profilePicture && user && !isEqual(user, previousUser)) {
          setProfilePicture(user.thumbnailPicture || user.profilePicture)
      }
      if (userFeedData?.getUserFeed) {
        if (!isEqual(userFeedData.getUserFeed, prevFeed)) {
          setUserFeed(userFeedData.getUserFeed)
        }
      }
      if (userReviewData && userReviewData.getReviewsFromUser) {
        if (!isEqual(userReviewData.getReviewsFromUser, prevReviews)) {
          setReviews(userReviewData.getReviewsFromUser)
        }
      }
      if (userAsksData && userAsksData.getUserAsks) {
        if (!isEqual(userAsksData?.getUserAsks, prevAsks)) {
          setAsks(userAsksData?.getUserAsks)
        }
      }
      if (userOwned === false && followBack === null) {
        checkUserFollowsBack({
          variables: {
            userId: finalUserId
          }
        })
      }
      if (followBackData) {
        setFollowBack(followBackData?.doesUserFollowBack)
      } 
  }, [user && (user.thumbnailPicture || user.profilePicture), feedSelected, actionSelected, asksSelected, finalUserId, status, userFeedData?.getUserFeed, userReviewData, userOwned, followBackData, userAsksData ])

  const additionalInfo = additionalInfoData && additionalInfoData.getUserAdditionalInfo
  const getCorrectData = section => {
    const blockedCondition = (loggedInUser?.blockedUsers.includes(user?.id) || loggedInUser?.blockedByUsers?.includes(user?.id))
    if (section === 'feed') {
      if ( blockedCondition || blocked) {
        return []
      }
      return getPinnedFeed(userFeed)
    } else if (section === 'action') {
      if ( blockedCondition || blocked) {
        return []
      }
      const actions = userActionData && userActionData.getUserActions
      return fetchActions(actions, status)
    } else if (section === 'asks') {
      if ( blockedCondition || blocked) {
        return []
      }
      const asks = userAsksData && userAsksData.getAsksFromUser
 
      if (asks && asks.length === 0 && status === 'created') {
        return ['none']
      }
      return asks
    } else if (section === 'reviews') {
      if ( blockedCondition || blocked) {
        return []
      }
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
  function ProfileHeader (user, profilePictureDimensions) {
    return (
      <>
      {
        ringProfileOptions &&
        <View style={{
          position: 'absolute',
          zIndex: 1000,
          elevation: 1000,
          backgroundColor: White,
          left: profilePictureDimensions.x + profilePictureDimensions.width,
          top: profilePictureDimensions.y + profilePictureDimensions.height,
          borderRadius: spacingUnit,
          borderWidth: 1,
          borderColor: Grey300,
          padding: spacingUnit * 2
        }}>
            <Pressable onPress={() => {
              setProfilePictureModal(true)
              setRingProfileOptions(false)
            }} style={{
              marginBottom:spacingUnit * 1.5
            }}>
              <Paragraph style={{
                fontFamily: 'Rubik SemiBold'
              }}>
                View profile picture
              </Paragraph>
            </Pressable>
            <Pressable onPress={() => {
              setRingProfileOptions(false)
              navigation.navigate('Root', {
                screen: tab || 'Profile',
                params: {
                  screen: 'RingActions',
                  params: {
                    fetchedUser: user
                  }
                }
              })
            }}>
              <Paragraph style={{
                fontFamily: 'Rubik SemiBold'
              }}>
                View weekly actions
              </Paragraph>
            </Pressable>
          </View>
      }
      <View style={profileStyles.profileContainer}>
        <View style={[profileStyles.profileInfoContainer, {
          // justifyContent: 'space-between',
          marginBottom: spacingUnit * 2
        }]}>
          <View style={profileStyles.imageContainer}>
          <ProgressCircle
            percent={percentage}
            radius={48}
            borderWidth={8}
            color={Orange}
            shadowColor={Grey300}
            bgColor={White}
          >
          {
            profilePicture ?
            <Pressable onLayout={(event) => {
              const layout = event.nativeEvent.layout
              setProfilePictureDimensions({
                height: layout.height,
                width: layout.width,
                x: layout.x,
                y: layout.y
              })
            }} onPress={() => {

              setRingProfileOptions(!ringProfileOptions)
            }}>
            <SafeImage style={{
              ...profileStyles.profileImage,
              width: spacingUnit * 10,
              height: spacingUnit * 10,
              borderRadius: spacingUnit * 5
            }} profilePicture src={profilePicture || user.thumbnailPicture || user.profilePicture} setImage={setProfilePicture} />
            </Pressable>
            :
            (
              user ?
              <ProfilePlaceholder projectOwnedByUser={userOwned} user={true} />
              :
              null
            )
          }
          </ProgressCircle>
          </View>
          <Pressable onPress={() => navigation.push('Root', {
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
          <Pressable onPress={() => navigation.push('Root', {
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
          <Pressable onPress={() => navigation.push('Root', {
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
        {
          followBack &&
          <View style={{
            ...profileStyles.profileInfoContainer,
            marginBottom: -spacingUnit,
            marginTop: spacingUnit
          }}>
            <View style={{
            backgroundColor: Grey700,
            borderRadius: spacingUnit,
            padding: 2,
            paddingLeft: spacingUnit,
            paddingRight: spacingUnit
          }}>
            <RegularText color={White}>
              Follows you
            </RegularText>
          </View>
          </View>
        }
        <View style={[profileStyles.profileInfoContainer, {
          marginTop: spacingUnit * 2,
          alignItems: 'flex-start'
        }]}>
          <View style={profileStyles.profileHeader}>
          <Subheading style={{
            fontSize: 18
          }} color={Black}>
            {user?.firstName || ''} {user?.lastName || ''}
          </Subheading>
          {user?.username &&
          <Paragraph color={Grey800}>@{user?.username}</Paragraph>
          }
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
            {
              userOwned &&
              <Pressable onPress={() => setSettingsModal(true)}>
              <Settings style={{
                marginLeft: spacingUnit
              }} />
              </Pressable>
            }
        </View>
        {
          user.bio &&
          <View style={profileStyles.profileInfoContainer}>
            <Paragraph color={Black} style={{
              flexWrap: 'wrap',
              textAlign: 'left'
            }}>
              {user.bio}
            </Paragraph>
          </View>
        }
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: spacingUnit
        }}>
        {user && user.links && !isEmptyObject(user.links) && 
        <Pressable style={{
          paddingLeft: spacingUnit * 2,
          flexDirection: 'row',
          alignItems: 'center',
        }} onPress={() => {
          navigation.push('Root', {
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
      {
        userOwned && <View style={{
          marginLeft: spacingUnit,
        }}>
        <PrimaryButton style={{
          width: spacingUnit * 19,
          paddingTop: 0,
          paddingBottom: 0,
        }} onPress={() => setContactsModal(true)}>
          <Paragraph color={White} >
            Invite friends
          </Paragraph>
        </PrimaryButton>
        </View>
      }
      </View>
        <SectionsHeader />
        {
          (actionSelected || asksSelected) &&
          <View style={{
            alignItems: 'center',
            flexDirection: 'row'
          }}>
          <StatusSelector setStatus={setStatus} status={status} section={section} />
          {
            userOwned &&
            <Pressable onPress={() => {
              if  (actionSelected) {
                setGoalModalVisible(true)
              } else if (asksSelected) {
                setAskModalVisible(true)
              }
            }} style={{
              marginTop: spacingUnit * 2,
              marginLeft: -spacingUnit * 2
            }}>
                <AddIcon style={{
                  width: spacingUnit * 7,
                  height: spacingUnit * 7
                }} />
            </Pressable>
          }
          </View>
        }
        {
          reviewSelected &&
          <View style={{
            marginTop: spacingUnit * 2,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: spacingUnit * 3
          }}>
            <Paragraph style={{
            }}>
              Add Review
            </Paragraph>
            <Pressable style={{
              marginBottom: -spacingUnit * 0.5,
              marginLeft: -spacingUnit * 0.5
            }} onPress={() => {
              navigation.push('Root', {
                screen: tab || 'Profile',
                params: {
                  screen: 'ReviewWelcome'
                }
              })
            }}>
            <AddIcon style={{
                  width: spacingUnit * 7,
                  height: spacingUnit * 7
            }} />
            </Pressable>
          </View>
        }
      </View>
      </>
    )
  }
  return (
    <SafeAreaView style={{
      backgroundColor: White,
      flex: 1
    }}>
      <Header noGoingBack={noGoingBack} options={{
        setModalVisible: userOwned ? setSettingsModal : setOptionsModal
      }} />
      {
        confetti &&
        <ConfettiCannon count={200} origin={{x: -10, y: 0}} />
      }
      {
        userOwned &&
        <>
        <EditProfileModal setParentImage={setProfilePicture} user={user} isVisible={isModalVisible} setModalVisible={setModalVisible} saveMutation={updateUser} />
        <UserCongratsContext.Provider value={{
          user,
          incompleteRingActions,
          completedRingActions: completedRingActions === 0 ? 0 : completedRingActions - 1
        }}>
        <GoalCongratsModal user={user} isVisible={goalCompletemodal} setModalVisible={setGoalCompleteModal} />
        <TaskCongratsModal user={user} isVisible={taskCompleteModal} setModalVisible={setTaskCompleteModal} />
        </UserCongratsContext.Provider>
        <SettingsModal isVisible={settingsModal} setModalVisible={setSettingsModal} />
        <ContactsModal isVisible={contactsModal} setModalVisible={setContactsModal} />
        <FullScreenGoalModal setModalVisible={setGoalModalVisible} isVisible={goalModalVisible} goalMutation={createGoal} />
        <FullScreenAskModal setModalVisible={setAskModalVisible} isVisible={askModalVisible} askMutation={createAsk} />
        </>
      }
      <OtherUserProfileModal blockUser={() => {
        blockUser()
        setBlocked(true)
      }} headerText={`${user?.firstName} ${user?.lastName}`} isVisible={optionsModal} setModalVisible={setOptionsModal} />
      <ProfilePictureModal profilePicture={user?.profilePicture} isVisible={profilePictureModal} setModalVisible={setProfilePictureModal} />
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
          <UploadImage isVisible={isModalVisible} setModalVisible={setModalVisible} image={profilePicture} setImage={setProfilePicture} saveImageMutation={updateUser} imagePrefix={`tmp/${finalUserId}/`} saveImageMutationVariable={[{userId: finalUserId, input: { profilePicture }}, ['input', 'profilePicture']]}  />
        }
        {
          user &&
          <Pressable onPress={() => setRingProfileOptions(false)}>
          <FlatList refreshControl={
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
          ListHeaderComponent={ProfileHeader(user, profilePictureDimensions)}
          data={profileData}
          contentContainerStyle={{
            paddingBottom: spacingUnit * 10
          }}
          keyExtractor={item => item.id}
          scrollEventThrottle={400}
          renderItem={({ item }) => {
            if (profileData?.length > 0) {
              return renderProfileItem({ item, section, user, userOwned, navigation, itemRefs, onSwipeLeft, onSwipeRight, tab, loggedInUser })
            } else {
              return (
                <Paragraph color={Black} style={{
                  alignSelf: 'center',
                  marginTop: spacingUnit * 3
                }}>
                  Nothing here yet. If this user has private projects you can try to follow those by clicking on the project list above.
                </Paragraph>
              )
            }
          }}
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
                    console.log('err fetching more feed', err)
                  }
                }
              
            } else if (section === 'asks') {
              if (askFetchMore) {
                try {
                  const result = await askFetchMore({
                    variables: {
                      offset: asks?.length
                    }
                  })

                  if (result?.data?.getUserAsks) {
                    setAsks([...asks, ...result.data.getUserAsks])
                  }
                } catch (err) {
                  console.log('err fetching more actions', err)
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
          </Pressable>
        }
        </ProfileContext.Provider>
    </SafeAreaView>
  )
}

export default withAuth(UserProfile)
