
import React, { useState, useCallback, useEffect } from 'react'
import { Image, Pressable, SafeAreaView, RefreshControl, View, TouchableOpacity } from 'react-native'
import { useLazyQuery, useQuery, useMutation } from '@apollo/client'

import { GET_USER_FOLLOWERS, GET_USER_FOLLOWING, GET_PROJECT_FOLLOWERS, GET_FEED_REACTED_USERS, GET_FEED_COMMENT_REACTED_USERS } from '../../graphql/queries'
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
import {
  ProjectItem
} from './ProjectList'


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
        <SafeImage src={(item.thumbnailPicture || item.profilePicture)} style={listStyles.listImage} />
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
        user && user.id !== item.id &&
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
    projectFollowers,
    tab,
    feedCommentId,
    feedItemId
  } = route.params

  const {
    data: projectFollowerData,
    loading: projectFollowerLoading,
    error: projectFollowerError
  } = useQuery(GET_PROJECT_FOLLOWERS, {
    fetchPolicy: 'network-only',
    variables: {
      projectId
    }
  })

  const {
    data: followerData,
    loading: followerLoading,
    error: followerError,
    refetch: refetchUserFollowers
  } = useQuery(GET_USER_FOLLOWERS, {
    fetchPolicy: 'network-only',
    variables: {
      userId
    }
  })
  const {
    data: followingData,
    loading: followingLoading,
    error: followingError,
    refetch: refetchUserFollowing
  } = useQuery(GET_USER_FOLLOWING, {
    fetchPolicy: 'network-only',
    variables: {
      userId
    }
  })

  const [getFeedReactedUsers, {
    data: feedReactedData
  }] = useLazyQuery(GET_FEED_REACTED_USERS)

  const [getFeedCommentReactedUsers, {
    data: feedCommentReactedData
  }] = useLazyQuery(GET_FEED_COMMENT_REACTED_USERS)

  useEffect(() => {
    if (feedItemId) {
      getFeedReactedUsers({
        variables: {
          feedItemId
        }
      })
    }  else if (feedCommentId) {
      getFeedCommentReactedUsers({
        variables :{
          feedCommentId
        }
      })
    }
  }, [feedItemId, feedCommentId])

  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    if (followers) {
      refetchUserFollowers()
    } else if (following) {
      refetchUserFollowing()
    }
    wait(2000).then(() => setRefreshing(false))
  }, [])
  const [seeProject, setSeeProject] = useState(false)

  const followingUsers = user && user.usersFollowing
  const followingProjects = user && user.projectsFollowing
  let list = []
  if (userId) {
    if (following && followingData) {
      if (seeProject) {
        list = followingData.getUserFollowing && followingData.getUserFollowing.projects
      } else {
        list = followingData.getUserFollowing && followingData.getUserFollowing.users
      }
    } else if (followers && followerData) {
      list = followerData.getUserFollowers
    }
  } else if (projectId) {
    if (collaborators) {
      list = collaborators.map(collaborator => collaborator.user)
    } else if (projectFollowers && projectFollowerData) (
      list = projectFollowerData.getProjectFollowers
    )
  } else if (feedReactedData) {
    list = feedReactedData.getFeedReactedUsers
  } else if (feedCommentReactedData) {
    list = feedCommentReactedData.getFeedCommentReactedUsers
  }

  let title = ''
  if (projectId) {
    if (followers) {
      title = 'Followers'
    } else {
      title = 'Collaborators'
    }
  } else if (feedCommentId || feedItemId) {
    title = 'Liked by'
  } else {
    title = following ? 'Following' : 'Followers'
  }
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <Header title={title} />
      <View>
        {
          following &&
          <View style={{
            flexDirection: 'row',
            marginTop: spacingUnit * 2,
            paddingLeft: spacingUnit * 2,
            paddingRight: spacingUnit * 2,
            marginBottom: spacingUnit * 2
          }}>
            <Pressable onPress={() => setSeeProject(false)} style={{
              padding: spacingUnit * 0.5,
              flex: 1,
              alignItems: 'center',
              borderRadius: 4,
              ...(!seeProject && {
                backgroundColor: Blue400
              })
            }}>
              <RegularText color={seeProject ? Grey800 : White}>
                Users
              </RegularText>
            </Pressable>
            <Pressable onPress={() => setSeeProject(true)} style={{
              padding: spacingUnit * 0.5,
              flex: 1,
              alignItems: 'center',
              borderRadius: 4,
              ...(seeProject && {
                backgroundColor: Blue400
              })
            }}>
              <RegularText color={seeProject ? White : Grey800}>
                Projects
              </RegularText>
            </Pressable>
          </View>
        }
        {
          list && list.length === 0 &&
          <Paragraph style={{
            padding: spacingUnit * 2
          }} onPress={() => navigation.navigate('Root', {
            screen: 'Search'
          })}>
            Time to explore! Go to our <Paragraph color={Blue400}>
              search page
            </Paragraph> to find some cool projects or users!
          </Paragraph>
        }
        <FlatList
        data={list}
        contentContainerStyle={listStyles.listContainer}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => {
            const userFollowing = followingUsers && (!seeProject ? followingUsers.some((element) => {
              return element === item.id
            }) : followingProjects.some(element => element === item.id))


            return (
              seeProject
              ?
              <ProjectItem
              key={item.id}
              profilePicture={item.thumbnailPicture || item.profilePicture}
              project={true}
              itemDescription={item.description}
              itemName={item.name}
              itemPressed={() => navigation.navigate('Root', {
                screen: tab || 'Profile',
                params: {
                  screen: 'ProjectProfile',
                  params: {
                    projectId: item.id
                  }
                }
              })}
              />
              :
              <UserItem
                initialFollowing={userFollowing}
                existingUserFollowing={followingUsers}
                item={item}
                itemPressed={() => navigation.navigate('Root', {
                  screen: tab || 'Profile',
                  params: {
                    screen: 'OtherUserProfile',
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