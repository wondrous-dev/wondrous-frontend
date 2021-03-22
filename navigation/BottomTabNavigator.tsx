import { Ionicons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { useRoute, NavigationState, useNavigationState } from '@react-navigation/native'
import * as React from 'react'
import { SafeAreaView, View, Pressable, StyleSheet } from 'react-native'

import Colors, { Blue500, Blue400, Grey50, White, Grey400 } from '../constants/Colors'
import Dashboard from '../screens/Dashboard'
import Search from '../screens/Search'
import Add from '../screens/Add'
import Notifications from '../screens/Notifications'
import Profile from '../screens/Profile'
import DashboardIcon from '../assets/images/bottomNav/dashboard'
import SearchIcon from '../assets/images/bottomNav/search'
import NotificationIcon from '../assets/images/bottomNav/notification'
import ProfileIcon from '../assets/images/bottomNav/profile'
import TabOneScreen from '../screens/TabOneScreen'
import TabTwoScreen from '../screens/TabTwoScreen'
import AddIcon from '../assets/images/bottomNav/add'
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from '../types'
import { SvgImage } from '../storybook/stories/Image'
import { flattenParams, spacingUnit } from '../utils/common'
import { useQuery } from '@apollo/client'
import { GET_UNREAD_NOTIFICATION_COUNT } from '../graphql/queries'

const BottomTab = createBottomTabNavigator<BottomTabParamList>()

const getActiveRouteState = function (route: NavigationState): NavigationState {
  if (!route.routes || route.routes.length === 0 || route.index >= route.routes.length) {
      return route;
  }

  const childActiveRoute = route.routes[route.index] as NavigationState
  return getActiveRouteState(childActiveRoute);
}

const bottomTabStyles = StyleSheet.create({
  bottomTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: White,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: Grey400,
    padding: spacingUnit * 2,
    paddingLeft: spacingUnit * 3,
    paddingRight: spacingUnit * 3,
    paddingBottom: spacingUnit * 5
  }
})

const TabBarIcon = ({ route, focused, color, size }) => {
  let iconName
  if (route.name === 'Dashboard') {
    return <DashboardIcon iconColor={focused ? Blue400 : Grey50} />
  } else if (route.name === 'Search') {
    return <SearchIcon iconColor={focused ? Blue400 : Grey50} />
   } else if (route.name === 'Add') {
    return (
      <AddIcon
        style={{
          width: spacingUnit * 10,
          height: spacingUnit * 10,
          marginTop: spacingUnit * 2.25
        }}
      />
    )
   } else if (route.name === 'Notifications') {
     return <NotificationIcon iconColor={focused ? Blue400 : Grey50} />
   } else if (route.name === 'Profile') {
     return <ProfileIcon iconColor={focused ? Blue400 : Grey50} />
   }
}

const TabBar = ({ state, descriptors, navigation, params }) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={bottomTabStyles.bottomTabContainer}>
      {
        state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name
          const isFocused = state.index === index
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
  
            if (!isFocused && !event.defaultPrevented) {
              navigation.push(route.name)
            }
          }
          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          }

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              // style={{ flex: 1 }}
            >
              <TabBarIcon route={route} focused={isFocused} />
            </Pressable>
          )
        })
      }
    </View>
  )
}

export default function BottomTabNavigator() {
  const { data: unreadNotifCountData, loading, error} = useQuery(GET_UNREAD_NOTIFICATION_COUNT, {
    fetchPolicy: 'network-only'
  })
  const unreadNotifCount = unreadNotifCountData && unreadNotifCountData.getUnreadNotificationCount && unreadNotifCountData.getUnreadNotificationCount.count

  return (
    <BottomTab.Navigator
    // tabBar={props => <TabBar {...props} />}
    // lazy={false}
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName
        if (route.name === 'Dashboard') {
          return <DashboardIcon iconColor={focused ? Blue400 : Grey50} />
        } else if (route.name === 'Search') {
          return <SearchIcon iconColor={focused ? Blue400 : Grey50} />
          } else if (route.name === 'Add') {
          return ( <AddIcon
            style={{
              width: spacingUnit * 10,
              height: spacingUnit * 10,
              marginTop: spacingUnit * 2.25
            }}
          />)
          } else if (route.name === 'Notifications') {
            return <NotificationIcon iconColor={focused ? Blue400 : Grey50} />
          } else if (route.name === 'Profile') {
            return <ProfileIcon iconColor={focused ? Blue400 : Grey50} />
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
        initialParams={{
          screen: 'Feed'
        }}
      />
      <BottomTab.Screen
        name='Search'
        component={Search}
        initialParams={{
          screen: 'Default',
        }}
      />
      <BottomTab.Screen
        name='Add'
        component={Add}
      />
      <BottomTab.Screen
        name='Notifications'
        component={Notifications}
        initialParams={{
          screen: 'Default',
        }}
        options={{
          tabBarColor: '#009387',
          tabBarBadge: unreadNotifCount !== 0 ? unreadNotifCount : null,                          // This is for bar Badge

        }}
      />
      <BottomTab.Screen
        name='Profile'
        component={Profile}
        initialParams={{
          screen: 'UserProfile',
          loggedin: true,
          noGoingBack: true
        }}
      />
    </BottomTab.Navigator>
  )
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
// function TabBarIcon(props: { name: string; color: string }) {
//   return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />
// }

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
