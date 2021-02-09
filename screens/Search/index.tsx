import React, { useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { SafeAreaView, TextInput, View, TouchableWithoutFeedback, Keyboard, Image, Pressable, StyleSheet } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import SearchIcon from '../../assets/images/bottomNav/search'
import { withAuth } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { White, Grey100, Grey800, Grey300,Grey200, Black, Grey550, Grey500 } from '../../constants/Colors'
import { capitalizeFirstLetter, spacingUnit } from '../../utils/common'
import { useQuery } from '@apollo/client'
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
  return (
    <Pressable onPress={() => {
      if (project) {
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
          {user ? `${firstName} ${lastName}` : name}
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
    collaborators,
    followCount,
    category
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
          {name}
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
      <View style={searchStyles.tags}>
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
      </View>
      <View style={searchStyles.tags}>
        <RegularText color={Grey500} style={{
          fontFamily: 'Rubik SemiBold'
        }}>
        {capitalizeFirstLetter(category)}
        </RegularText>
      </View>
    </View>
    </Pressable>
  )
}

function DefaultSearch({
  navigation
}: StackScreenProps<RootStackParamList, 'DefaultSearch'>) {
  const [searchString, setSearchString] = useState('')
  const { data: searchDataResp, loading: searchDataLoading, error: searchDataError} = useQuery(GET_USERS_AND_PROJECTS, {
    variables: {
      searchString
    }
  })
  const {
    data: newestProjectDataResp,
    loading: newestProjectLoading,
    error: newestProjectError
  } = useQuery(GET_NEWEST_PROJECTS)

  const searchData = searchDataResp && searchDataResp.getUsersAndProjects
  const newestProjectData = newestProjectDataResp && newestProjectDataResp.getNewestProjects
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <SafeAreaView style={{
      backgroundColor: White,
      flex: 1
    }}>
      <Header search={true} searchString={searchString} setSearchString={setSearchString} />
      {
        searchString && searchData && searchData.projects && searchData.users
        ?
        <>
        {
          searchData.projects.length > 0 || searchData.users.length > 0 ?
          <View style={{
            marginTop: spacingUnit * 2,
          }}>
            {
              searchData.users.length > 0 && 
              <Paragraph color={Grey800} style={{
                paddingLeft: spacingUnit * 2,
                paddingRight: spacingUnit * 2,
                marginBottom: spacingUnit
              }}>
                              Users
            </Paragraph>
            }
            {searchData.users.slice(0, 6).map(userResult => {
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
          </View>
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
        <View style={{
          marginTop: spacingUnit * 2
        }}>
          <Subheading color={Grey800} style={{
            paddingLeft: spacingUnit * 2,
            marginBottom: spacingUnit * 3
          }}>
            Newest Projects
          </Subheading>
          {
            newestProjectData && newestProjectData.map(project => (
              <ProjectDisplay item={project} key={project.id} />
            ))
          }
        </View>
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
    }} />
    <Stack.Screen name='ProjectProfile' component={ProjectProfile} options={{ gestureEnabled: false }}initialParams={{
      tab: 'Search'
    }} />
    <Stack.Screen name='ProfileItem' component={FeedItem} initialParams={{
      tab: 'Search'
    }}/>
    <Stack.Screen name='WorkflowWelcome' component={WorkflowWelcome} initialParams={{
      tab: 'Search'
    }} />
    <Stack.Screen name='SetupGoal' component={SetupGoal} options={{ gestureEnabled: false }} initialParams={{
      tab: 'Search'
    }}/>
    <Stack.Screen name='SetupTask' component={SetupTask} options={{ gestureEnabled: false }} initialParams={{
      tab: 'Search'
    }} />
    <Stack.Screen name='StreakIntro' component={StreakIntro} initialParams={{
      tab: 'Search'
    }} />
    <Stack.Screen name='SetupAsk' component={SetupAsk} options={{gestureEnabled: false}} initialParams={{
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
    <Stack.Screen name='GoalPage' component={GoalPage} options={{ gestureEnabled: false }} initialParams={{
      tab: 'Search'
    }} />
    <Stack.Screen name='TaskPage' component={TaskPage} options={{ gestureEnabled: false }} initialParams={{
      tab: 'Search'
    }} />
    <Stack.Screen name='ActionList' component={ActionList} options={{ gestureEnabled: false }} initialParams={{
      tab: 'Search'
    }}/>
    <Stack.Screen name='AskPage' component={AskPage} options={{ gestureEnabled: false }} initialParams={{
      tab: 'Search'
    }}/>
  </Stack.Navigator>
  )
}
export default withAuth(SearchScreen)