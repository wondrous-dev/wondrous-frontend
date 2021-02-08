
import React, { useState, useCallback, useEffect } from 'react'
import { Image, Pressable, SafeAreaView, RefreshControl, View, TouchableOpacity } from 'react-native'
import { useLazyQuery, useMutation } from '@apollo/client'

import { GET_USER_FOLLOWERS, GET_USER_FOLLOWING, GET_PROJECT_FOLLOWERS } from '../../graphql/queries'
import { withAuth, useMe } from '../../components/withAuth'
import { Black, White, Grey800, Blue400 } from '../../constants/Colors'
import { Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { wait, spacingUnit, cutString } from '../../utils/common'
import { ProfilePlaceholder } from './common'
import { SafeImage } from '../../storybook/stories/Image'
import DefaultProfilePicture from '../../assets/images/default-profile-picture.jpg'
import { Header } from '../../components/Header'
import { listStyles } from './style'
import { FlatList } from 'react-native-gesture-handler'
import { UNFOLLOW_USER, FOLLOW_USER } from '../../graphql/mutations'

const UserItem = ({ item, itemPressed, initialFollowing, existingUserFollowing }) => {
  const [following, setFollowing] = useState(initialFollowing)
  const user = useMe()
  const [followUser] = useMutation(FOLLOW_USER, {
    variables: {
      followingId: item.id
    },
    update(cache) {
      cache.modify({
        fields: {
          users() {
            const newUser = {...user}
            const newArr = [item.id, ...existingUserFollowing]
            newUser.usersFollowing = newArr
            return [newUser]
          }
        }
      })
    }
  })

  const [unfollowUser] = useMutation(UNFOLLOW_USER, {
    variables: {
      followingId: item.id
    },
    update(cache) {
      cache.modify({
        fields: {
          users() {
            const newUser = {...user}
            const newExistingFollowing = existingUserFollowing.filter(existingFollowingItem => existingFollowingItem !== item.id)
            newUser.usersFollowing = newExistingFollowing
            return [newUser]
          }
        }
      })
    }
  })

  useEffect(() => {
    setFollowing(initialFollowing)
  }, [initialFollowing])
  return (
    <TouchableOpacity onPress={itemPressed}>
    <View style={[listStyles.listItem, {
      alignItems: 'flex-start',
      marginBottom: spacingUnit * 2.5
    }]}>
      {
        item.profilePicture ?
        <View>
        <SafeImage src={item.profilePicture} style={listStyles.listImage} />
        </View>
        :
        <Image source={DefaultProfilePicture} style={{
          marginRight: 8,
          width: spacingUnit * 6,
          height: spacingUnit * 6,
          borderRadius: spacingUnit * 3
        }} />
      }
      <View style={{
        paddingRight: spacingUnit,
        flex: 1
      }}>
        <Subheading style={{
          fontSize: 16
        }} color={Black}>{item.firstName + ' ' +  item.lastName}</Subheading>
        {item.username &&
        <RegularText color={Grey800}>
          @{item.username}
        </RegularText>}
        {item.bio &&
          <RegularText color={Black} style={{
            marginTop: spacingUnit * 0.5
          }}>
          {cutString(item.bio)}
        </RegularText>
        }
      </View>
      {
        user.id !== item.id &&
        <>
{
        following
        ?
        <Pressable style={listStyles.followingButton} onPress={() => {
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
        }} style={listStyles.followButton}>
          <Paragraph color={White}>
            Follow
          </Paragraph>
        </Pressable>
      }
        </>
      }
    </View>
</TouchableOpacity>
  )
}
const UserList = ({
  navigation,
  route
}) => {

  const user = useMe()
  const {
    followers,
    following,
    userId,
    projectId,
    collaborators,
    projectFollowers
  } = route.params

  const [getProjectFollowers, {
    data: projectFollowerData,
    loading: projectFollowerLoading,
    error: projectFollowerError
  }] = useLazyQuery(GET_PROJECT_FOLLOWERS)

  const [getUserFollowers, {
    data: followerData,
    loading: followerLoading,
    error: followerError
  }] = useLazyQuery(GET_USER_FOLLOWERS)
  const [getUserFollowing, {
    data: followingData,
    loading: followingLoading,
    error: followingError
  }] = useLazyQuery(GET_USER_FOLLOWING)

  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    if (followers) {
      getUserFollowers()
    } else if (following) {
      getUserFollowing()
    }
    wait(2000).then(() => setRefreshing(false))
  }, [])
  useEffect(() => {
    if (projectId) {
      getProjectFollowers({
        variables: {
          projectId
        }
      })
    } else if (userId) {
      if (followers) {
        getUserFollowers({
          variables: {
            userId
          }
        })
      } else if (following) {
        getUserFollowing({
          variables: {
            userId
          }
        })
      }
    }
  }, [])

  const followingUsers = user && user.usersFollowing
  let users = []
  if (userId) {
    if (following && followingData) {
      users = followingData.getUserFollowing
    } else if (followers && followerData) {
      users = followerData.getUserFollowers
    }
  } else if (projectId) {
    if (collaborators) {
      users = collaborators.map(collaborator => collaborator.user)
    } else if (projectFollowers && projectFollowerData) (
      users = projectFollowerData.getProjectFollowers
    )
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <Header title={following ? 'Following' : 'Followers'} />
      <View>
        <Subheading>
          Followers
        </Subheading>
        <FlatList
        data={users}
        contentContainerStyle={listStyles.listContainer}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => {
            const userFollowing = followingUsers && followingUsers.some((element) => {
              return element === item.id
            })
            return (
              <UserItem
                initialFollowing={userFollowing}
                existingUserFollowing={followingUsers}
                item={item}
                itemPressed={() => navigation.navigate('Root', {
                  screen: 'Profile',
                  params: {
                    screen: 'UserProfile',
                    params: {
                      userId: item.id
                    }
                  }
                })}
              />
            )
          }}
        />
      </View>
    </SafeAreaView>
  )
}

export default withAuth(UserList)