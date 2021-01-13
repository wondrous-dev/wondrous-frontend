
import React, { useState, createContext, useCallback, useEffect } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { Dimensions, Image, Pressable, SafeAreaView, StyleSheet, View, RefreshControl, FlatList } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import { Bar } from 'react-native-progress'
import { useNavigation } from '@react-navigation/native'

import { withAuth, useMe } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { Black, Blue400, Blue500, Grey200, Grey300, Grey350, Red400, White } from '../../constants/Colors'
import Plus from '../../assets/images/plus'
import { profileStyles } from './style'
import { GET_PROJECT_BY_ID, GET_PROJECT_FEED } from '../../graphql/queries/project'
import { UPDATE_PROJECT } from '../../graphql/mutations/project'
import ProfileDefaultImage from '../../assets/images/profile-placeholder'
import { SafeImage, UploadImage } from '../../storybook/stories/Image'
import { Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { SecondaryButton, FlexibleButton } from '../../storybook/stories/Button'
import { spacingUnit, wait } from '../../utils/common'
import { WONDER_BASE_URL } from '../../constants/'
import { ProfileContext } from '../../utils/contexts'
import { useProfile } from '../../utils/hooks'
import { ProjectFeed, renderItem } from '../../components/Feed'

const ProfilePlaceholder = ({ projectOwnedByUser }) => {
  const { setModalVisible } = useProfile()
  if (projectOwnedByUser) {
    return (
    <Pressable onPress={() => setModalVisible(true)}>
      <View style={
          profileStyles.profilePlaceholderContainer
        }>
        <Plus />
      </View>
      </Pressable>
    )
  }
  return <ProfileDefaultImage style={profileStyles.profilePlaceholderImage} />
}

const ProjectInfoText = ({ count, type }) => {
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <RegularText style={{
        fontFamily: 'Rubik SemiBold',
      }} color={Grey200}>
        {count}
      </RegularText>
      <RegularText color={Grey200}>
        {type}
      </RegularText>
    </View>
  )
}

const Sections = () => {
  const { section } = useProfile()
  const feedSelected = section === 'feed'
  const actionSelected = section === 'action'
  const asksSelected = section === 'asks'
  if (feedSelected) {
    return <ProjectFeed />
  }
}
const SectionsHeader = () => {
  const { section, setSection } = useProfile()
  const feedSelected = section === 'feed'
  const actionSelected = section === 'action'
  const asksSelected = section === 'asks'

  return (
    <View style={profileStyles.sectionChoiceContainer}>
      <Pressable onPress={() => setSection('feed')}>
        <View style={{
          ...(feedSelected && {
            borderBottomColor: Blue400,
            borderBottomWidth: 1
          }),
          paddingBottom: spacingUnit,
          width: spacingUnit * 12,
          alignItems: 'center'
        }}>
          <Paragraph color={feedSelected ? Blue400 : Black }>
            Feed
          </Paragraph>
        </View>
      </Pressable>
      <Pressable onPress={() => setSection('action')}>
        <View style={{
          ...(actionSelected && {
            borderBottomColor: Blue400,
            borderBottomWidth: 1
          }),
          paddingBottom: spacingUnit,
          width: spacingUnit * 12,
          alignItems: 'center'
        }}>
          <Paragraph color={actionSelected ? Blue400 : Black }>
            Action
          </Paragraph>
        </View>
      </Pressable>
      <Pressable onPress={() => setSection('asks')}>
        <View style={{
          ...(asksSelected && {
            borderBottomColor: Blue400,
            borderBottomWidth: 1,
          }),
          paddingBottom: spacingUnit,
          alignItems: 'center',
          width: spacingUnit * 12
        }}>
          <Paragraph color={asksSelected ? Blue400 : Black }>
            Asks
          </Paragraph>
        </View>
      </Pressable>
    </View>
  )
}

const SetUpFlowProgress = ({ progress, navigationUrl,navigationParams, setupText, setupButtonText, color }) => {
  const navigation = useNavigation()

  return (
    <View style={{
      marginTop: spacingUnit * 2
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: spacingUnit * 2,
        paddingRight: spacingUnit * 2,
        marginBottom: spacingUnit * 0.25
      }}>
      <Paragraph color={color}>
        {progress * 100}%
      </Paragraph>
      <Bar progress={progress} width={Dimensions.get('window').width - (spacingUnit * 9)} color={color} height={spacingUnit * 1.25} unfilledColor={Grey350} borderWidth={0} />
      </View>
      <View style={{
        flexDirection: 'row',
        paddingLeft: spacingUnit * 2,
        paddingRight: spacingUnit * 2,
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Paragraph>
          Next step:<Paragraph color={Blue400}>{setupText}</Paragraph>
        </Paragraph>
        <FlexibleButton style={{
          paddingLeft: spacingUnit * 0.5,
          paddingRight: spacingUnit * 0.5,
          paddingTop: 2,
          paddingBottom: 2,
          backgroundColor: Blue400
        }} onPress={() => {
          navigation.navigate(navigationUrl, navigationParams)
        }}>
          <Paragraph color={White}>
            {setupButtonText}
          </Paragraph>
        </FlexibleButton>
      </View>
    </View>
  )
}

const DetermineUserProgress = ({ user }) => {
  if (user && user.usageProgress) {
    const usageProgress = user.usageProgress
    // Determine percentages. Start at 50 when workflow not finished. Then 80 once it is. Then invite friends. Then add link?
    if (usageProgress.signupCompleted && !usageProgress.workflowCompleted) {
      // 50%
      const setupText = 'Goals and tasks'
      const setupButtonText = 'Start Workflow'
      return <SetUpFlowProgress progress={0.5} navigationUrl={'WorkflowSetupWelcome'} navigationParams={{}} setupText={setupText} setupButtonText={setupButtonText} color={Red400} />
    }
    return null
  } else {
    return null
  }
}

function ProjectProfile({
  navigation,
  route
}: StackScreenProps<RootStackParamList, 'ProjectProfile'>) {
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
            // return updateProject
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
  }, [])

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
        <UploadImage isVisible={isVisible} setModalVisible={setModalVisible} image={profilePicture} setImage={setProfilePicture} saveImageMutation={updateProject} imagePrefix={`project/${projectId}/`} saveImageMutationVariable={[{projectId, input: { profilePicture }}, ['input', 'profilePicture']]}  />
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
            <DetermineUserProgress user={user} />

              <SectionsHeader />
          </View>
        )}
        data={profileData}
        renderItem={({ item }) => renderItem({ item, navigation, screen: 'Root', params: {
          screen: 'Profile',
          params: {
            screen: 'ProfileItem',
            params: {
              item,
              liked: false,
              comment: true,
              standAlone: true
            }
          }
        }   })}
        >

        </FlatList>
        </ProfileContext.Provider>
      }
    </SafeAreaView>
  )
}

export default withAuth(ProjectProfile)