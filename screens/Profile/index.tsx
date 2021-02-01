import * as React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { createStackNavigator } from '@react-navigation/stack'

import { withAuth } from '../../components/withAuth'
import { BottomTabParamList } from '../../types'
import UserProfile from './UserProfile'
import ProjectList from './ProjectList'
import ProjectProfile from './ProjectProfile'
import WorkflowWelcome from '../Workflow/Welcome'
import SetupGoal from '../Workflow/SetupGoal'
import SetupTask from '../Workflow/SetupTask'
import SetupAsk from '../Workflow/SetupAsk'
import StreakIntro from '../Workflow/StreakIntro'
import Links from './Links'
import UserList from './UserList'
import ProjectSetupCategory from '../SignupFlow/ProjectSetupCategory'
import ProjectTagSelectionScreen from '../SignupFlow/ProjectTagSelectionScreen'
import FeedItem from '../FeedItem'
import GoalPage from '../Actions/Goal'
import TaskPage from '../Actions/Task'

const Stack = createStackNavigator<BottomTabParamList>()

function ProfileScreen({
  navigation
}: StackScreenProps<BottomTabParamList, 'Profile'>) {
  return (
    <Stack.Navigator screenOptions={{ 
      headerShown: false,
      gestureResponseDistance: { vertical: 200, horizontal: 250 }
    }}>
      <Stack.Screen name='UserProfile' component={UserProfile} initialParams={{
        noGoingBack: true
      }} />
      <Stack.Screen name='OtherUserProfile' component={UserProfile} />
      <Stack.Screen name='ProjectProfile' component={ProjectProfile} />
      <Stack.Screen name='ProfileItem' component={FeedItem} />
      <Stack.Screen name='WorkflowWelcome' component={WorkflowWelcome} />
      <Stack.Screen name='SetupGoal' component={SetupGoal} options={{ gestureEnabled: false }} />
      <Stack.Screen name='SetupTask' component={SetupTask} options={{ gestureEnabled: false }} />
      <Stack.Screen name='StreakIntro' component={StreakIntro} />
      <Stack.Screen name='SetupAsk' component={SetupAsk} options={{gestureEnabled: false}} />
      <Stack.Screen name='ProjectList' component={ProjectList} />
      <Stack.Screen name='UserList' component={UserList} />
      <Stack.Screen name='EditProjectCategory' component={ProjectSetupCategory} />
      <Stack.Screen name='EditProjectTags' component={ProjectTagSelectionScreen} />
      <Stack.Screen name='Links' component={Links} />
      <Stack.Screen name='GoalPage' component={GoalPage} options={{ gestureEnabled: false }}/>
      <Stack.Screen name='TaskPage' component={TaskPage} options={{ gestureEnabled: false }}/>
    </Stack.Navigator>
  )
}

export default withAuth(ProfileScreen)