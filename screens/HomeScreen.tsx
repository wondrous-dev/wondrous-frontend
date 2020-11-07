import * as React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, SafeAreaView } from 'react-native'
import { SvgXml } from "react-native-svg"

import { RootStackParamList } from '../types'
import { Orange, Black } from '../constants/Colors'
import { Title, Subheading, Paragraph, ButtonText } from '../storybook/stories/Text'
import { SvgImage } from '../storybook/stories/Image'
import { MyCarousel } from '../storybook/stories/Carousel'
import { PrimaryButton, SecondaryButton } from '../storybook/stories/Button'
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
    <View style={styles.container}>
      <Title>
        Wonder
      </Title>
      <SvgImage width="196" height="200" style={styles.logo} srcElement={SuperHeroSvg} />
      <MyCarousel data={homeScreens} />
      <PrimaryButton style={{
        marginTop: 16
      }}>
        <ButtonText style={{
          textAlign: 'center'
        }}>
          Get started
        </ButtonText>
      </PrimaryButton>
      <SecondaryButton style={{
        marginTop: 8
      }}>
        <ButtonText style={{
          textAlign: 'center',
          color: Black
        }}>
          Log in
        </ButtonText>
      </SecondaryButton>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Orange,
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(16),
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