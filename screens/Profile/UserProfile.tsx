
import React, { useState, useCallback, useEffect } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { Dimensions, Image, Pressable, SafeAreaView, StyleSheet, View, RefreshControl, FlatList } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { useMutation, useLazyQuery, useQuery } from '@apollo/client'

import { withAuth, useMe } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { profileStyles } from './style'
import { spacingUnit, wait } from '../../utils/common'
import BottomTabNavigator from '../../navigation/BottomTabNavigator'
import { UploadImage } from '../../storybook/stories/Image'
import { WONDER_BASE_URL } from '../../constants/'
import { UPDATE_USER } from '../../graphql/mutations'
import { GET_USER, GET_USER_ADDITIONAL_INFO } from '../../graphql/queries'
import { Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { SecondaryButton } from '../../storybook/stories/Button'
import { Black, Grey300, White } from '../../constants/Colors'
import { ProfileContext } from '../../utils/contexts'
import {
  ProfilePlaceholder,
  ProjectInfoText,
  SectionsHeader,
  DetermineUserProgress,
  renderProfileItem
} from './common'

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
  const [section, setSection] = useState('feed')
  const [refreshing, setRefreshing] = useState(false)
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
  const [isVisible, setModalVisible] = useState(false)
  const [user, setUser] = useState(null)
  const [profilePicture, setProfilePicture] = useState(user && user.profilePicture)
  const [updateUser] = useMutation(UPDATE_USER, {
    update(cache, { data: { updateUser }}) {
      cache.modify({
        fields: {
          users() {
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
      // getProjectFeed()
    } else if (actionSelected) {

    } else if (asksSelected) {

    }
    wait(2000).then(() => setRefreshing(false))
  }, [])
  // console.log('userid', finalUserId, additionalInfo)
  useEffect(() => {
    if (userOwned) {
      setUser(loggedInUser)
    } else {
      if (finalUserId && !user) {
        fetchUser({ getUser, userId: finalUserId, setUser})
      }
    }
    // if (finalUserId && !additionalInfo) {
    //   fetchAdditionalInfo({ getAdditionalInfo, userId: finalUserId, setAdditionalInfo })
    // }
  }, [])
  const additionalInfo = additionalInfoData && additionalInfoData.getUserAdditionalInfo
  return (
    <SafeAreaView style={{
      backgroundColor: White,
      flex: 1
    }}>
      <Header noGoingBack={noGoingBack} share={`${WONDER_BASE_URL}/user/${finalUserId}`} />
      <ProfileContext.Provider value={{
        section,
        setSection,
        refreshing,
        setRefreshing,
        // projectFeedData,
        // projectFeedLoading,
        // projectFeedError,
        // getProjectFeed,
        setModalVisible
      }}>
        {userOwned &&
          <UploadImage isVisible={isVisible} setModalVisible={setModalVisible} image={profilePicture} setImage={setProfilePicture} saveImageMutation={updateUser} imagePrefix={`project/${finalUserId}/`} saveImageMutationVariable={[{finalUserId, input: { profilePicture }}, ['input', 'profilePicture']]}  />
        }
        {
          user &&
          <FlatList    refreshControl={
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
          ListHeaderComponent={() => (
              <View style={profileStyles.profileContainer}>
              <View style={[profileStyles.profileInfoContainer, {
                justifyContent: 'space-between',
              }]}>
                {
                  user.profilePicture ?
                  <SafeImage style={profileStyles.profileImage} src={profilePicture|| user.profilePicture} />
                  :
                  <ProfilePlaceholder projectOwnedByUser={userOwned} />
                }
                <ProjectInfoText count={additionalInfo && additionalInfo.projectCount} type={user.projectCount === 1 ? 'project' : 'projects'} />
                <ProjectInfoText count={additionalInfo && additionalInfo.followerCount} type={user.followerCount === 1 ? 'follower': 'followers'} />
                <ProjectInfoText count={additionalInfo && additionalInfo.followingCount} type='following' />
                {/* <ProjectInfoText count={user.tasksCompleted} type='tasks completed' /> */}
              </View>
              <View style={[profileStyles.profileInfoContainer, {
                marginTop: spacingUnit * 3
              }]}>
                <Subheading style={{
                  fontSize: 18
                }} color={Black}>
                  {user.firstName} {user.lastName}
                </Subheading>
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
                    }}>
                      <RegularText color={Black}>
                        Edit Profile
                      </RegularText>
                    </SecondaryButton>
                  </>
                }
              </View>
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
              <DetermineUserProgress user={user} />
  
                <SectionsHeader />
            </View>
          )}
          data={[]}
          renderItem={({ item }) => renderProfileItem({ item, section, user, navigation })}
          >
  
          </FlatList>
        }
        </ProfileContext.Provider>
    </SafeAreaView>
  )
}

export default withAuth(UserProfile)
