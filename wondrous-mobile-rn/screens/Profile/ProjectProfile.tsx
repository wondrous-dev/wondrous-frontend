
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { Pressable, SafeAreaView, View, RefreshControl, FlatList } from 'react-native'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import ConfettiCannon from 'react-native-confetti-cannon'
import Toast from 'react-native-toast-message'

import { FullScreenGoalModal } from '../../components/Modal/GoalModal'
import { FullScreenAskModal } from '../../components/Modal/AskModal'
import { withAuth, useMe } from '../../components/withAuth'
import { ProfileTabParamList } from '../../types'
import { Header } from '../../components/Header'
import palette from 'theme/palette'
import { profileStyles } from './style'
import { GET_PROJECT_BY_ID, GET_PROJECT_FEED, GET_PROJECT_ACTIONS, GET_PROJECT_FOLLOW_REQUEST } from '../../graphql/queries/project'
import { UPDATE_PROJECT, UPDATE_ASK, UPDATE_TASK, UPDATE_GOAL, COMPLETE_GOAL, COMPLETE_TASK, FOLLOW_PROJECT, UNFOLLOW_PROJECT, REMOVE_FOLLOW_REQUEST, CREATE_GOAL, CREATE_ASK } from '../../graphql/mutations'
import { SafeImage, UploadImage } from '../../storybook/stories/Image'
import { Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { FullScreenDiscussionModal } from '../../components/Modal/ProjectDiscussionModal'
import { SecondaryButton, FlexibleButton, PrimaryButton } from '../../storybook/stories/Button'
import { capitalizeFirstLetter, getRingActions, isEmptyObject, spacingUnit, usePrevious, wait, getLocale } from '../../utils/common'
import { GoalCongratsModal, TaskCongratsModal } from '../../components/Modal'
import { WONDER_BASE_URL } from '../../constants/'
import { ProfileContext, UserCongratsContext } from '../../utils/contexts'
import { EditProfileModal } from './EditProfileModal'
import { InviteCollaboratorModal } from './InviteCollaboratorModal'
import {
  ProfilePlaceholder,
  ProjectInfoText,
  SectionsHeader,
  SetUpFlowProgress,
  DetermineUserProgress,
  renderProfileItem,
  onSwipe,
  getPinnedFeed,
  DiscussionSelector,
  fetchActions
} from './common'
import Link from '../../assets/images/link'
import { GET_ASKS_FROM_PROJECT, GET_USER_RING_ACTION_COUNT, GET_USER_STREAK, WHOAMI } from '../../graphql/queries'
import { sortByDueDate } from '../../utils/date'
import ProfilePictureModal from './ProfilePictureModal'
import Lock from '../../assets/images/lock'
import { GET_PROJECT_DISCUSSIONS } from '../../graphql/queries/projectDiscussion'
import { CREATE_PROJECT_DISCUSSION } from '../../graphql/mutations/projectDiscussion'
import { StatusSelector } from '../../components/Status/StatusSelector'
import AddIcon from '../../assets/images/add-dark-button'

const TagView = ({ tag }) => {
  if (tag === 'ai_ml') {
    tag = 'AI/ML'
  } else if (tag === 'crypto_blockchain') {
    tag = 'Crypto/blockchain'
  } else if (tag === 'creator_tools') {
    tag = 'Creator tools'
  } else if (tag === 'b2b_sass') {
    tag = 'B2B Sass'
  } else if (tag === 'no_code') {
    tag = 'No code'
  } else if (tag === 'future_of_work') {
    tag = 'Future of work'
  } else if (tag === 'dev_tools') {
    tag = 'Dev tools'
  }

  return (
    <View style={{
      backgroundColor: palette.purple,
      paddingLeft: spacingUnit,
      paddingRight: spacingUnit,
      paddingTop: 2,
      paddingBottom: 2,
      borderRadius: 4,
      marginRight: spacingUnit * 2,
      marginTop: spacingUnit
    }}>
      <RegularText color={palette.white}>
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
  const {
    projectId,
    noGoingBack,
    editProfile,
    tab,
    fetchedProject
  } = route.params
  const [section, setSection] = useState('feed')
  const [refreshing, setRefreshing] = useState(false)
  const [isVisible, setModalVisible] = useState(false)
  const [status, setStatus] = useState('created')
  const [editProfileModal, setEditProfileModal] = useState(false)
  const [inviteCollaboratorModal, setInviteCollaboratorModal] = useState(false)
  const [profilePicture, setProfilePicture] = useState('')
  const [profilePictureModal, setProfilePictureModal] = useState(false)
  const [discussionModal, setDiscussionModal] = useState(false)
  const [discussionState, setDiscussionState] = useState('open')
  const [projectFeed, setProjectFeed] = useState([])
  const [discussions, setDiscussions] = useState([])
  const [taskCompleteModal, setTaskCompleteModal] = useState(false)
  const [goalCompletemodal, setGoalCompleteModal] = useState(false)
  const [goalModalVisible, setGoalModalVisible] = useState(false)
  const [askModalVisible, setAskModalVisible] = useState(false)
  const previousDiscussionState = usePrevious(discussionState)
  const [following, setFollowing] = useState(user && user.projectsFollowing && user.projectsFollowing.includes(projectId))
  const [followRequested, setFollowRequested] = useState(false)
  const [confetti, setConfetti] = useState(false)
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
    loading: projectFeedLoading,
    data: projectFeedData,
    error: projectFeedError,
    refetch: feedRefetch,
    fetchMore: feedFetchMore
  } = useQuery(GET_PROJECT_FEED, {
    fetchPolicy: 'network-only',
    variables: {
      projectId,
      offset: 0,
      limit: 10
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
  const { data: projectFollowRequestData } = useQuery(GET_PROJECT_FOLLOW_REQUEST, {
    variables: {
      userId: user?.id,
      projectId
    },
    fetchPolicy: 'network-only'
  })

  const [removeFollowRequest] = useMutation(REMOVE_FOLLOW_REQUEST, {
    variables: {
      userId: user?.id,
      projectId
    }
  })

  const projectFollowRequest = projectFollowRequestData?.getProjectFollowRequest
  const [getProjectActions, {
    loading: projectActionLoading,
    data: projectActionData,
    error: projectActionError
  }] = useLazyQuery(GET_PROJECT_ACTIONS, {
    variables: {
      projectId,
      limit: 100,
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

  const [getProjectDiscussions, {
    data: projectDiscussionData,
    fetchMore: fetchMoreDiscussions
  }] = useLazyQuery(GET_PROJECT_DISCUSSIONS, {
    fetchPolicy: 'network-only',
    variables: {
      state: discussionState
    }
  })

  const [createGoal] = useMutation(CREATE_GOAL, {
    refetchQueries: [
      { query: GET_USER_STREAK,
      variables: {
        userId: user && user.id
      } },
      {
        query: GET_PROJECT_ACTIONS,
        variables: {
          projectId,
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
  const {
    data: userRingActionCountData
  } = useQuery(GET_USER_RING_ACTION_COUNT, {
    variables: {
      userId: user?.id
    }, 
    fetchPolicy: 'network-only'
  })
  const {
    incompleteRingActions,
    completedRingActions
  } = getRingActions(userRingActionCountData)
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
        userId: user && user.id,
      } }
    ]
  })

  const [createAsk] = useMutation(CREATE_ASK, {
    refetchQueries: [
      {
        query: GET_ASKS_FROM_PROJECT,
        variables: {
          projectId,
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

  const [updateAsk] = useMutation(UPDATE_ASK)
  const { data, loading, error } = useQuery(GET_PROJECT_BY_ID, {
    variables: {
      projectId
    }, 
    fetchPolicy: 'network-only'
  })
  const [createProjectDiscussion] = useMutation(CREATE_PROJECT_DISCUSSION, {
    update(cache, { data: createProjectDiscussion }) {
      cache.modify({
        fields: {
          getProjectDiscussions(existingDiscussions=[], { readField }) {
            return [createProjectDiscussion, ...existingDiscussions]
          }
        }
      })
    }
  })

  const project = fetchedProject || (data && data.getProjectById)
  const projectOwnedByUser = project && (user && (project.createdBy === user.id || (project.collaborators && project.collaborators.some(element => element.user.id === user.id))))
  const feedSelected = section === 'feed'
  const actionSelected = section === 'action'
  const asksSelected = section === 'asks'
  const discussionSelected = section === 'discussion'

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
    } else if (discussionSelected && (!projectDiscussionData || (discussionState !== previousDiscussionState))) {
      getProjectDiscussions({
        variables: {
          projectId,
          state: discussionState,
          limit: 10,
          offset: 0
        }
      })
    }

    if (!profilePicture && project && project.profilePicture) {
      setProfilePicture(project && (project.thumbnailPicture || project.profilePicture))
    }
    if (editProfile) {
      setEditProfileModal(true)
    }
    if (projectFeedData && projectFeedData.getProjectFeed) {
      setProjectFeed(projectFeedData.getProjectFeed)
    }
    if (projectDiscussionData?.getProjectDiscussions) {
      setDiscussions(projectDiscussionData?.getProjectDiscussions)
    }
    
    if (projectFollowRequest?.id) {
      if (!projectFollowRequest?.approvedAt) {
        setFollowRequested(true)
      } else if (projectFollowRequest.approvedAt) {
        setFollowing(true)
      }
    }
  }, [project && (project.thumbnailPicture || project.profilePicture), feedSelected, actionSelected, asksSelected, discussionSelected, status, discussionState, projectFeedData && projectFeedData.getProjectFeed, projectDiscussionData?.getProjectDiscussions, projectFollowRequest])

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
    } else if (discussionSelected) {
      getProjectDiscussions({
        variables: {
          projectId,
          state: discussionState
        }
      })
    }
    wait(2000).then(() => setRefreshing(false))
  }, [])

  const getCorrectData = section => {
    if (section === 'feed') {
      const filteredFeed = projectFeed.filter(feedItem => {
        return !(user?.blockedUsers?.includes(feedItem.userId) || user?.blockedByUsers?.includes(feedItem.userId))
      })
      return getPinnedFeed(filteredFeed)
    } else if (section === 'action') {
      const actions = projectActionData && projectActionData.getProjectActions

      const filteredActions = {
        goals: actions?.goals?.filter(goalItem => !(user?.blockedUsers?.includes(goalItem.ownerId) || user?.blockedByUsers?.includes(goalItem.ownerId))),
        tasks: actions?.tasks?.filter(taskItem => !(user?.blockedUsers?.includes(taskItem.ownerId) || user?.blockedByUsers?.includes(taskItem.ownerId))),
      }
      return fetchActions(filteredActions, status)
    } else if (section === 'asks') {
      const asks = projectAskData && projectAskData.getAsksFromProject
      if (asks && asks.length === 0 && status === 'created') {
        return ['none']
      }
      const filteredAsks = asks && asks.filter(askItem => {
        return !(user?.blockedUsers?.includes(askItem.userId) || user?.blockedByUsers?.includes(askItem.userId))
      })
      return filteredAsks
    } else if (section === 'discussion') {
      if (discussions?.length === 0 ) {
        return ['none']
      }
      const filteredDicussions = discussions?.filter(discussion => {
        return !(user?.blockedUsers?.includes(discussion.createdBy) || user?.blockedByUsers?.includes(discussion.createdBy))
      })
      return filteredDicussions
    }
  }

  const profileData = getCorrectData(section)
  const itemRefs = useRef(new Map())
  const publicProject = project?.privacyLevel === 'public'
  const projectAccessible = publicProject || following || projectOwnedByUser
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
    userAsksData: null,
    loggedInUser: user
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
    setConfetti,
    loggedInUser: user,
    setTaskCompleteModal,
    setGoalCompleteModal
  })

  function ProfileHeader () {
    return (
      (
        <View style={profileStyles.profileContainer}>
        {
          !profilePicture && projectOwnedByUser && 
          <RegularText style={{
            paddingLeft: spacingUnit * 2,
            paddingRight: spacingUnit * 2,
            marginTop: spacingUnit * -1,
            marginBottom: spacingUnit,
            color: palette.grey800
          }}>
            Your project will only appear on our search page if there is a profile picture!  
          </RegularText>
        }
        <View style={[profileStyles.profileInfoContainer, {
          justifyContent: 'space-between',
        }]}>
          
          <View style={profileStyles.imageContainer}>
          {
            profilePicture ?
            <Pressable onPress={() => {
              setProfilePictureModal(true)
            }}>
              <SafeImage profilePicture style={profileStyles.profileImage} src={profilePicture || (project.thumbnailPicture || project.profilePicture)} />
            </Pressable>
            :
            (
              project 
              ?
              <ProfilePlaceholder projectOwnedByUser={projectOwnedByUser} />
              :
              null
            )
          }
          </View>
          <Pressable onPress={() => {
            if (projectAccessible) {
              navigation.navigate('Root', {
                screen: tab ? tab : 'Profile',
                params: {
                  screen: 'UserList',
                  params: {
                    projectFollowers: true,
                    projectId: project.id
                  }
                }
              })
            }
          }}>
            <ProjectInfoText count={project.followCount} type={project.followCount === 1 ? 'follower' : 'followers'} />
          </Pressable>
          <Pressable onPress={() => {
            if (projectAccessible) {
              navigation.navigate('Root', {
                screen: tab ? tab: 'Profile',
                params: {
                  screen: 'UserList',
                  params: {
                    collaborators: project.collaborators || [],
                    projectId: project.id
                  }
                }
            })
            }
          }}>
          <ProjectInfoText count={project.collaborators.length} type={project.collaborators.length === 1 ? 'collaborator': 'collaborators'} />
          </Pressable>
          <ProjectInfoText count={project.goalsCompletedCount} type='goals completed' />
          {/* <ProjectInfoText count={project.tasksCompleted} type='tasks completed' /> */}
        </View>
        <View style={[profileStyles.profileInfoContainer, {
          marginTop: spacingUnit * 3,
        }]}>
          <View style={profileStyles.profileHeader}>
          <Subheading style={{
            fontSize: 18
          }} color={palette.black}>
            {project.name}
          </Subheading>
          </View>
          {
            projectOwnedByUser ?
            <>
              <SecondaryButton style={{
                ...profileStyles.editButton,
                marginRight: spacingUnit
              }} onPress={() => setEditProfileModal(true)}>
                <RegularText color={palette.black}>
                  Edit Project
                </RegularText>
              </SecondaryButton>
              <PrimaryButton style={{
                width: spacingUnit * 19,
                paddingTop: 0,
                paddingBottom: 0
              }} onPress={() => setInviteCollaboratorModal(true)}>
                <RegularText color={palette.white} >
                  Invite Collaborators
                </RegularText>
              </PrimaryButton>
            </>
            :
            <>
            {
            following || followRequested ?
            <Pressable style={profileStyles.followingButton} onPress={() => {
              if (followRequested || !publicProject) {
                setFollowRequested(false)
                removeFollowRequest()
              } 
              setFollowing(false)
              unfollowProject()
            }}>
              <Paragraph color={palette.black}>
               {
                 following
                 ?
                 'Following'
                 :
                 'Requested'
               }
              </Paragraph>
            </Pressable>
            :
            <Pressable onPress={() => {
              if (publicProject) {
                setFollowing(true)
              } else {
                setFollowRequested(true)
              }
              followProject()
            }} style={profileStyles.followButton}>
              <Paragraph color={palette.white}>
                Follow
              </Paragraph>
            </Pressable>
            }
            </>
          }
        </View>
          {
            projectAccessible &&
            <View style={[profileStyles.profileInfoContainer, {
              marginTop: spacingUnit,
            }]}>
              <Paragraph color={palette.black} style={{
                flexWrap: 'wrap',
                textAlign: 'left'
              }}>
                {project.description}
              </Paragraph>
            </View>
          }
        {project && projectAccessible && project.links && !isEmptyObject(project.links) && 
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
            <Link color={palette.grey800} style={{
              marginRight: spacingUnit * 0.5,
              width: spacingUnit * 2.5,
              height: spacingUnit * 2.5
            }} />
            <Paragraph color={palette.blue400}>
              Project links
            </Paragraph>
          </Pressable>
        }
        <View style={{
          marginTop: spacingUnit,
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingLeft: spacingUnit * 2,
          paddingRight: 0
        }}>
          {
            project?.category && projectAccessible && 
            <TagView tag={project.category} />
          }
          {
            projectAccessible && project?.tags && project.tags.map(tag => (
              <TagView tag={tag}/>
            ))
          }
        </View>
        {
          projectOwnedByUser &&
          <DetermineUserProgress user={user} projectId={projectId} />
        }

          <SectionsHeader />
          {
            (actionSelected || asksSelected) &&
            <View style={{
              alignItems: 'center',
              flexDirection: 'row'
            }}>
            <StatusSelector setStatus={setStatus} status={status} section={section} />
            {
              projectOwnedByUser &&
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
            discussionSelected &&
            <DiscussionSelector setDiscussionModal={setDiscussionModal} setDiscussionState={setDiscussionState} discussionState={discussionState} />
          }
      </View>
    )
    )
  }

  return (
    <SafeAreaView style={{
      backgroundColor: palette.white,
      flex: 1
    }}
    >
      <Header noGoingBack={noGoingBack} />
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
          setModalVisible,
          type: 'project'
        }}>
          {
            projectOwnedByUser &&
            <>
            <UploadImage isVisible={isVisible} setModalVisible={setModalVisible} image={profilePicture} setImage={setProfilePicture} saveImageMutation={updateProject} imagePrefix={`tmp/${projectId}/`} saveImageMutationVariable={[{projectId, input: { profilePicture }}, ['input', 'profilePicture']]}  />
            <InviteCollaboratorModal project={project} isVisible={inviteCollaboratorModal} setModalVisible={setInviteCollaboratorModal} />
            <EditProfileModal project={project} isVisible={editProfileModal} setModalVisible={setEditProfileModal} saveMutation={updateProject} setParentImage={setProfilePicture}/>
            <UserCongratsContext.Provider value={{
              user,
              incompleteRingActions,
              completedRingActions
            }}
            >
              <GoalCongratsModal user={user} isVisible={goalCompletemodal} setModalVisible={setGoalCompleteModal} />
              <TaskCongratsModal user={user} isVisible={taskCompleteModal} setModalVisible={setTaskCompleteModal} />
            </UserCongratsContext.Provider>
            <FullScreenGoalModal setModalVisible={setGoalModalVisible} isVisible={goalModalVisible} goalMutation={createGoal} />
            <FullScreenAskModal setModalVisible={setAskModalVisible} isVisible={askModalVisible} askMutation={createAsk} />
            </>
          }
          <ProfilePictureModal profilePicture={project?.profilePicture} isVisible={profilePictureModal} setModalVisible={setProfilePictureModal} />
          <FullScreenDiscussionModal isVisible={discussionModal} setModalVisible={setDiscussionModal} projectDiscussionMutation={createProjectDiscussion} project={project} />

        <FlatList refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ItemSeparatorComponent={() => (
          <View
          style={[(feedSelected || discussionSelected) && {
            borderBottomColor: palette.grey300,
            borderBottomWidth: 1,
          }]}
          />
        )}
        ListHeaderComponent={ProfileHeader()}
        ListEmptyComponent={() => {
          if (!projectAccessible) {
            return (
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: spacingUnit * 10
              }}>
                <Lock color={palette.grey800} style={{
                  alignSelf: 'center',
                  width: spacingUnit * 6,
                  height: spacingUnit * 6
                }} />
                <Subheading color={palette.grey800} style={{
                  marginTop: spacingUnit * 2
                }}>
                  This is a private project
                </Subheading>
                <Paragraph color={palette.grey700} style={{
                  marginTop: spacingUnit
                }}>
                  Follow this project to see their activity
                </Paragraph>
              </View>
            )
          }
          if (profileData) {
            return (
              <Paragraph style={{
                alignSelf: 'center',
                marginTop: spacingUnit * 3
              }}>
                Nothing here yet
              </Paragraph>
            )
          }
          return null
        }}
        data={projectAccessible ? profileData: [{id: null}]}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          if (projectAccessible) {
            return renderProfileItem({ item, section, user, userOwned: projectOwnedByUser, navigation, projectId, onSwipeLeft, onSwipeRight, itemRefs, tab, loggedInUser: user, setDiscussionModal })
          } else {
            return (
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: spacingUnit * 10
              }}>
                <Lock color={palette.grey800} style={{
                  alignSelf: 'center',
                  width: spacingUnit * 6,
                  height: spacingUnit * 6
                }} />
                <Subheading color={palette.grey800} style={{
                  marginTop: spacingUnit * 2
                }}>
                  This is a private project
                </Subheading>
                <Paragraph color={palette.grey700} style={{
                  marginTop: spacingUnit
                }}>
                  Follow this project to see their activity
                </Paragraph>
              </View>
            )
          }
        }}
        onEndReached={async () => {
          if (section === 'feed') {
            if (feedFetchMore) {
              const result = await feedFetchMore({
                variables: {
                  offset: projectFeed.length
                }
              })

              if (result?.data?.getProjectFeed) {
                setProjectFeed([...projectFeed, ...result.data.getProjectFeed])
              }
            }
          } else if (section === 'discussion') {
            if (fetchMoreDiscussions) {
              const result = await fetchMoreDiscussions({
                variables: {
                  offset: discussions.length
                }
              })

              if (result?.data?.getProjectDiscussions) {
                setDiscussions([...discussions, ...result.data.getProjectDiscussions])
              }
            }
          }
        }}    
        />
        </ProfileContext.Provider>
      }
    </SafeAreaView>
  )
}

export default withAuth(ProjectProfile, true)