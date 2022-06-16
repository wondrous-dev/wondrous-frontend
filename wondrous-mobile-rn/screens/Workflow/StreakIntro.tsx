import React from 'react'
import { SafeAreaView, View, StyleSheet } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import ConfettiCannon from 'react-native-confetti-cannon'

import { Paragraph, Subheading } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import { ProfileTabParamList } from '../../types'
import { Header } from '../../components/Header'
import palette from 'theme/palette'
import { spacingUnit } from '../../utils/common'
import Celebration from '../../assets/images/celebrations/signupConfetti'
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
      backgroundColor: palette.white
    }}>
      <Header />
      <ConfettiCannon count={200} origin={{x: -10, y: 0}} />
      <View style={{
        alignItems: 'center',
        marginTop: spacingUnit * 10
      }}>
        <Celebration style={{
          width: 80,
          height: 80,
          ...streakIntroStyles.image
        }} />
        <Subheading color={palette.blue400} style={{
          marginTop: spacingUnit * 3,
        }}>
          1 day Streak!
        </Subheading>
        <Paragraph color={palette.black} style={{
          textAlign: 'center',
          paddingLeft: spacingUnit * 2,
          paddingRight: spacingUnit * 2,
          marginTop: spacingUnit * 1.5,
          marginBottom: spacingUnit * 4
        }}>
          Every day you create or complete a goal/task/ask, your streak increases.
        </Paragraph>
        <PrimaryButton style={{
          backgroundColor: palette.green400
        }} onPress={() => navigation.navigate('Root', {
          screen: 'Profile',
          params: {
            screen: 'UserProfile'
          }
        })}>
          <Paragraph color={palette.white} style={{
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
