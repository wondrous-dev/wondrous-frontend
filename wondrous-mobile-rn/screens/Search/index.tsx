import React, { useState, useEffect, useCallback } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { SafeAreaView, ScrollView, FlatList, View, TouchableWithoutFeedback, Keyboard, Image, Pressable, StyleSheet, RefreshControl } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import SearchIcon from '../../assets/images/bottomNav/search'
import { useMe, withAuth } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { White, Grey100, Grey800, Grey300,Grey200, Black, Grey550, Grey500 } from '../../constants/Colors'
import { capitalizeFirstLetter, spacingUnit, wait } from '../../utils/common'
import { useMutation, useQuery } from '@apollo/client'
import { GET_USERS_AND_PROJECTS } from '../../graphql/queries/search'
import { Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { SafeImage } from '../../storybook/stories/Image'
import DefaultProfilePicture from '../../assets/images/default-profile-picture.jpg'
import { useNavigation } from '@react-navigation/native'
import { GET_NEWEST_PROJECTS } from '../../graphql/queries'
import UserProfile from '../Profile/UserProfile'
import ProjectProfile from '../Profile/ProjectProfile'
import ProjectList from '../Profile/ProjectList'
import WorkflowWelcome from '../Workflow/Welcome'
import SetupGoal from '../Workflow/SetupGoal'
import SetupTask from '../Workflow/SetupTask'
import SetupAsk from '../Workflow/SetupAsk'
import StreakIntro from '../Workflow/StreakIntro'
import Links from '../Profile/Links'
import UserList from '../Profile/UserList'
import ProjectSetupCategory from '../SignupFlow/ProjectSetupCategory'
import ProjectTagSelectionScreen from '../SignupFlow/ProjectTagSelectionScreen'
import FeedItem from '../FeedItem'
import GoalPage from '../Actions/Goal'
import TaskPage from '../Actions/Task'
import AskPage from '../Actions/Ask'
import ActionList from '../Actions/ActionList'
import IdChecker from '../Profile/IdChecker'
import ReviewPage from '../Review/ReviewPage'
import { projectTagHash } from '../../constants/projectTag'
import ProjectDiscussionItem from '../Profile/ProjectDiscussionItem'
import { CLICK_PROJECT_SEARCH, CLICK_USER_SEARCH } from '../../graphql/mutations/search'
import RingActions from '../Profile/RingActions'

const Stack = createStackNavigator()

const searchStyles = StyleSheet.create({
  tags: {
    borderWidth: 1,
    borderColor: Grey300,
    padding: spacingUnit * 0.5,
    paddingLeft: spacingUnit,
    paddingRight: spacingUnit,
    borderRadius: 4,
    marginRight: spacingUnit
  }
})

const SearchResult = ({ result, project, user }) => {
  const navigation = useNavigation()
  const {
    profilePicture,
    firstName,
    lastName,
    username,
    name,
    description,
    id
  } = result
  const [clickUserSearch] = useMutation(CLICK_USER_SEARCH)
  const [clickProjectSearch] = useMutation(CLICK_PROJECT_SEARCH)

  return (
    <Pressable onPress={async () => {
      if (project) {
        await clickProjectSearch({
          variables: {
            searchedProjectId: id,
            projectName: name
          }
        })
        navigation.navigate('Root', {
          screen: 'Search',
          params: {
            screen: 'ProjectProfile',
            params: {
              projectId: id
            }
          }
        })
      } else if (user) {
        try {
          await clickUserSearch({
            variables: {
              searchedUserId: id,
              firstName,
              lastName,
              username
            }
          })
        } catch (err) {
          console.log('error searching', err)
        }
        navigation.navigate('Root', {
          screen: 'Search',
          params: {
            screen: 'UserProfile',
            params: {
              userId: id
            }
          }
        })
      }
    }} style={{
      flexDirection: 'row',
      borderBottomColor: Grey300,
      borderBottomWidth: 1,
      paddingLeft: spacingUnit * 2,
      paddingRight: spacingUnit * 2,
      paddingTop: spacingUnit * 1.5,
      paddingBottom: spacingUnit * 1.5
    }}>
      {
          profilePicture && profilePicture !== 'None' ?
          <SafeImage
          src={profilePicture} style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            marginRight: 8
          }} />
          :
          <Image source={DefaultProfilePicture} style={{
            marginRight: 8,
            width: 30,
            height: 30,
            borderRadius: 15
          }} />
                    
      }
      <View style={{
        flex: 1
      }}>
        <Paragraph style={{color: Black, fontWeight: 'bold', fontFamily: 'Rubik SemiBold'}}>
          {user ? `${firstName || ''} ${lastName || ''}` : name}
        </Paragraph>
        {
          user &&
          <RegularText color={Grey200} style={{ fontSize: 14 }}>
            @{username}
          </RegularText>
        }
        {
          project &&
          <RegularText color={Black}>
            {description}
          </RegularText>
        }
      </View>
    </Pressable>
  )
}

const ProjectDisplay = ({ item }) => {
  const {
    profilePicture,
    name,
    description,
    id,
    // collaborators,
    // followCount,
    tags,
    category,
    creator
  } = item
  const navigation = useNavigation()
  return (
    <Pressable key={item.id} style={{
      paddingLeft: spacingUnit * 2,
      paddingRight: spacingUnit * 2,
      marginBottom: spacingUnit * 2.5
    }} onPress={() => navigation.navigate('Root', {
      screen: 'Search',
      params: {
        screen: 'ProjectProfile',
        params: {
          projectId: id,
          tab: 'Search'
        }
      }
    })}>
    <View style={{
      flexDirection: 'row',
    }}>
      <SafeImage style={{
        width: spacingUnit * 7.5,
        height: spacingUnit * 7.5,
        borderRadius: spacingUnit * 0.5,
        marginRight: spacingUnit
      }} src={profilePicture} />
      <View style={{
        flex: 1
      }}>
        <Paragraph color={Black} style={{

          fontFamily: 'Rubik SemiBold'
        }}>
          {name.trim()} <Paragraph>
            created by
          </Paragraph> <Paragraph style={{
            fontFamily: 'Rubik SemiBold'
          }} onPress={() => navigation.navigate('Root', {
            screen: 'Search',
            params: {
              screen: 'UserProfile',
              params: {
                userId: creator?.id
              }
            }
          })}>
            {creator?.username}
          </Paragraph>
        </Paragraph>
        <Paragraph color={Black}>
          {description}
        </Paragraph>
      </View>
    </View>
    <View style={{
      flexDirection: 'row',
      marginTop: spacingUnit,
    }}>
      {/* <View style={searchStyles.tags}>
        <RegularText color={Grey500}>
          <RegularText style={{
          fontFamily: 'Rubik SemiBold'
        }}>
        {collaborators && collaborators.length ? collaborators.length : 0}{` `}
        </RegularText>
        {collaborators && collaborators.length === 1 ? 'collaborator' : 'collaborators'}
        </RegularText>
      </View>
      <View style={searchStyles.tags}>
        <RegularText color={Grey500}>
        <RegularText style={{
          fontFamily: 'Rubik SemiBold'
        }}>{followCount} </RegularText> {followCount === 1 ? 'follower' : 'followers'}
        </RegularText>
      </View> */}
      <View style={searchStyles.tags}>
        <RegularText color={Grey500} style={{
          fontFamily: 'Rubik SemiBold'
        }}>
        {capitalizeFirstLetter(category)}
        </RegularText>
      </View>
      {
        tags && tags.map(tag => (
          <View style={searchStyles.tags}>
          <RegularText color={Grey500} style={{
            fontFamily: 'Rubik SemiBold'
          }}>
          {capitalizeFirstLetter(projectTagHash[tag])}
          </RegularText>
        </View>
        ))
      }
    </View>
    </Pressable>
  )
}

function DefaultSearch({
  navigation
}: StackScreenProps<RootStackParamList, 'DefaultSearch'>) {
  const loggedInUser = useMe()
  const [searchString, setSearchString] = useState('')
  const { data: searchDataResp, loading: searchDataLoading, error: searchDataError} = useQuery(GET_USERS_AND_PROJECTS, {
    variables: {
      searchString
    },
    fetchPolicy: 'network-only'
  })
  const [newestProjects, setNewestProjects] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [focus, setFocus] = useState(false)
  const {
    data: newestProjectDataResp,
    loading: newestProjectLoading,
    error: newestProjectError,
    fetchMore,
    refetch
  } = useQuery(GET_NEWEST_PROJECTS, {
    fetchPolicy: 'network-only',
    variables: {
      limit: 15,
      offset: 0
    }
  })

  const searchData = searchDataResp && searchDataResp.getUsersAndProjects

  useEffect(() => {
    if (newestProjectDataResp) {
      setNewestProjects(newestProjectDataResp && newestProjectDataResp.getNewestProjects)
    }
  }, [newestProjectDataResp])
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    if (refetch) {
      refetch()
    }
    wait(2000).then(() => setRefreshing(false))
  }, [])
  const filteredUsers = searchData?.users?.filter(user => {
    return !(loggedInUser?.blockedUsers.includes(user.id) ||loggedInUser?.blockedByUsers.includes(user.id))
  })

  const newestProjectsKeyExtractor = useCallback((item) => item.id, []); 

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <SafeAreaView style={{
      backgroundColor: White,
      flex: 1
    }}>
      <Header search={true} searchString={searchString} setSearchString={setSearchString} setFocus={setFocus} />
      {
        focus && searchData && searchData.projects && filteredUsers
        ?
        <>
        {
          searchData.projects.length > 0 || filteredUsers.length > 0 ?
          <Pressable onPress={() => Keyboard.dismiss()}>
          <ScrollView style={{
            marginTop: spacingUnit * 2,
          }}>
            {
              filteredUsers.length > 0 && 
              <Paragraph color={Grey800} style={{
                paddingLeft: spacingUnit * 2,
                paddingRight: spacingUnit * 2,
                marginBottom: spacingUnit
              }}>
                              Users
            </Paragraph>
            }
            {filteredUsers.slice(0, 6).map(userResult => {
              return (
                <SearchResult user={true} result={userResult} key={userResult.id} />
              )
            })}
            {
              searchData.projects.length > 0 &&
              <Paragraph color={Grey800} style={{
                paddingLeft: spacingUnit * 2,
                paddingRight: spacingUnit * 2,
                marginBottom: spacingUnit,
                marginTop: spacingUnit * 2
              }}>
                Projects
              </Paragraph>
            }
            {
              searchData.projects.slice(0, 6).map(projectResult => {
                return (
                  <SearchResult project={true} result={projectResult} key={projectResult.id} />
                )
              })
            }
          </ScrollView>
          </Pressable>
          :
          <Paragraph color={Grey800} style={{
            paddingLeft: spacingUnit * 2,
            marginTop: spacingUnit * 2
          }}>
            No results found
          </Paragraph>
        }
        </>
        :
        <FlatList
        data={newestProjects}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={() => (
          <View style={{
            marginTop: spacingUnit * 2
          }}>
            <Subheading color={Grey800} style={{
              paddingLeft: spacingUnit * 2,
              marginBottom: spacingUnit * 3
            }}>
              Newest Projects
            </Subheading>
  
          </View>
        )}
        scrollEventThrottle={400}
        keyExtractor={newestProjectsKeyExtractor}
        onEndReached={async () => {
          if (fetchMore) {
            const result = await fetchMore({
              variables: {
                offset: newestProjects.length
              }
            })
            if (result && result.data && result.data.getNewestProjects) {
              setNewestProjects([...newestProjects, ...result.data.getNewestProjects])
            }
          }
        }}
        renderItem={({ item }) => {
          return (
            <ProjectDisplay item={item} key={item.id} />
          )
        }}
      />
      }
    </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}
function SearchScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'Search'>) {
  return (
  <Stack.Navigator screenOptions={{ 
    headerShown: false,
    gestureResponseDistance: { vertical: 200, horizontal: 250 },
  }}>
    <Stack.Screen name='Default' component={DefaultSearch} initialParams={{
      tab: 'Search'
    }} />
    <Stack.Screen name='UserProfile' component={UserProfile}initialParams={{
      tab: 'Search'
    }} options={{ gestureEnabled: false }} />
        <Stack.Screen name='OtherUserProfile' component={UserProfile}initialParams={{
      tab: 'Search'
    }} />
    <Stack.Screen name='ProjectProfile' component={ProjectProfile} options={{ gestureEnabled: false }} initialParams={{
      tab: 'Search'
    }} />
    <Stack.Screen name='ProjectDiscussionItem' component={ProjectDiscussionItem} initialParams={{
      tab: 'Search'
    }} />
    <Stack.Screen name='ProfileItem' component={FeedItem} initialParams={{
      tab: 'Search'
    }}/>
    <Stack.Screen name='WorkflowWelcome' component={WorkflowWelcome} initialParams={{
      tab: 'Search'
    }} />
    <Stack.Screen name='SetupGoal' component={SetupGoal} initialParams={{
      tab: 'Search'
    }}/>
    <Stack.Screen name='SetupTask' component={SetupTask} initialParams={{
      tab: 'Search'
    }} />
    <Stack.Screen name='StreakIntro' component={StreakIntro} initialParams={{
      tab: 'Search'
    }} />
    <Stack.Screen name='SetupAsk' component={SetupAsk} initialParams={{
      tab: 'Search'
    }} />
    <Stack.Screen name='ProjectList' component={ProjectList} initialParams={{
      tab: 'Search'
    }}/>
    <Stack.Screen name='UserList' component={UserList} initialParams={{
      tab: 'Search'
    }}/>
    <Stack.Screen name='EditProjectCategory' component={ProjectSetupCategory} initialParams={{
      tab: 'Search'
    }} />
    <Stack.Screen name='EditProjectTags' component={ProjectTagSelectionScreen} initialParams={{
      tab: 'Search'
    }} />
    <Stack.Screen name='Links' component={Links} initialParams={{
      tab: 'Search'
    }} />
    <Stack.Screen name='GoalPage' component={GoalPage} initialParams={{
      tab: 'Search'
    }} />
    <Stack.Screen name='TaskPage' component={TaskPage} initialParams={{
      tab: 'Search'
    }} />
    <Stack.Screen name='ActionList' component={ActionList} options={{ gestureEnabled: false }} initialParams={{
      tab: 'Search'
    }}/>
    <Stack.Screen name='AskPage' component={AskPage} initialParams={{
      tab: 'Search'
    }}/>
    <Stack.Screen name='IdChecker' component={IdChecker}  initialParams={{
        tab: 'Search'
      }} /> 
    <Stack.Screen name='ReviewPage' component={ReviewPage} initialParams={{
        tab: 'Search'
      }} />
    <Stack.Screen name='RingActions' component={RingActions} initialParams={{
        tab: 'Search'
      }} options={{ gestureEnabled: false }} />
  </Stack.Navigator>
  )
}
export default withAuth(SearchScreen)