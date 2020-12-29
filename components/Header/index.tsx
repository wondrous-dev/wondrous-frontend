import React from 'react'
import { SafeAreaView, View, Pressable } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'

import { Orange, Grey300 } from '../../constants/Colors'
import { Title } from '../../storybook/stories/Text'
import BackCaret from '../../assets/images/back-caret'

const shouldbackPageRoutes = {
  'Dashboard': true,
  'Search': true,
  'Notifications': true,
  'Welcome': true,
  'Profile': true,
  'Feed': true
}

const shouldBackPage = (route) => {
  if (route.name && (route.name in shouldbackPageRoutes )) {
    return false
  }
  return true
}

export const Header = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const backPage = shouldBackPage(route)

  return (
    <SafeAreaView style={{
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      height: 64,
      borderBottomWidth: 1,
      borderBottomColor: Grey300
    }}>
      <Pressable onPress={() => {
        navigation.goBack()
      }} style={{
        width: 50,
        marginRight: -50
      }}>
      {
        backPage &&
        <BackCaret />
      }
      </Pressable>
      <Title style={{
        color: Orange
      }}>
        W
      </Title>
      <View />
    </SafeAreaView>
  )
}
