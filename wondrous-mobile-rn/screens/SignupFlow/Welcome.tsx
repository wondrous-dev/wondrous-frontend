import * as React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, TouchableOpacity, Text, Image, Pressable } from 'react-native'

import { RootStackParamList } from '../../types'
import { Orange, Black, White, Grey500 } from '../../constants/Colors'
import { styles } from '../HomeScreen'
import {  Subheading, Paragraph, ButtonText } from '../../storybook/stories/Text'
import { registerForPushNotificationsAsync } from '../../components/Notifications/RegisterNotification'
import { Header } from '../../components/Header'
import { withAuth, useMe } from '../../components/withAuth'
import { SafeAreaView } from 'react-native-safe-area-context'
import { spacingUnit } from '../../utils/common'
import { SvgImage } from '../../storybook/stories/Image'
import { PrimaryButton } from '../../storybook/stories/Button'
import Superhero from '../../assets/images/superhero'

const loginStyles = StyleSheet.create({
  container: {
    ...styles.container
  },
  welcomeBody: {
    marginTop: spacingUnit * 8,
    textAlign: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  subheading: {
    color: Black,
    textAlign: 'center',
    marginBottom: spacingUnit * 2,
  },
  paragraph: {
    color: Grey500,
    textAlign: 'center',
    maxWidth: spacingUnit * 43,
    alignSelf: 'center',
    marginBottom: spacingUnit * 3,
    marginTop: spacingUnit * 2
  },
  image: {
    alignSelf: 'center',
    marginBottom: spacingUnit * 14
  },
  button: {
    alignSelf: 'center',
    marginBottom: spacingUnit * 2
  },
})

function WelcomeScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'Welcome'>) {
  const user = useMe()
  React.useEffect(() => {
    registerForPushNotificationsAsync(user)

    if (user && user.usageProgress) {
      if (user.username) {
        navigation.push('FirstProjectSetup')
      }
    } 
  }, [])

  return (
    <SafeAreaView style={[styles.container, {
      backgroundColor: White
    }]}>
      <Header />
      <View style={loginStyles.welcomeBody}>
      <Subheading color={Black} style={loginStyles.subheading}>
          Welcome to Wonder!
        </Subheading>
        <Superhero style={{
          alignSelf: 'center'
        }} />
        <Paragraph style={loginStyles.paragraph}>
          We love action! Let's get started on your first project. Sound good?
        </Paragraph>
        {/* <SvgImage width="80" height="80" srcElement={Celebration} style={loginStyles.image} /> */}
          <PrimaryButton textStyle={{
            color: White
          }} style={loginStyles.button} onPress={() => {
            navigation.push('UsernameSetup')
          }}>
            <ButtonText color={White}>
              I'm ready!
            </ButtonText>
          </PrimaryButton>
      </View>
    </SafeAreaView>
  )
}

export default withAuth(WelcomeScreen)