import { Ionicons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'

import Colors, { Blue500, Grey50 } from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import Dashboard from '../screens/Dashboard'
import Search from '../screens/Search'
import Notifications from '../screens/Notifications'
import Profile from '../screens/Profile'
import DashboardIcon from '../assets/images/bottomNav/dashboard'
import SearchIcon from '../assets/images/bottomNav/search'
import NotificationIcon from '../assets/images/bottomNav/notification'
import ProfileIcon from '../assets/images/bottomNav/profile'
import TabOneScreen from '../screens/TabOneScreen'
import TabTwoScreen from '../screens/TabTwoScreen'
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from '../types'

const BottomTab = createBottomTabNavigator<BottomTabParamList>()

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme()
  return (
    <BottomTab.Navigator
      showLabel={false}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName
          if (route.name === 'Dashboard') {
            return <DashboardIcon iconColor={focused ? Blue500 : Grey50} />
          } else if (route.name === 'Search') {
            return <SearchIcon iconColor={focused ? Blue500 : Grey50} />
           } else if (route.name === 'Notifications') {
             return <NotificationIcon iconColor={focused ? Blue500 : Grey50} />
           } else if (route.name === 'Profile') {
             return <ProfileIcon iconColor={focused ? Blue500 : Grey50} />
           }
        }
      })}
      tabBarOptions={{
        showLabel: false
      }}
      >
      <BottomTab.Screen
        name='Dashboard'
        component={Dashboard}
      />
      <BottomTab.Screen
        name='Search'
        component={Search}
      />
      <BottomTab.Screen
        name='Notifications'
        component={Notifications}
      />
      <BottomTab.Screen
        name='Profile'
        component={Profile}
      />
    </BottomTab.Navigator>
  )
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>()

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name='TabOneScreen'
        component={TabOneScreen}
        options={{ headerTitle: 'Tab One Title' }}
      />
    </TabOneStack.Navigator>
  )
}

const TabTwoStack = createStackNavigator<TabTwoParamList>()

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name='TabTwoScreen'
        component={TabTwoScreen}
        options={{ headerTitle: 'Tab Two Title' }}
      />
    </TabTwoStack.Navigator>
  )
}
