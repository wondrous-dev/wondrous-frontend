
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
import { UPDATE_USER } from '../../graphql/mutations'
import { GET_USER, GET_USER_ADDITIONAL_INFO, GET_USER_FEED, GET_USER_ACTIONS } from '../../graphql/queries'
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
  STATUS_ARR,
  StatusItem
} from './common'
import { EditProfileModal } from './EditProfileModal'
import Link from '../../assets/images/link'
import { sortByDueDate } from '../../utils/date'

const getUserId = ({ route, user }) => {
  if (route && route.params && route.params.userId) {
    return route.params.userId
  }
  return user && user.id
}

const fetchAdditionalInfo = async ({ getAdditionalInfo, userId, setAdditionalInfo }) => {
  const additionalResponse = await getAdditionalInfo({
    variables: {
      userId
    }
  })
  const result = additionalResponse && additionalResponse.data && additionalResponse.data.getUserAdditionalInfo
  setAdditionalInfo(result)
}

const fetchUser = async ({ getUser, userId, setUser }) => {
  const userResponse = await getUser({
    variables: {
      userId
    }
  })
  const user = userResponse && userResponse.data
  setUser(user)
}

function UserProfile({
  navigation,
  route
}: StackScreenProps<RootStackParamList, 'UserProfile'>) {

  const loggedInUser = useMe()
  const finalUserId = getUserId({ route, user: loggedInUser })
  let noGoingBack = route && route.params && route.params.noGoingBack
  const userOwned = loggedInUser && (loggedInUser.id === finalUserId)
  const [status, setStatus] = useState(null)
  const [section, setSection] = useState('feed')
  const [refreshing, setRefreshing] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  // const [offset, setOffset] = useState(null)
  const [getUser, {
    loading: userLoading,
    data: userData,
    error: userError,
  }] = useLazyQuery(GET_USER)
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
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    if (feedSelected) {
      getUserFeed()
    } else if (actionSelected) {
      getUserActions()
    } else if (asksSelected) {

    }
    wait(2000).then(() => setRefreshing(false))
  }, [])

  useEffect(() => {
    if (feedSelected) {
      getUserFeed()
    } else if (actionSelected) {
      getUserActions()
    }
    if (userOwned) {
      setUser(loggedInUser)
    } else {
      if (finalUserId && !user) {
        fetchUser({ getUser, userId: finalUserId, setUser})
      }
    }
    if (user) {
      setProfilePicture(user.profilePicture)
    }
  }, [user && user.profilePicture, feedSelected, actionSelected])

  const additionalInfo = additionalInfoData && additionalInfoData.getUserAdditionalInfo
  const getCorrectData = section => {
    if (section === 'feed') {
      return userFeedData && userFeedData.getUserFeed
    } else if (section === 'action') {
      if (userOwned && !(user && user.usageProgress && user.usageProgress.askCreated)) {
        return ['start']
      } else {
        const actions = userActionData && userActionData.getUserActions
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
    }
  }
  const profileData = getCorrectData(section)

  const itemRefs = useRef(new Map())
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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
                {
                  profilePicture ?
                  <SafeImage style={[profileStyles.profileImage, {
                    width: spacingUnit * 10,
                    height: spacingUnit * 10,
                    borderRadius: spacingUnit * 5
                  }]} src={profilePicture || user.profilePicture} />
                  :
                  <ProfilePlaceholder projectOwnedByUser={userOwned} />
                }
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
                      followers: true
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
                      following: true
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
                actionSelected &&
                <View style={{
                  paddingLeft: spacingUnit * 2,
                  paddingRight: spacingUnit * 2
                }}>
                  <View style={[{
                    marginTop: spacingUnit * 3,
                    flexDirection: 'row'
                  }]}>
                  {STATUS_ARR.map(statusItem => (
                    <StatusItem
                    statusValue={statusItem.value}
                    statusLabel={statusItem.label}
                    statusTrue={statusItem.value === status}
                    setStatus={setStatus}
                    />
                  ))}
                  </View>
                  <RegularText color={Grey800} style={{
                    marginTop: spacingUnit * 2,
                    marginBottom: spacingUnit * 2
                  }}>
                    Swipe right to mark as complete, swipe left to archive.
                  </RegularText>
                </View>
              }
            </View>
          )}

          data={profileData}
          contentContainerStyle={{
            paddingBottom: spacingUnit * 10
          }}
          renderItem={({ item }) => renderProfileItem({ item, section, user, navigation, itemRefs })}
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
