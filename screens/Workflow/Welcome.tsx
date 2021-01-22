import React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { SafeAreaView, StyleSheet, View } from 'react-native'

import { Header } from '../../components/Header'
import { Subheading, Paragraph, RegularText } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import { ProfileTabParamList } from '../../types'
import { Grey500, White, Black } from '../../constants/Colors'
import { spacingUnit } from '../../utils/common'
import WelcomeImage from '../../assets/images/workflow/welcome'
import WelcomePicture from '../../assets/images/workflow/welcome'
import { withAuth, useMe } from '../../components/withAuth'
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
}: StackScreenProps<ProfileTabParamList, 'WorkflowWelcome'>) {
  const {
    projectId
  } = route.params
  const user = useMe()
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
        The Wonder workflow
      </Subheading>
      <View style={{
        alignSelf: 'flex-start',
      }}>
      <Paragraph color={Grey500} style={{
        textAlign: 'left',
        padding: spacingUnit
      }}>
        <Paragraph style={{
          fontFamily: 'Rubik SemiBold'
        }}>Goals </Paragraph>and 
        <Paragraph style={{
          fontFamily: 'Rubik SemiBold'
        }}> Tasks </Paragraph>act as progress markers that you can share with your followers.
      </Paragraph>
      <Paragraph color={Grey500} style={{
        textAlign: 'left',
        marginBottom: spacingUnit * 4,
        marginLeft: spacingUnit
      }}>
        <Paragraph style={{
          fontFamily: 'Rubik SemiBold'
        }}>
          Asks 
        </Paragraph> are things you need help with.
      </Paragraph>
      </View>
      <WelcomePicture />
      <PrimaryButton style={{
        marginTop: spacingUnit * 6
      }} onPress={() => {
        const usageProgress = user && user.usageProgress
        if (usageProgress && usageProgress.goalCreated) {
          navigation.navigate('Root', {
            screen: 'Profile',
            params: {
              screen: 'SetupTask',
              params: {
                projectId
              }
            }
          })
        } else if (usageProgress && usageProgress.taskCreated) {
          navigation.navigate('Root', {
            screen: 'Profile',
            params: {
              screen: 'SetupAsk',
              params: {
                projectId
              }
            }
          })
        }
      }}>
        <Paragraph color={White}>
          Got it
        </Paragraph>
      </PrimaryButton>
      </View>
    </SafeAreaView>
  )
}

export default withAuth(WorkflowWelcomeScreen)