
import React, { useState, createContext, useCallback, useEffect } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { Dimensions, Image, Pressable, SafeAreaView, StyleSheet, View, RefreshControl, FlatList } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { useQuery, useLazyQuery, useMutation, useReactiveVar } from '@apollo/client'
import { Bar } from 'react-native-progress'
import { useNavigation } from '@react-navigation/native'

import { withAuth, useMe } from '../../components/withAuth'
import { ProfileTabParamList } from '../../types'
import { Header } from '../../components/Header'
import { Black, Grey300, White } from '../../constants/Colors'
import { profileStyles } from './style'
import { GET_PROJECT_BY_ID, GET_PROJECT_FEED } from '../../graphql/queries/project'
import { UPDATE_PROJECT } from '../../graphql/mutations/project'
import { SafeImage, UploadImage } from '../../storybook/stories/Image'
import { Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { SecondaryButton, FlexibleButton, PrimaryButton } from '../../storybook/stories/Button'
import { spacingUnit, wait } from '../../utils/common'
import { WONDER_BASE_URL } from '../../constants/'
import { ProfileContext } from '../../utils/contexts'
import {
  ProfilePlaceholder,
  ProjectInfoText,
  SectionsHeader,
  SetUpFlowProgress,
  DetermineUserProgress,
  renderProfileItem
} from './common'

function ProjectProfile({
  navigation,
  route
}: StackScreenProps<ProfileTabParamList, 'ProjectProfile'>) {
  const user = useMe()
  const [section, setSection] = useState('feed')
  const [refreshing, setRefreshing] = useState(false)
  const [isVisible, setModalVisible] = useState(false)
  const [profilePicture, setProfilePicture] = useState('')
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
    noGoingBack
  } = route.params
  const [getProjectFeed, {
    loading: projectFeedLoading,
    data: projectFeedData,
    error: projectFeedError,
    refetch,
    fetchMore
  }] = useLazyQuery(GET_PROJECT_FEED, {
    fetchPolicy: 'network-only',
    variables: {
      projectId
    }
  })

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
    if (section === 'feed') {
      getProjectFeed()
    }
    setProfilePicture(project && project.profilePicture)
  }, [project])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    if (feedSelected) {
      getProjectFeed()
    } else if (actionSelected) {

    } else if (asksSelected) {

    }
    wait(2000).then(() => setRefreshing(false))
  }, [])

  const getCorrectData = section => {
    if (section === 'feed') {
      return projectFeedData && projectFeedData.getProjectFeed
    } else if (section === 'action') {
      if (!(user && user.usageProgress && user.usageProgress.workflowCompleted)) {
        return ['start']
      }
    }
  }

  const profileData = getCorrectData(section)

  return (
    <SafeAreaView style={{
      backgroundColor: White,
      flex: 1
    }}
    >
      <Header noGoingBack={noGoingBack} share={`${WONDER_BASE_URL}/project/${projectId}`} />
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
          getProjectFeed,
          setModalVisible
        }}>
          {
            projectOwnedByUser &&
            <UploadImage isVisible={isVisible} setModalVisible={setModalVisible} image={profilePicture} setImage={setProfilePicture} saveImageMutation={updateProject} imagePrefix={`project/${projectId}/`} saveImageMutationVariable={[{projectId, input: { profilePicture }}, ['input', 'profilePicture']]}  />
          }
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
                project.profilePicture ?
                <SafeImage style={profileStyles.profileImage} src={profilePicture|| project.profilePicture} />
                :
                <ProfilePlaceholder projectOwnedByUser={projectOwnedByUser} />
              }
              <ProjectInfoText count={project.followCount} type={project.followCount === 1 ? 'follower' : 'followers'} />
              <ProjectInfoText count={project.collaborators.length} type={project.collaborators.length === 1 ? 'collaborator': 'collaborators'} />
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
                projectOwnedByUser &&
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
                {project.description}
              </Paragraph>
            </View>
            <DetermineUserProgress user={user} projectId={projectId} />

              <SectionsHeader />
          </View>
        )}
        data={profileData}
        renderItem={({ item }) => renderProfileItem({ item, section, user, navigation, projectId })}
        >

        </FlatList>
        </ProfileContext.Provider>
      }
    </SafeAreaView>
  )
}

export default withAuth(ProjectProfile)