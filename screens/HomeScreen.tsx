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
import { navigateUserOnLogin, spacingUnit } from '../utils/common'
import { useMe, withAuth } from '../components/withAuth'

function HomeScreen({
  navigation,
  route
}: StackScreenProps<RootStackParamList, 'Home'>) {
  const user = useMe()
  const homeScreens = [
    {
      subheading: 'Finish Your dream projects',
      paragraph: 'Wonder helps you build/learn in public so you are held socially accountable.'
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
  React.useEffect(() => {
    if (user) {
      navigateUserOnLogin(user, navigation)
    }
  }, [])
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
          <ButtonText style={{
            fontSize: 16
          }} color={White}>
          Get started
          </ButtonText>
      </PrimaryButton>
      <SecondaryButton onPress={() => navigation.navigate('Signup', {
        login: true
      })} style={{
        marginTop: spacingUnit * 1.5
      }}>
        <ButtonText style={{
            fontSize: 16
          }} color={Black}>
          Log in
        </ButtonText>
      </SecondaryButton>
      {/* <NotificationTester /> */}
    </SafeAreaView>
  )
}

export default withAuth(HomeScreen)

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