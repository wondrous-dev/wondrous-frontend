
import React, { useState, useCallback, useEffect } from 'react'
import { Image, Pressable, SafeAreaView, RefreshControl, View, TouchableOpacity } from 'react-native'
import { useLazyQuery, useMutation } from '@apollo/client'

import { GET_USER_FOLLOWERS, GET_USER_FOLLOWING } from '../../graphql/queries'
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
  const [followUser] = useMutation(FOLLOW_USER, {
    variables: {
      followingId: item.id
    },
    update(cache) {
      cache.modify({
        fields: {
          getUserFollowing(existingFollowing) {
            return [item, ...existingFollowing]
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
          getUserFollowing() {
            const newExistingFollowing = existingUserFollowing.filter(existingFollowingItem => existingFollowingItem.id !== item.id)
            return newExistingFollowing
          }
        }
      })
    }
  })

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
        following
        ?
        <Pressable style={{
          paddingTop: 2,
          paddingBottom: 2,
          paddingLeft: spacingUnit * 2.5,
          paddingRight: spacingUnit * 2.5,
          borderWidth: 1,
          borderRadius: 4,
          borderColor: Black
        }} onPress={() => {
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
        }} style={{
          paddingTop: 2,
          paddingBottom: 2,
          paddingLeft: spacingUnit * 2.5,
          paddingRight: spacingUnit * 2.5,
          backgroundColor: Blue400,
          borderRadius: 4
        }}>
          <Paragraph color={White}>
            Follow
          </Paragraph>
        </Pressable>
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
    following
  } = route.params

  const [getUserFollowers, {
    data: followerData,
    loading: followerLoading,
    error: followerError
  }] = useLazyQuery(GET_USER_FOLLOWERS, {
    variables: {
      userId: user && user.id
    }
  })
  const [getUserFollowing, {
    data: followingData,
    loading: followingLoading,
    error: followingError
  }] = useLazyQuery(GET_USER_FOLLOWING, {
    variables: {
      userId: user && user.id
    }
  })

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
    getUserFollowing()
    if (followers) {
      getUserFollowers()
    }
  }, [])

  const followingUsers = followingData && followingData.getUserFollowing
  let users = []
  if (following && followingData) {
    users = followingData.getUserFollowing
  } else if (followers && followerData) {
    users = followerData.getUserFollowers
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <Header title={user && user.username} />
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
              return element.id === item.id
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
                    userId: item.id
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