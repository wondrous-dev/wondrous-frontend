import React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { SafeAreaView, StyleSheet, View } from 'react-native'

import { Header } from '../../components/Header'
import { Subheading, Paragraph, RegularText } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import { RootStackParamList } from '../../types'
import { Grey500, White, Black } from '../../constants/Colors'
import { spacingUnit } from '../../utils/common'
import WelcomeImage from '../../assets/images/workflow/welcome'
import WelcomePicture from '../../assets/images/workflow/welcome'

const welcomeStyles = StyleSheet.create({
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacingUnit * 6,
    paddingLeft: spacingUnit * 2,
    paddingRight: spacingUnit * 2
  }
})

function WorkflowWelcomeScreen({
  route,
  navigation
}: StackScreenProps<RootStackParamList, 'WorkflowWelcome'>) {
  return (
    <SafeAreaView style={{
      backgroundColor: White,
      flex: 1
    }}>
      <Header />
      <View style={welcomeStyles.welcomeContainer}>

      <Subheading color={Black} style={{
        marginBottom: spacingUnit * 2
      }}>
        Creating goals and tasks
      </Subheading>
      <Paragraph color={Grey500} style={{
        textAlign: 'center',
        marginBottom: spacingUnit * 2
      }}>
        Goals and tasks act as progress markers that you can share with your followers
      </Paragraph>
      <WelcomePicture />
      <PrimaryButton style={{
        marginTop: spacingUnit * 6
      }} onPress={() => navigation.navigate('Root', {
        screen: 'Profile',
        params: {
          screen: 'SetupGoal'
        }
      })}>
        <RegularText color={White}>
          Got it
        </RegularText>
      </PrimaryButton>
      </View>
    </SafeAreaView>
  )
}

export default WorkflowWelcomeScreen