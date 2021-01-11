import React, { useState } from 'react'
import { SafeAreaView, View, Pressable, Dimensions, Share } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
// import * as Sharing from 'expo-sharing'

import { Orange, Grey300, Grey250 } from '../../constants/Colors'
import { Title, RegularText } from '../../storybook/stories/Text'
import BackCaret from '../../assets/images/back-caret'
import { spacingUnit } from '../../utils/common'
import { ShareModal } from '../Feed'

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

export const Header = ({ skip, skipParams, noGoingBack, share }) => {
  const route = useRoute()
  const navigation = useNavigation()
  const backPage = noGoingBack ? false : shouldBackPage(route)
  const [modalVisible, setModalVisible] = useState(false)

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
      {
        !backPage && share &&
        <View />
      }
      <Title style={{
        color: Orange,
        // flex: 2
      }}>
        W
      </Title>
      {
        skip ?
        <Pressable onPress={() => {
          navigation.navigate(skip, {
            ...(skipParams && {
              skipParams
            })
          })
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
      {
        share &&
        <>
        <ShareModal isVisible={modalVisible} url={share} content='' setModalVisible={setModalVisible} />
        <Pressable onPress={() => {
          setModalVisible(true)
        }} style={{
          marginRight: spacingUnit * 2,
          marginLeft: -spacingUnit * 2
        }}>
          <RegularText color={Grey250}>
            Share
          </RegularText>
        </Pressable>
        </>
      }
    </SafeAreaView>
  )
}
