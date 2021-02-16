
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { Pressable, SafeAreaView, View, RefreshControl, FlatList } from 'react-native'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import ConfettiCannon from 'react-native-confetti-cannon'

import { withAuth, useMe } from '../../components/withAuth'
import { ProfileTabParamList } from '../../types'
import { Header } from '../../components/Header'
import { Black, Blue500, Grey300, White, Blue400, Grey800 } from '../../constants/Colors'
import { profileStyles } from './style'
import { GET_PROJECT_BY_ID, GET_PROJECT_FEED, GET_PROJECT_ACTIONS } from '../../graphql/queries/project'
import { UPDATE_PROJECT, UPDATE_ASK, UPDATE_TASK, UPDATE_GOAL, COMPLETE_GOAL, COMPLETE_TASK, FOLLOW_PROJECT, UNFOLLOW_PROJECT } from '../../graphql/mutations'
import { SafeImage, UploadImage } from '../../storybook/stories/Image'
import { Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { SecondaryButton, FlexibleButton, PrimaryButton } from '../../storybook/stories/Button'
import { capitalizeFirstLetter, isCloseToBottom, isEmptyObject, spacingUnit, wait } from '../../utils/common'
import { WONDER_BASE_URL } from '../../constants/'
import { ProfileContext } from '../../utils/contexts'
import { EditProfileModal } from './EditProfileModal'
import {
  ProfilePlaceholder,
  ProjectInfoText,
  SectionsHeader,
  SetUpFlowProgress,
  StatusSelector,
  DetermineUserProgress,
  renderProfileItem,
  onSwipe
} from './common'
import Link from '../../assets/images/link'
import { GET_ASKS_FROM_PROJECT, GET_USER_STREAK, WHOAMI } from '../../graphql/queries'
import { sortByDueDate } from '../../utils/date'

const TagView = ({ tag }) => {
  return (
    <View style={{
      backgroundColor: Blue500,
      paddingLeft: spacingUnit,
      paddingRight: spacingUnit,
      paddingTop: 2,
      paddingBottom: 2,
      borderRadius: 4,
      marginRight: spacingUnit * 2
    }}>
      <RegularText color={White}>
        {capitalizeFirstLetter(tag)}
      </RegularText>
    </View>
  )
}

function ProjectProfile({
  navigation,
  route
}: StackScreenProps<ProfileTabParamList, 'ProjectProfile'>) {
  const user = useMe()

  const [section, setSection] = useState('feed')
  const [refreshing, setRefreshing] = useState(false)
  const [isVisible, setModalVisible] = useState(false)
  const [status, setStatus] = useState('created')
  const [editProfileModal, setEditProfileModal] = useState(false)
  const [profilePicture, setProfilePicture] = useState('')
  const [projectFeed, setProjectFeed] = useState([])
  const [updateProject] = useMutation(UPDATE_PROJECT, {
    update(cache, { data }) {
      cache.modify({
        fields: {
          getProjectById(existingProject={}) {

          }
        }
      })
    }
  })
  const {
    projectId,
    noGoingBack,
    editProfile,
    tab
  } = route.params
  const {
    loading: projectFeedLoading,
    data: projectFeedData,
    error: projectFeedError,
    refetch: feedRefetch,
    fetchMore: feedFetchMore
  } = useQuery(GET_PROJECT_FEED, {
    fetchPolicy: 'network-only',
    variables: {
      projectId
    }
  })

  const [followProject] = useMutation(FOLLOW_PROJECT, {
    variables: {
      projectId
    },
    update(cache) {
      cache.modify({
        fields: {
          users() {
            const newUser = {...user}
            const newArr = [projectId, ...(user ? user.projectsFollowing : [])]
            newUser.projectsFollowing = newArr
            return [newUser]
          }
        }
      })
    }
  })
    const [unfollowProject] = useMutation(UNFOLLOW_PROJECT, {
    variables: {
      projectId
    },
    update(cache) {
      cache.modify({
        fields: {
          users() {
            const newUser = {...user}
            const newExistingFollowing = user && user.projectsFollowing.filter(existingFollowingItem => existingFollowingItem !== projectId)
            newUser.projectsFollowing = newExistingFollowing
            return [newUser]
          }
        }
      })
    }
  })
  const [following, setFollowing] = useState(user && user.projectsFollowing && user.projectsFollowing.includes(projectId))

  const [getProjectActions, {
    loading: projectActionLoading,
    data: projectActionData,
    error: projectActionError
  }] = useLazyQuery(GET_PROJECT_ACTIONS, {
    variables: {
      projectId,
      status
    },
    fetchPolicy: 'network-only'
  })

  const [getProjectAsks, {
    loading: projectAskLoading,
    data: projectAskData,
    error: projectAskError
  }] = useLazyQuery(GET_ASKS_FROM_PROJECT, {
    variables: {
      projectId,
      status
    },
    fetchPolicy: 'network-only'
  })

  const [confetti, setConfetti] = useState(false)
  const [updateGoal] = useMutation(UPDATE_GOAL)
  const [updateTask] = useMutation(UPDATE_TASK)
  const [completeGoal] = useMutation(COMPLETE_GOAL, {
    refetchQueries: [
      { query: GET_USER_STREAK, variables: {
        userId: user && user.id
      } },
      
    ]
  })
  const [completeTask] = useMutation(COMPLETE_TASK, {
    refetchQueries: [
      { query: GET_USER_STREAK, variables: {
        userId: user && user.id
      } }
    ]
  })
  const [updateAsk] = useMutation(UPDATE_ASK)
  const { data, loading, error } = useQuery(GET_PROJECT_BY_ID, {
    variables: {
      projectId
    }
  })
  const project = data && data.getProjectById

  const projectOwnedByUser = project && user && project.createdBy === user.id

  const feedSelected = section === 'feed'
  const actionSelected = section === 'action'
  const asksSelected = section === 'asks'
  
  useEffect(() => {
    if (actionSelected) {
      getProjectActions({
        variables: {
          projectId,
          status
        }
      })
    } else if (asksSelected) {
      getProjectAsks({
        variables: {
          projectId,
          status
        }
      })
    }

    if (!profilePicture && project && project.profilePicture) {
      setProfilePicture(project && project.profilePicture)
    }
    if (editProfile) {
      setEditProfileModal(true)
    }
    if (projectFeedData && projectFeedData.getProjectFeed) {
      setProjectFeed(projectFeedData.getProjectFeed)
    }
  }, [project && project.profilePicture, feedSelected, actionSelected, asksSelected, status, projectFeedData && projectFeedData.getProjectFeed])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    if (feedSelected) {
      if (feedRefetch) {
        feedRefetch()
      }
    } else if (actionSelected) {
      getProjectActions({
        variables: {
          projectId,
          status
        }
      })
    } else if (asksSelected) {
      getProjectAsks({
        variables: {
          projectId,
          status
        }
      })
    }
    wait(2000).then(() => setRefreshing(false))
  }, [])

  const getCorrectData = section => {
    if (section === 'feed') {
      return projectFeed
    } else if (section === 'action') {
      const actions = projectActionData && projectActionData.getProjectActions
      if (!(user && user.usageProgress && user.usageProgress.askCreated) && (actions && actions.goals.length === 0 && actions.tasks.length === 0)) {
        return ['start']
      } else if((actions && actions.goals.length === 0 && actions.tasks.length === 0) && status === 'created') {
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
      const asks = projectAskData && projectAskData.getAsksFromProject
      if (asks && asks.length === 0 && status === 'created') {
        return ['none']
      }
      return asks
    }
  }

  const profileData = getCorrectData(section)
  const itemRefs = useRef(new Map())
  const actions = projectActionData && projectActionData.getProjectActions
  const onSwipeLeft = (item, type) => onSwipe({
    item,
    type,
    status: 'archived',
    completeGoal,
    updateGoal,
    project,
    user: null,
    actions,
    completeTask,
    updateTask,
    updateAsk,
    projectAskData,
    userAsksData: null
  })
  const onSwipeRight = (item, type) => onSwipe({
    item,
    type,
    status: 'completed',
    completeGoal,
    updateGoal,
    project,
    user: false,
    actions,
    completeTask,
    updateTask,
    updateAsk,
    projectAskData,
    userAsksData: null,
    setConfetti
  })

  function ProfileHeader () {
    return (
      (
        <View style={profileStyles.profileContainer}>
        <View style={[profileStyles.profileInfoContainer, {
          justifyContent: 'space-between',
        }]}>
          <View style={profileStyles.imageContainer}>
          {
            profilePicture ?
            <SafeImage style={profileStyles.profileImage} src={profilePicture|| project.profilePicture} />
            :
            <ProfilePlaceholder projectOwnedByUser={projectOwnedByUser} />
          }
          </View>
          <Pressable onPress={() => navigation.navigate('Root', {
              screen: tab ? tab : 'Profile',
              params: {
                screen: 'UserList',
                params: {
                  projectFollowers: true,
                  projectId: project.id
                }
              }
            })}>
            <ProjectInfoText count={project.followCount} type={project.followCount === 1 ? 'follower' : 'followers'} />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Root', {
              screen: tab ? tab: 'Profile',
              params: {
                screen: 'UserList',
                params: {
                  collaborators: project.collaborators,
                  projectId: project.id
                }
              }
          })}>
          <ProjectInfoText count={project.collaborators.length} type={project.collaborators.length === 1 ? 'collaborator': 'collaborators'} />
          </Pressable>
          <ProjectInfoText count={project.goalsCompletedCount} type='goals completed' />
          {/* <ProjectInfoText count={project.tasksCompleted} type='tasks completed' /> */}
        </View>
        <View style={[profileStyles.profileInfoContainer, {
          marginTop: spacingUnit * 3
        }]}>
          <Subheading style={{
            fontSize: 18
          }} color={Black}>
            {project.name}
          </Subheading>
          {
            projectOwnedByUser ?
            <>
              <SecondaryButton style={{
                width: spacingUnit * 13,
                backgroundColor: White,
                borderColor: Black,
                borderWidth: 1,
                paddingTop: 0,
                paddingBottom: 0,
                marginLeft: spacingUnit
              }} onPress={() => setEditProfileModal(true)}>
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
              unfollowProject()
            }}>
              <Paragraph color={Black}>
                Following
              </Paragraph>
            </Pressable>
            :
            <Pressable onPress={() => {
              setFollowing(true)
              followProject()
            }} style={profileStyles.followButton}>
              <Paragraph color={White}>
                Follow
              </Paragraph>
            </Pressable>
            }
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
            {project.description}
          </Paragraph>
        </View>
        {project && project.links && !isEmptyObject(project.links) && 
          <Pressable style={{
            paddingLeft: spacingUnit * 2,
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacingUnit
          }} onPress={() => {
            navigation.navigate('Root', {
              screen: tab ? tab : 'Profile',
              params: {
                screen: 'Links',
                params: {
                  links: project.links,
                  name: project.name
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
              Project links
            </Paragraph>
          </Pressable>
        }
        <View style={{
          marginTop: spacingUnit * 2,
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingLeft: spacingUnit * 2,
          paddingRight: spacingUnit * 2
        }}>
          {
            project.category &&
            <TagView tag={project.category} />
          }
          {
            project.tags && project.tags.map(tag => (
              <TagView tag={tag}/>
            ))
          }
        </View>
        <DetermineUserProgress user={user} projectId={projectId} />

          <SectionsHeader />
          {
            (actionSelected || asksSelected) &&
            <StatusSelector setStatus={setStatus} status={status} />
          }
      </View>
    )
    )
  }
  return (
    <SafeAreaView style={{
      backgroundColor: White,
      flex: 1
    }}
    >
      <Header noGoingBack={noGoingBack} share={`${WONDER_BASE_URL}/project/${projectId}`} />
      {
        confetti &&
        <ConfettiCannon count={200} origin={{x: -10, y: 0}} />
      }
      {
        project && 
        <ProfileContext.Provider value={{
          section,
          setSection,
          refreshing,
          setRefreshing,
          projectFeedData,
          projectFeedLoading,
          projectFeedError,
          setModalVisible
        }}>
        <EditProfileModal project={project} isVisible={editProfileModal} setModalVisible={setEditProfileModal} saveMutation={updateProject} />

          {
            projectOwnedByUser &&
            <UploadImage isVisible={isVisible} setModalVisible={setModalVisible} image={profilePicture} setImage={setProfilePicture} saveImageMutation={updateProject} imagePrefix={`project/${projectId}/`} saveImageMutationVariable={[{projectId, input: { profilePicture }}, ['input', 'profilePicture']]}  />
          }
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
        ListHeaderComponent={ProfileHeader()}
        data={profileData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => renderProfileItem({ item, section, user, userOwned: projectOwnedByUser, navigation, projectId, onSwipeLeft, onSwipeRight, itemRefs, tab })}
        onScroll={async ({nativeEvent}) => {
          if (section === 'feed') {
            if (isCloseToBottom(nativeEvent)) {
              if (feedFetchMore) {
                const result = await feedFetchMore({
                  variables: {
                    offset: projectFeed.length
                  }
                })

                if (result && result.data && result.data.getProjectFeed) {
                  setProjectFeed([...projectFeed, ...result.data.getProjectFeed])
                }
              }
            }
          }
        }}       
        >

        </FlatList>
        </ProfileContext.Provider>
      }
    </SafeAreaView>
  )
}

export default withAuth(ProjectProfile)