import * as React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { SafeAreaView } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import { withAuth } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { HomeFeed } from '../../components/Feed'
import { White } from '../../constants/Colors'
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
      <Stack.Screen name='UserProfile' component={UserProfile} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='ProjectProfile' component={ProjectProfile} options={{ gestureEnabled: false }} initialParams={{ tab: 'Dashboard' }}/>
      <Stack.Screen name='ProfileItem' component={FeedItem} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='WorkflowWelcome' component={WorkflowWelcome} />
      <Stack.Screen name='SetupGoal' component={SetupGoal} options={{ gestureEnabled: false }} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='SetupTask' component={SetupTask} options={{ gestureEnabled: false }} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='StreakIntro' component={StreakIntro} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='SetupAsk' component={SetupAsk} options={{gestureEnabled: false}} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='ProjectList' component={ProjectList} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='UserList' component={UserList} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='EditProjectCategory' component={ProjectSetupCategory} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='EditProjectTags' component={ProjectTagSelectionScreen} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='Links' component={Links} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='GoalPage' component={GoalPage} options={{ gestureEnabled: false }} initialParams={{ tab: 'Dashboard' }}/>
      <Stack.Screen name='TaskPage' component={TaskPage} options={{ gestureEnabled: false }} initialParams={{ tab: 'Dashboard' }}/>
      <Stack.Screen name='ActionList' component={ActionList} options={{ gestureEnabled: false }} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='AskPage' component={AskPage} options={{ gestureEnabled: false }} initialParams={{ tab: 'Dashboard' }} />
      <Stack.Screen name='IdChecker' component={IdChecker}  initialParams={{
        tab: 'Dashboard'
      }} /> 
      <Stack.Screen name='ReviewPage' component={ReviewPage} initialParams={{
        tab: 'Dashboard'
      }} />
    {/* <BottomTabNavigator /> */}
    </Stack.Navigator>
  )
}

export default withAuth(DashboardScreen)