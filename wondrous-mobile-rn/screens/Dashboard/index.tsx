import * as React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { createStackNavigator } from '@react-navigation/stack'

import { withAuth } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import Feed from './feed'
import FeedItem from '../FeedItem'
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
import GoalPage from '../Actions/Goal'
import TaskPage from '../Actions/Task'
import AskPage from '../Actions/Ask'
import ActionList from '../Actions/ActionList'
import IdChecker from '../Profile/IdChecker'
import ReviewPage from '../Review/ReviewPage'
import ProjectDiscussionItem from '../Profile/ProjectDiscussionItem'
import RingActions from '../Profile/RingActions'

const Stack = createStackNavigator<RootStackParamList>()

function DashboardScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'Dashboard'>) {

  return (
    <Stack.Navigator screenOptions={{ 
      headerShown: false,
      gestureResponseDistance: { vertical: 200, horizontal: 250 }
    }}>
      <Stack.Screen name='Feed' component={Feed} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='FeedItem' component={FeedItem} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='OtherUserProfile' component={UserProfile} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='UserProfile' component={UserProfile} initialParams={{ tab: 'Dashboard' }} options={{ gestureEnabled: false }} />
      <Stack.Screen name='ProjectProfile' component={ProjectProfile} options={{ gestureEnabled: false }} initialParams={{ tab: 'Dashboard' }}/>
      <Stack.Screen name='ProfileItem' component={FeedItem} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='ProjectDiscussionItem' component={ProjectDiscussionItem} initialParams={{
      tab: 'Dashboard'
      }} />
      <Stack.Screen name='WorkflowWelcome' component={WorkflowWelcome} />
      <Stack.Screen name='SetupGoal' component={SetupGoal} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='SetupTask' component={SetupTask} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='StreakIntro' component={StreakIntro} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='SetupAsk' component={SetupAsk} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='ProjectList' component={ProjectList} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='UserList' component={UserList} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='EditProjectCategory' component={ProjectSetupCategory} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='EditProjectTags' component={ProjectTagSelectionScreen} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='Links' component={Links} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='GoalPage' component={GoalPage} initialParams={{ tab: 'Dashboard' }}/>
      <Stack.Screen name='TaskPage' component={TaskPage} initialParams={{ tab: 'Dashboard' }}/>
      <Stack.Screen name='ActionList' component={ActionList} options={{ gestureEnabled: false }} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='AskPage' component={AskPage} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='IdChecker' component={IdChecker}  initialParams={{
        tab: 'Dashboard'
      }} /> 
      <Stack.Screen name='ReviewPage' component={ReviewPage} initialParams={{
        tab: 'Dashboard'
      }} />
      <Stack.Screen name='RingActions' component={RingActions} initialParams={{
        tab: 'Dashboard'
      }} options={{ gestureEnabled: false }} />
    {/* <BottomTabNavigator /> */}
    </Stack.Navigator>
  )
}

export default withAuth(DashboardScreen)