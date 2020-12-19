import React from 'react'
import { SafeAreaView, View } from 'react-native'

import { Orange, Grey300 } from '../../constants/Colors'
import { Title } from '../../storybook/stories/Text'


export const Header = () => {
  return (
    <SafeAreaView style={{
      width: '100%',
      alignItems: 'center',
      height: 64,
      borderBottomWidth: 1,
      borderBottomColor: Grey300
    }}>
      <Title style={{
        color: Orange
      }}>
        W
      </Title>
    </SafeAreaView>
  )
}
