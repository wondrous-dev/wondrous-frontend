import React from 'react'
import { SafeAreaView, View, Pressable, Dimensions } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'

import { Orange, Grey300, Grey250 } from '../../constants/Colors'
import { Title, RegularText } from '../../storybook/stories/Text'
import BackCaret from '../../assets/images/back-caret'
import { spacingUnit } from '../../utils/common'

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

export const Header = ({ skip }) => {
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
      borderBottomColor: Grey300,
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
        color: Orange,
        // flex: 2
      }}>
        W
      </Title>
      {
        skip ?
        <Pressable onPress={() => {
          navigation.navigate(skip)
        }} style={{
          marginRight: spacingUnit * 2,
          marginLeft: -spacingUnit * 2
        }}>
          <RegularText color={Grey250}>
            Skip
          </RegularText>
        </Pressable>
        :
        <View />
      }
    </SafeAreaView>
  )
}
