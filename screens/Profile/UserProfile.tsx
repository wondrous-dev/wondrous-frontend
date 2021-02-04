
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { Dimensions, Image, Pressable, SafeAreaView, ActivityIndicator, View, RefreshControl, FlatList } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { useMutation, useLazyQuery, useQuery } from '@apollo/client'
import * as Linking from 'expo-linking'

import { withAuth, useMe } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { profileStyles } from './style'
import { spacingUnit, wait, isEmptyObject, usePrevious } from '../../utils/common'
import BottomTabNavigator from '../../navigation/BottomTabNavigator'
import { UploadImage, SafeImage } from '../../storybook/stories/Image'
import { WONDER_BASE_URL } from '../../constants/'
import { UPDATE_USER, UPDATE_ASK, UPDATE_TASK, UPDATE_GOAL, COMPLETE_GOAL, COMPLETE_TASK } from '../../graphql/mutations'
import { GET_USER, GET_USER_ADDITIONAL_INFO, GET_USER_FEED, GET_USER_ACTIONS, GET_ASKS_FROM_USER } from '../../graphql/queries'
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
  const userOwned = loggedInUser && (loggedInUser.id === finalUserId)
  const [status, setStatus] = useState('created')
  const [section, setSection] = useState('feed')
  const [refreshing, setRefreshing] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  // const [offset, setOffset] = useState(null)
  const [updateGoal] = useMutation(UPDATE_GOAL)
  const [updateTask] = useMutation(UPDATE_TASK)
  const [completeGoal] = useMutation(COMPLETE_GOAL)
  const [completeTask] = useMutation(COMPLETE_TASK)
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

  const [getUserFeed, {
    loading: userFeedLoading,
    data: userFeedData,
    error: userFeedError
  }] = useLazyQuery(GET_USER_FEED, {
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

  const [user, setUser] = useState(null)
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
  const onRefresh = useCallback((feedSelected, actionSelected, asksSelected) => {
    setRefreshing(true)
    if (feedSelected) {
      getUserFeed()
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
    }
    wait(2000).then(() => setRefreshing(false))
  }, [])

  useEffect(() => {
    if (feedSelected) {
      getUserFeed()
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
    }
    if (userOwned) {
      setUser(loggedInUser)
    } else {

      if (finalUserId && !user) {
        fetchUser({ userId: finalUserId, setUser })
      }
    }
    if (user) {
      setProfilePicture(user.profilePicture)
    }
  }, [user && user.profilePicture, feedSelected, actionSelected, asksSelected, finalUserId, status])

  const additionalInfo = additionalInfoData && additionalInfoData.getUserAdditionalInfo
  const getCorrectData = section => {
    if (section === 'feed') {
      return userFeedData && userFeedData.getUserFeed
    } else if (section === 'action') {
      const actions = userActionData && userActionData.getUserActions
      if ((actions && actions.length === 0) && status === 'created') {
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
    userAsksData
  })
  const onSwipeRight = (item, type) => onSwipe({
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
    userAsksData
  })

  return (
    <SafeAreaView style={{
      backgroundColor: White,
      flex: 1
    }}>
      <Header noGoingBack={noGoingBack} share={`${WONDER_BASE_URL}/user/${finalUserId}`} />
      {
        user &&
        <EditProfileModal user={user} isVisible={isModalVisible} setModalVisible={setModalVisible} saveMutation={updateUser} />
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
        setModalVisible
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
          ListHeaderComponent={() => (
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
                  }} src={profilePicture || user.profilePicture} />
                  :
                  <ProfilePlaceholder projectOwnedByUser={userOwned} user={true} />
                }
                </View>
                <Pressable onPress={() => navigation.navigate('Root', {
                  screen: 'Profile',
                  params: {
                    screen: 'ProjectList'
                  }
                })}>
                <ProjectInfoText style={{
                  marginRight: spacingUnit * 4,
                  marginLeft: spacingUnit * 4
                }} count={additionalInfo && additionalInfo.projectCount} type={additionalInfo && additionalInfo.projectCount === 1 ? 'project' : 'projects'} />
                </Pressable>
                <Pressable onPress={() => navigation.navigate('Root', {
                  screen: 'Profile',
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
                  screen: 'Profile',
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
                  userOwned &&
                  <>
                    <SecondaryButton style={{
                      width: spacingUnit * 13,
                      backgroundColor: White,
                      borderColor: Black,
                      borderWidth: 1,
                      paddingTop: 0,
                      paddingBottom: 0,
                      marginLeft: spacingUnit
                    }} onPress={() => setModalVisible(true)}>
                      <RegularText color={Black}>
                        Edit Profile
                      </RegularText>
                    </SecondaryButton>
                  </>
                }
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
                  screen: 'Profile',
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
              <DetermineUserProgress user={user} />
              <SectionsHeader />
              {
                (actionSelected || asksSelected) &&
                <StatusSelector setStatus={setStatus} status={status} />
              }
            </View>
          )}

          data={profileData}
          contentContainerStyle={{
            paddingBottom: spacingUnit * 10
          }}
          renderItem={({ item }) => renderProfileItem({ item, section, user, userOwned, navigation, itemRefs, onSwipeLeft, onSwipeRight })}
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
          >
  
          </FlatList>
          </View>
        }
        </ProfileContext.Provider>
    </SafeAreaView>
  )
}

export default withAuth(UserProfile)
