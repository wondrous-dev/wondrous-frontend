

import React, { useState, createContext, useCallback, useEffect } from 'react'
import { Dimensions, Pressable, View } from 'react-native'
import { Bar } from 'react-native-progress'
import { useNavigation } from '@react-navigation/native'
import { useMutation } from '@apollo/client'

import { Black, Blue400, Blue500, Green400, Grey200, Grey500, Grey350, Grey800, Orange, Red400, White, Yellow300 } from '../../constants/Colors'
import Plus from '../../assets/images/plus'
import { profileStyles } from './style'
import ProfileDefaultImage from '../../assets/images/profile-placeholder'
import { Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { FlexibleButton, PrimaryButton } from '../../storybook/stories/Button'
import { spacingUnit } from '../../utils/common'
import { useProfile } from '../../utils/hooks'
import { renderItem } from '../../components/Feed'
import GoalIcon from '../../assets/images/goal/standalone'
import TaskIcon from '../../assets/images/task/standalone'
import AskIcon from '../../assets/images/ask/standalone'
import { Card } from '../../storybook/stories/Card' 


export const ProfilePlaceholder = ({ projectOwnedByUser, imageStyle, user }) => {
  if (projectOwnedByUser) {
    const { setModalVisible } = useProfile()
    return (
    <Pressable onPress={() => setModalVisible(true)}>
      <View style={{
          ...profileStyles.profilePlaceholderContainer,
          ...imageStyle
      }}>
        <Plus />
      </View>
      </Pressable>
    )
  }
  if (user) {
    return (
      <UserPlaceholder style={{
        marginRight: -spacingUnit,
        marginBottom: spacingUnit
      }} />
    )
  }
  return <ProfileDefaultImage style={[profileStyles.profilePlaceholderImage, imageStyle]} />
}

export const ProjectInfoText = ({ count, type, style }) => {
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      ...style
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

export const StatusItem = ({ statusValue, setStatus, statusTrue, statusLabel }) => {
  return (
    <Pressable style={{
      padding: spacingUnit * 0.5,
      flex: 1,
      alignItems: 'center',
      textAlign: 'center',
      borderRadius: 4,
      ...(statusTrue && {
        backgroundColor: Blue400
      })
    }} onPress={() => setStatus(statusValue)}>
      <RegularText color={statusTrue ? White : Grey800}>
        {statusLabel}
      </RegularText>
    </Pressable>
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

export const STATUS_ARR = [
  {
    label: 'To do',
    value: 'created',
  },
  {
    label: 'Completed',
    value: 'completed'
  },
  {
    label: 'Archived',
    value: 'archived'
  }
]

export const renderProfileItem = ({ item, section, user, navigation, projectId, itemRefs, onSwipeLeft, onSwipeRight }) => {
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
    } else {
      const type = item && item.__typename && item.__typename.toLowerCase()
      return renderCard({ navigation, item, type, user, itemRefs, onSwipeRight, onSwipeLeft })
    }
  }
}

export const renderCard = ({ navigation, item, type, user, itemRefs, onSwipeRight, onSwipeLeft }) => {
  // const {
  //   onSwipeRight,
  //   onSwipeLeft
  // } = useProfile()
  let newOnSwipeRight, newOnSwipeLeft
  let icon, iconSize, redirect, redirectParams
  if (type === 'goal') {
    icon = GoalIcon
    iconSize = spacingUnit * 4
    redirect = 'Root'
    redirectParams = {
      screen: 'Profile',
      params: {
        screen: 'GoalPage',
        params: {
          goal: item
        }
      }
    }
    newOnSwipeRight = () => onSwipeRight(item, 'goal')
    newOnSwipeLeft = () => onSwipeLeft(item, 'goal')
  } else if (type === 'task') {
    icon = TaskIcon
    iconSize = spacingUnit * 3
    redirect = 'Root'
    redirectParams = {
      screen: 'Profile',
      params: {
        screen: 'TaskPage',
        params: {
          task: item
        }
      }
    }
    newOnSwipeRight = () => onSwipeRight(item, 'task')
    newOnSwipeLeft = () => onSwipeLeft(item, 'task')
  } else if (type === 'ask') {
    icon = AskIcon
    iconSize = spacingUnit * 3
    redirect = 'Root'
    redirectParams = {
      screen: 'Profile',
      params: {
        screen: 'AskPage',
        params: {
          ask: item
        }
      }
    }
    newOnSwipeRight = () => onSwipeRight(item, 'ask')
    newOnSwipeLeft = () => onSwipeLeft(item, 'ask')
  }

  const owned = (item.ownerId === (user && user.id) ) || (item.userId === (user && user.id))
  const swipeEnabled = !!(owned) && (item.status !== 'completed' && item.status !== 'archived')

  return (
    <View key={item.id} style={{
      marginLeft: spacingUnit * 2,
      marginRight: spacingUnit * 2
    }}>
      <Card
      key={item.id}
      navigation={navigation}
      redirect={redirect}
      redirectParams={redirectParams}
      type={type}
      icon={icon}
      iconSize={iconSize}
      profilePicture={user && user.profilePicture}
      item={item}
      swipeEnabled={swipeEnabled}
      itemRefs={itemRefs && itemRefs.current}
      onSwipeRight={newOnSwipeRight}
      onSwipeLeft={newOnSwipeLeft}
      />
    </View>
  )
}