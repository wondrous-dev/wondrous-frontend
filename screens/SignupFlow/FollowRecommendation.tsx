import React, { createContext, useContext, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { ScrollView, StyleSheet, View, TouchableOpacity, Text, Image, SafeAreaView, Dimensions, Pressable, TextInput } from 'react-native'
import ProgressCircle from 'react-native-progress-circle'
import { White, Black } from '../../constants/Colors'
import { Subheading, Paragraph, ButtonText, ErrorText } from '../../storybook/stories/Text'
import { Header } from '../../components/Header'

const FollowRecommendation = ({ }) => {
  return (
    <SafeAreaView style={{
      backgroundColor: White,
      flex: 1
    }}>
    <Header />
    <Subheading color={Black} style={{
        fontSize: 36
      }}>
        Follow builders
      </Subheading>
    </SafeAreaView>
  )
}

export default FollowRecommendation
