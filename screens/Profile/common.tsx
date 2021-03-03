

import React, { useState, createContext, useCallback, useEffect } from 'react'
import { Dimensions, Pressable, View, Image } from 'react-native'
import { Bar } from 'react-native-progress'
import { useNavigation } from '@react-navigation/native'
import { useMutation } from '@apollo/client'
import { isBefore } from 'date-fns'

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
import { Card, ReviewCard } from '../../storybook/stories/Card' 
import UserPlaceholder from '../../assets/images/user/placeholder'
import DefaultProfilePicture from '../../assets/images/default-profile-picture.jpg'
import { GET_USER_STREAK } from '../../graphql/queries'
import { updateUsageProgress } from '../../utils/apollo'
import CoolProfilePlaceholder from '../../assets/images/default-profile.png'

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
      <Image source={DefaultProfilePicture} style={{
        ...profileStyles.profilePlaceholderImage,
        ...(imageStyle && {
          ...imageStyle
        })
      }} />
    )
  }

  return <Image source={CoolProfilePlaceholder} style={{
    ...profileStyles.profilePlaceholderImage,
    ...(imageStyle && {
      ...imageStyle
    })
  }} />
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
  const { section, setSection, type } = useProfile()
  const feedSelected = section === 'feed'
  const actionSelected = section === 'action'
  const asksSelected = section === 'asks'
  const reviewSelected = section === 'reviews'

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
      {
        type === 'user' &&
        <Pressable onPress={() => setSection('reviews')}>
        <View style={{
          ...(reviewSelected && {
            borderBottomColor: Blue400,
            borderBottomWidth: 1,
          }),
          paddingBottom: spacingUnit,
          alignItems: 'center',
          width: spacingUnit * 12
        }}>
          <Paragraph color={reviewSelected ? Blue400 : Black }>
            Reviews
          </Paragraph>
        </View>
      </Pressable>
      }
    </View>
  )
}

export const SetUpFlowProgress = ({ progress, navigationUrl,navigationParams, setupText, setupButtonText, color }) => {
  const navigation = useNavigation()

  return (
    <View style={{
      marginTop: spacingUnit * 2,
      flex: 1
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: spacingUnit * 2,
        paddingRight: spacingUnit * 2,
        marginBottom: spacingUnit * 0.25,

      }}>
        <View>
      <Paragraph color={color} style={{
        marginRight: spacingUnit
      }}>
        {progress * 100}%
      </Paragraph>
      </View>
      <View style={{
        flex: 1
      }}>
      <Bar width={null} progress={progress} color={color} height={spacingUnit * 1.25} unfilledColor={Grey350} borderWidth={0} />
      </View>
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
    if (!usageProgress.taskCreated && !usageProgress.goalCreated) {
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

export const renderProfileItem = ({ item, section, user, userOwned, navigation, projectId, itemRefs, onSwipeLeft, onSwipeRight, tab, loggedInUser }) => {
  if (section === 'feed') {
    return renderItem({ item, navigation, screen: 'Root', params: {
      screen: tab || 'Profile',
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
    if (item === 'start' || item === 'none') {
      // return a button to set up work flow
      return (
        <View style={{
          flex: 1,
          alignItems: 'center',
          marginTop: spacingUnit * 4
        }}>
          <Paragraph style={{
            marginBottom: spacingUnit * 2
          }} color={Grey800}>
            No goals or tasks here.
          </Paragraph>
          {
            userOwned &&
            <PrimaryButton onPress={() => {
              if (item === 'start') {
                navigation.navigate('Root', {
                  screen: tab || 'Profile',
                  params: {
                    screen: 'WorkflowWelcome',
                    params: {
                      projectId
                    }
                  }
                })
              } else if (item === 'none') {
                //TODO: Add action in new modal
              }
            }}>
              <Paragraph color={White}>
                Create actions
              </Paragraph>
            </PrimaryButton>
          }
        </View>
      )
    } else {
      const type = item && item.__typename && item.__typename.toLowerCase()
      return renderCard({ navigation, item, type, user, itemRefs, onSwipeRight, onSwipeLeft, loggedInUser })
    }
  } else if (section === 'asks') {
    if (item === 'start' || item === 'none') {
      return (
        <View style={{
          flex: 1,
          alignItems: 'center',
          marginTop: spacingUnit * 4
        }}>
          <Paragraph style={{
            marginBottom: spacingUnit * 2
          }} color={Grey800}>
            No asks yet.
          </Paragraph>
          {
            userOwned &&
            <PrimaryButton onPress={() => {
              if (item === 'start') {
                navigation.navigate('Root', {
                  screen: tab || 'Profile',
                  params: {
                    screen: 'WorkflowWelcome',
                    params: {
                      projectId
                    }
                  }
                })
              } else if (item === 'none') {
                //TODO navigate to 
              }
            }}>
              <Paragraph color={White}>
                Create asks
              </Paragraph>
            </PrimaryButton>
          }
        </View>
      )
    }
    return renderCard({ navigation, item, type: 'ask', user, itemRefs, onSwipeRight, onSwipeLeft, tab, loggedInUser })
  } else if (section === 'reviews') {
    if (item === 'none') {
      return (
        <View style={{
          flex: 1,
          alignItems: 'center',
          marginTop: spacingUnit * 4
        }}>
          <Paragraph style={{
            marginBottom: spacingUnit * 2
          }} color={Grey800}>
            No reviews yet
          </Paragraph>
        </View>
      )
    }
    return (
      <View key={item.id} style={{
        marginLeft: spacingUnit * 2,
        marginRight: spacingUnit * 2,
        
      }}>
        <ReviewCard review ={item} tab={tab} />
      </View>
    )
  }
}

export const renderCard = ({ navigation, item, type, user, itemRefs, onSwipeRight, onSwipeLeft, tab, route, loggedInUser }) => {
  // const {
  //   onSwipeRight,
  //   onSwipeLeft
  // } = useProfile()

  let newOnSwipeRight, newOnSwipeLeft
  let icon, iconSize, redirect, redirectParams
  if (type === 'goal') {
    icon = GoalIcon
    iconSize = spacingUnit * 3
    redirect = 'Root'
    redirectParams = {
      screen: tab || 'Profile',
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
      screen: tab || 'Profile',
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
      screen: tab || 'Profile',
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

  const owned = (item.ownerId === (loggedInUser && loggedInUser.id) ) || (item.userId === (loggedInUser && loggedInUser.id))
  const swipeEnabled = !!(owned) && (item.status !== 'completed' && item.status !== 'archived')

  return (
    <View key={item.id} style={{
      marginLeft: spacingUnit * 2,
      marginRight: spacingUnit * 2
    }}>
      <Card
      key={item.id}
      navigation={navigation}
      route={route}
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

export const removeActions = ({item, type, original, actions, status }) => {
  const newActions = {}
  if (actions) {
    const {
      goals,
      tasks
    } = actions
    if (type === 'goals') {
      if (goals && (status === 'created' || status === null)) {
        const newGoals = goals.filter(goal => goal.id !== item.id)

        newActions.goals = newGoals
        newActions.tasks = tasks
        return newActions
      }
    } else if (type === 'tasks') {
      if (tasks && (status === 'created' || status === null)) {
        const newTasks = tasks.filter(task => task.id !== item.id)
        newActions.goals = goals
        newActions.tasks = newTasks
        return newActions
      }
    }
  }
}

const update
export const StatusSelector = ({ setStatus, status}) => {
  return (
    
      <View style={{
        paddingLeft: spacingUnit * 2,
        paddingRight: spacingUnit * 2
      }}>
        <View style={[{
          marginTop: spacingUnit * 3,
          flexDirection: 'row'
        }]}>
        {STATUS_ARR.map(statusItem => (
          <StatusItem
          statusValue={statusItem.value}
          statusLabel={statusItem.label}
          statusTrue={statusItem.value === status}
          setStatus={setStatus}
          />
        ))}
        </View>
        {
          status === 'created' &&
          <RegularText color={Grey800} style={{
            marginTop: spacingUnit * 2,
            marginBottom: spacingUnit * 2
          }}>
            Swipe right to mark as complete, swipe left to archive.
          </RegularText>
        }
      </View>
  )
}

export const onSwipe =({
  item,
  type,
  status,
  completeGoal,
  updateGoal,
  project,
  user,
  actions,
  completeTask,
  updateTask,
  updateAsk,
  projectAskData,
  userAsksData,
  setConfetti,
  loggedInUser,
  setTaskCompleteModal,
  setGoalCompleteModal
}) => {
  if (setConfetti) {
    const formattedDueDate = new Date(item && item.dueDate)
    const newDate = new Date()
    if (isBefore(formattedDueDate, newDate)) {
      const random = Math.random()
      if ((type === 'goal' && random >= 0.2) || (type === 'task' && random >= 0.4)) {
        setConfetti(true)
        setTimeout(() => {
          setConfetti(false)
        }, 5000)
      }
    }
  }
  if (type === 'goal') {
    if (status === 'completed') {
      if (loggedInUser && loggedInUser.usageProgress && !loggedInUser.usageProgress.goalCompleted) {
        setGoalCompleteModal(true)
      }
      completeGoal({
        variables: {
          goalId: item.id
        },
        update(cache) {
          if (project) {
            cache.modify({
              fields: {
                getProjectActions(existingActions) {
                  return removeActions({ item, type: 'goals', original: existingActions, actions, status })
                },
                users() {
                  return updateUsageProgress({ user: loggedInUser, newKey: 'goalCompleted' })
                }
              }
            })
          } else if (user) {
            cache.modify({
              fields: {
                getUserActions(existingActions) {
                  return removeActions({ item, type: 'goals', original: existingActions, actions, status })
                },
                users() {
                  return updateUsageProgress({ user: loggedInUser, newKey: 'goalCompleted' })
                }
              }
            })
          }
        }
      })
    } else {

      updateGoal({
        variables: {
          goalId: item.id,
          input: {
            status
          }
        },
        update(cache) {
          if (project) {
            cache.modify({
              fields: {
                getProjectActions(existingActions) {
                  return removeActions({ item, type: 'goals', original: existingActions, actions, status })
                }
              }
            })
          } else if (user) {
            cache.modify({
              fields: {
                getUserActions(existingActions) {
                  return removeActions({ item, type: 'goals', original: existingActions, actions, status })
                }
              }
            })
          }
        }
      })
    }
  } else if (type === 'task') {
    if (loggedInUser && loggedInUser.usageProgress && !loggedInUser.usageProgress.taskCompleted && setTaskCompleteModal) {
      setTaskCompleteModal(true)
    }
    if (status === 'completed') {
      completeTask({
        variables: {
          taskId: item.id
        },
        update(cache) {
          if (project) {
            cache.modify({
              fields: {
                getProjectActions(existingActions=[]) {
                  return removeActions({ item, type: 'tasks', original: existingActions, actions, status })
                },
                users() {
                  return updateUsageProgress({ user: loggedInUser, newKey: 'taskCompleted' })
                }
              }
            })
          } else if (user) {
            cache.modify({
              fields: {
                getUserActions(existingActions=[]) {
                  return removeActions({ item, type: 'tasks', original: existingActions, actions, status })
                },
                users() {
                  return updateUsageProgress({ user: loggedInUser, newKey: 'taskCompleted' })
                }
              }
            })
          }
        }
      })
    } else {
      updateTask({
        variables: {
          taskId: item.id,
          input: {
            status
          }
        },
        update(cache) {
          if (project) {
            cache.modify({
              fields: {
                getProjectActions(existingActions) {
                  return removeActions({ item, type: 'tasks', original: existingActions, actions, status })
                }
              }
            })
          } else if (user) {
            cache.modify({
              fields: {
                getUserActions(existingActions) {
                  return removeActions({ item, type: 'tasks', original: existingActions, actions, status })
                }
              }
            })
          }
        }
      })
    }
  } else if (type === 'ask') {

    updateAsk({
      variables: {
        askId: item.id,
        input: {
          status
        }
      },
      update(cache) {
        if (project) {
          cache.modify({
            fields: {
              getAsksFromProject(existingAsks) {
                if (status === 'completed' || status === 'archived' || status === 'answered') {
                  const newAsks = projectAskData && projectAskData.getAsksFromProject.map(ask => ask.id !== item.id)
                  return newAsks
                }
              }
            }
          })
        } else if (user) {
          cache.modify({
            fields: {
              getAsksFromUser(existingAsks) {
                if (status === 'completed' || status === 'archived') {
                  const newAsks = userAsksData && userAsksData.getAsksFromUser.map(ask => ask.id !== item.id)
                  return newAsks
                }
              }
            }
          })
        }

      }
    })
  }
}
