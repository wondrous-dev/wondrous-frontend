import React, { useRef, useState } from 'react'
import { SafeAreaView, View, StyleSheet, Pressable, Dimensions, FlatList } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import ConfettiCannon from 'react-native-confetti-cannon'

import { Paragraph, Subheading } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import { ProfileTabParamList } from '../../types'
import { withAuth, useMe } from '../../components/withAuth'
import { Header } from '../../components/Header'
import { Grey400, White, Black, Grey500, Blue500, Blue400, Green400 } from '../../constants/Colors'
import { spacingUnit, getLocale } from '../../utils/common'
import AddIcon from '../../assets/images/add-dark-button.svg'
import { SvgImage } from '../../storybook/stories/Image'
import Celebration from '../../assets/images/celebrations/signupConfetti.svg'
const streakIntroStyles = StyleSheet.create({
  image: {
    alignSelf: 'center',
  }
})
function StreakIntro({
  navigation,
  route
}: StackScreenProps<ProfileTabParamList, 'SetupTask'>) {
  const {
    projectId
  } = route.params

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <Header />
      <ConfettiCannon count={200} origin={{x: -10, y: 0}} />
      <View style={{
        alignItems: 'center',
        marginTop: spacingUnit * 10
      }}>
        <SvgImage width="80" height="80" srcElement={Celebration} style={streakIntroStyles.image} />
        <Subheading color={Blue400} style={{
          marginTop: spacingUnit * 3,
        }}>
          1 day Streak!
        </Subheading>
        <Paragraph color={Black} style={{
          textAlign: 'center',
          paddingLeft: spacingUnit * 2,
          paddingRight: spacingUnit * 2,
          marginTop: spacingUnit * 1.5,
          marginBottom: spacingUnit * 4
        }}>
          Every day you create or complete a goal/task/ask, your streak increases.
        </Paragraph>
        <PrimaryButton style={{
          backgroundColor: Green400
        }} onPress={() => navigation.navigate('Root', {
          screen: 'Profile',
          params: {
            screen: 'UserProfile'
          }
        })}>
          <Paragraph color={White} style={{
            fontFamily: 'Rubik SemiBold'
          }}>
            Finish
          </Paragraph>
        </PrimaryButton>
      </View>
    </SafeAreaView>
  )
}

export default StreakIntro
