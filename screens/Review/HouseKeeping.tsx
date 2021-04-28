import { useMutation, useLazyQuery, useQuery } from '@apollo/client'
import React, { useRef, useEffect, useState } from 'react'
import { SafeAreaView, View, ScrollView, StyleSheet, Pressable, FlatList } from 'react-native'
import { Header } from '../../components/Header'
import { White, Black, Red400, Green400, Grey400, Grey500, Blue500, Blue400 } from '../../constants/Colors'
import { GET_REVIEW_STATS } from '../../graphql/queries/review'
import { ButtonText, Paragraph, Subheading } from '../../storybook/stories/Text'
import { spacingUnit } from '../../utils/common'
import { PrimaryButton } from '../../storybook/stories/Button'
import { withAuth, useMe } from '../../components/withAuth'
import { GET_USER_ACTIONS } from '../../graphql/queries'
import { sortByDueDate } from '../../utils/date'
import { onSwipe, renderCard } from '../Profile/common'
import { COMPLETE_GOAL, COMPLETE_TASK, CREATE_GOAL, CREATE_TASK, UPDATE_GOAL, UPDATE_TASK } from '../../graphql/mutations'
import { GoalCongratsModal, TaskCongratsModal } from '../../components/Modal'
import { FullScreenGoalModal } from '../../components/Modal/GoalModal'
import { FullScreenTaskModal } from '../../components/Modal/TaskModal'
import { SvgImage } from '../../storybook/stories/Image'

const HouseKeeping = ({ route, navigation }) => {
  const user = useMe()
  const  {
    loading: userActionLoading,
    data: userActionData,
    error: userActionError
  } = useQuery(GET_USER_ACTIONS, {
    variables: {
      userId: user && user.id,
      status: 'created'
    },
    fetchPolicy: 'network-only'
  })

  const actions = userActionData && userActionData.getUserActions

  let actionArr = []
  if (actions && actions.goals && actions.tasks) {
    actionArr = sortByDueDate ([
      ...actions.goals,
      ...actions.tasks
    ])
  } else if (actions && actions.goals) {
    actionArr = sortByDueDate(actions.goals)
  } else if ( actions && actions.tasks) {
    actionArr = sortByDueDate(actions.tasks)
  }
  const itemRefs = useRef(new Map())

  const [createGoal] = useMutation(CREATE_GOAL)
  const [createTask] = useMutation(CREATE_TASK)
  const [completeGoal] = useMutation(COMPLETE_GOAL)
  const [completeTask] = useMutation(COMPLETE_TASK)
  const [updateGoal] = useMutation(UPDATE_GOAL)
  const [updateTask] = useMutation(UPDATE_TASK)
  const [taskCompleteModal, setTaskCompleteModal] = useState(false)
  const [goalCompleteModal, setGoalCompleteModal] = useState(false)
  const [confetti, setConfetti] = useState(false)

  const [goalModal, setGoalModalVisible] = useState(false)
  const [taskModal, setTaskModalVisible] = useState(false)

  const onSwipeLeft = (item, type) => onSwipe({
    item,
    type,
    status: 'archived',
    completeGoal,
    updateGoal,
    project: false,
    user,
    actions: userActionData && userActionData.getUserActions,
    completeTask,
    updateTask,
    updateAsk: null,
    projectAskData: null,
    userAsksData: null,
    loggedInUser: user
  })

  const onSwipeRight = (item, type) => {
    onSwipe({
      item,
      type,
      status: 'completed',
      completeGoal,
      updateGoal,
      project: false,
      user,
      actions: userActionData && userActionData.getUserActions,
      completeTask,
      updateTask,
      updateAsk: null,
      projectAskData: null,
      userAsksData: null,
      setConfetti: null,
      loggedInUser: user,
      setTaskCompleteModal,
      setGoalCompleteModal
    })
  }
  
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <FullScreenGoalModal setModalVisible={setGoalModalVisible} isVisible={goalModal}  goalMutation={createGoal} />
      <FullScreenTaskModal setModalVisible={setTaskModalVisible} isVisible={taskModal} taskMutation={createTask} />
        <GoalCongratsModal user={user} isVisible={goalCompleteModal} setModalVisible={setGoalCompleteModal} />
        <TaskCongratsModal user={user} isVisible={taskCompleteModal} setModalVisible={setTaskCompleteModal} />
      <Header rightButton={{
        color: Blue500,
        text: 'Finish',
        onPress: () => {
          navigation.push('Root', {
            screen: 'Notifications',
            params: {
              screen: 'Default'
            }
          })
        }
      }}/>
      <FlatList
      data={actionArr}
      ListHeaderComponent={() => (
        <View style={{
          marginTop: spacingUnit * 5,
          alignItems: 'center',
          padding: spacingUnit * 2
        }}>
          <Subheading color={Black} style={{
            marginBottom: spacingUnit
          }}>
            House keeping
          </Subheading>
          <Paragraph color={Grey500} style={{
            textAlign: 'center',
            paddingLeft: spacingUnit * 3,
            paddingRight: spacingUnit * 3
          }}>
            Archive old goals/tasks, mark them as complete or add new ones.
          </Paragraph>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacingUnit,
            marginBottom: spacingUnit
          }}>
              <Pressable onPress={() => setGoalModalVisible(true)} style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: spacingUnit * 4
          }}>
            <Paragraph color={Blue400} style={{
              fontSize: 22,
            }}>
              +{` `}
            </Paragraph>
              <Paragraph color={Blue400}>
                Add goal
              </Paragraph>
              </Pressable>
          <Pressable onPress={() => setTaskModalVisible(true)} style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Paragraph color={Blue400} style={{
              fontSize: 22,
            }}>
              +{` `}
            </Paragraph>
              <Paragraph color={Blue400}>
                Add task
              </Paragraph>
          </Pressable>
          </View>
        </View>
      )}
      renderItem={({ item }) => {
        const type = item && item.__typename && item.__typename.toLowerCase()
        return renderCard({ navigation, item, itemRefs, user, onSwipeLeft, onSwipeRight, tab: 'Notifications', type, loggedInUser: user  })
      }}
      />
    </SafeAreaView>
  )
}

export default withAuth(HouseKeeping)
