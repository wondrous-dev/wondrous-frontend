

import React, { useState, createContext, useCallback, useEffect } from 'react'
import { Dimensions, Pressable, View } from 'react-native'
import { Bar } from 'react-native-progress'
import { useNavigation } from '@react-navigation/native'

import { Black, Blue400, Blue500, Green400, Grey200, Grey300, Grey350, Orange, Red400, White, Yellow300 } from '../../constants/Colors'
import Plus from '../../assets/images/plus'
import { profileStyles } from './style'
import ProfileDefaultImage from '../../assets/images/profile-placeholder'
import { Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { FlexibleButton, PrimaryButton } from '../../storybook/stories/Button'
import { spacingUnit } from '../../utils/common'
import { useProfile } from '../../utils/hooks'
import { renderItem } from '../../components/Feed'

export const ProfilePlaceholder = ({ projectOwnedByUser }) => {
  const { setModalVisible } = useProfile()
  if (projectOwnedByUser) {
    return (
    <Pressable onPress={() => setModalVisible(true)}>
      <View style={
          profileStyles.profilePlaceholderContainer
        }>
        <Plus />
      </View>
      </Pressable>
    )
  }
  return <ProfileDefaultImage style={profileStyles.profilePlaceholderImage} />
}

export const ProjectInfoText = ({ count, type }) => {
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <RegularText style={{
        fontFamily: 'Rubik SemiBold',
      }} color={Grey200}>
        {count}
      </RegularText>
      <RegularText color={Grey200}>
        {type}
      </RegularText>
    </View>
  )
}

export const SectionsHeader = () => {
  const { section, setSection } = useProfile()
  const feedSelected = section === 'feed'
  const actionSelected = section === 'action'
  const asksSelected = section === 'asks'

  return (
    <View style={profileStyles.sectionChoiceContainer}>
      <Pressable onPress={() => setSection('feed')}>
        <View style={{
          ...(feedSelected && {
            borderBottomColor: Blue400,
            borderBottomWidth: 1
          }),
          paddingBottom: spacingUnit,
          width: spacingUnit * 12,
          alignItems: 'center'
        }}>
          <Paragraph color={feedSelected ? Blue400 : Black }>
            Feed
          </Paragraph>
        </View>
      </Pressable>
      <Pressable onPress={() => setSection('action')}>
        <View style={{
          ...(actionSelected && {
            borderBottomColor: Blue400,
            borderBottomWidth: 1
          }),
          paddingBottom: spacingUnit,
          width: spacingUnit * 12,
          alignItems: 'center'
        }}>
          <Paragraph color={actionSelected ? Blue400 : Black }>
            Action
          </Paragraph>
        </View>
      </Pressable>
      <Pressable onPress={() => setSection('asks')}>
        <View style={{
          ...(asksSelected && {
            borderBottomColor: Blue400,
            borderBottomWidth: 1,
          }),
          paddingBottom: spacingUnit,
          alignItems: 'center',
          width: spacingUnit * 12
        }}>
          <Paragraph color={asksSelected ? Blue400 : Black }>
            Asks
          </Paragraph>
        </View>
      </Pressable>
    </View>
  )
}

export const SetUpFlowProgress = ({ progress, navigationUrl,navigationParams, setupText, setupButtonText, color }) => {
  const navigation = useNavigation()

  return (
    <View style={{
      marginTop: spacingUnit * 2
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: spacingUnit * 2,
        paddingRight: spacingUnit * 2,
        marginBottom: spacingUnit * 0.25,
      }}>
      <Paragraph color={color} style={{
        marginRight: spacingUnit
      }}>
        {progress * 100}%
      </Paragraph>
      <Bar progress={progress} width={Dimensions.get('window').width - (spacingUnit * 9)} color={color} height={spacingUnit * 1.25} unfilledColor={Grey350} borderWidth={0} />
      </View>
      <View style={{
        flexDirection: 'row',
        paddingLeft: spacingUnit * 2,
        paddingRight: spacingUnit * 2,
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Pressable onPress={() => navigation.navigate(navigationUrl, navigationParams)}>
          <Paragraph>
            Next step: <Paragraph color={Blue400}>{setupText}</Paragraph>
          </Paragraph>
        </Pressable>
        <FlexibleButton style={{
          paddingLeft: spacingUnit * 1.5,
          paddingRight: spacingUnit * 1.5,
          paddingTop: 2,
          paddingBottom: 2,
          backgroundColor: Blue500
        }} onPress={() => {
          navigation.navigate(navigationUrl, navigationParams)
        }}>
          <Paragraph color={White}>
            {setupButtonText}
          </Paragraph>
        </FlexibleButton>
      </View>
    </View>
  )
}

export const DetermineUserProgress = ({ user, projectId }) => {
  if (user && user.usageProgress) {
    const usageProgress = user.usageProgress
    // Determine percentages. Start at 50 when workflow not finished. Then 80 once it is. Then invite friends. Then add link?
    if (usageProgress.signupCompleted && !usageProgress.taskCreated && !usageProgress.goalCreated) {
      // 50%
      const setupText = 'Work flow'
      const setupButtonText = 'Start workflow'
      return <SetUpFlowProgress progress={0.7} navigationUrl={'Root'} navigationParams={{
        screen: 'Profile',
        params: {
          screen: 'WorkflowWelcome',
          params: {
            projectId
          }

        }
      }} setupText={setupText} setupButtonText={setupButtonText} color={Yellow300} />
    } else if (usageProgress.goalCreated && !usageProgress.taskCreated) {
      const setupText = 'Tasks'
      const setupButtonText = 'Create tasks'
      return <SetUpFlowProgress progress={0.80} navigationUrl={'Root'} navigationParams={{
        screen: 'Profile',
        params: {
          screen: 'WorkflowWelcome',
          params: {
            projectId
          }
        }
      }}
        setupButtonText={setupButtonText} setupText={setupText} color={Orange}
      />
    } else if (usageProgress.goalCreated && usageProgress.taskCreated && !usageProgress.askCreated) {
      const setupText = 'Asks'
      const setupButtonText = 'Create Asks'
      return <SetUpFlowProgress progress={0.90} navigationUrl={'Root'} navigationParams={{
        screen: 'Profile',
        params: {
          screen: 'WorkflowWelcome',
          params: {
            projectId
          }
        }
      }}
        setupButtonText={setupButtonText} setupText={setupText} color={Green400}
      />
    }
    return null
  } else {
    return null
  }
}

export const renderProfileItem = ({ item, section, user, navigation, projectId }) => {
  if (section === 'feed') {
    return renderItem({ item, navigation, screen: 'Root', params: {
      screen: 'Profile',
      params: {
        screen: 'ProfileItem',
        params: {
          item,
          liked: false,
          comment: true,
          standAlone: true
        }
      }
    }   })
  } else if ( section === 'action') {
    if (item === 'start') {
      // return a button to set up work flow
      return (
        <View style={{
          flex: 1,
          alignItems: 'center',
          marginTop: spacingUnit * 4
        }}>
          <Paragraph style={{
            marginBottom: spacingUnit * 2
          }} color={Black}>
            No goals or tasks yet.
          </Paragraph>
          <PrimaryButton onPress={() => navigation.navigate('Root', {
            screen: 'Profile',
            params: {
              screen: 'WorkflowWelcome',
              params: {
                projectId
              }
            }
          })}>
            <Paragraph color={White}>
              Create actions
            </Paragraph>
          </PrimaryButton>
        </View>
      )
    }
  }
}