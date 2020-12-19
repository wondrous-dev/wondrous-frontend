import * as React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, SafeAreaView, Platform } from 'react-native'

import { RootStackParamList } from '../types'
import { Orange, Black, White } from '../constants/Colors'
import { Title, Subheading, Paragraph, ButtonText } from '../storybook/stories/Text'
import { SvgImage } from '../storybook/stories/Image'
import { MyCarousel } from '../storybook/stories/Carousel'
import { PrimaryButton, SecondaryButton } from '../storybook/stories/Button'
import { NotificationTester } from '../components/Notifications/RegisterNotification'
import { scale, moderateScale, verticalScale } from '../utils/scale'
import SuperHeroSvg from '../assets/images/superhero.svg'

export default function HomeScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'Home'>) {
  const homeScreens = [
    {
      subheading: 'Finish Your dream projects',
      paragraph: 'Wonder helps you manage multiple projects and keeps you socially accountable for them.'
    },
    {
      subheading: 'Build a community around your work',
      paragraph: 'Wonder helps you build a following from day one. Get feedback and help from people interested in your projects. '
    },
    {
      subheading: 'Share and measure your progress',
      paragraph: `Wonder tracks your milestones and goals so you can be proud of what you've achieved. You can then share this with the world!`
    }
  ]
  return (
    <SafeAreaView style={styles.container}>
      <Title>
        Wonder
      </Title>
      <SvgImage width="196" height="200" style={styles.logo} srcElement={SuperHeroSvg} />
      <MyCarousel data={homeScreens} />
      <PrimaryButton onPress={() => navigation.navigate('Signup')} textStyle={{
        color: White
      }} textPressStyle = {{
        color: White
      }}>
          <ButtonText color={White}>
          Get started
          </ButtonText>
      </PrimaryButton>
      <SecondaryButton onPress={() => navigation.navigate('Signup')} style={{
        marginTop: 8
      }}>
        <ButtonText color={Black}>
          Log in
        </ButtonText>
      </SecondaryButton>
      {/* <NotificationTester /> */}
    </SafeAreaView>
  )
}


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Orange,
    alignItems: 'center',
    paddingTop: 8
  },
  logo: {
    marginTop: moderateScale(48),
    width: 196,
    height: 220
  },
  subheading: {
    marginTop: moderateScale(24),
    fontWeight: 'bold'
  },
  paragraph: {
    marginTop: 16,
    textAlign: 'center'
  }
})