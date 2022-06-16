import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { FlatList, SafeAreaView , StyleSheet, View } from 'react-native'
import { useMutation, useLazyQuery, useQuery } from '@apollo/client'
import ProgressCircle from 'react-native-progress-circle'

import { Header } from '../../components/Header'
import { withAuth, useMe } from '../../components/withAuth'
import { GET_USER_RING_GOALS, GET_USER_RING_TASKS, GET_USER_RING_ACTION_COUNT, GET_USER_STREAK } from '../../graphql/queries'
import { getRingActions, spacingUnit } from '../../utils/common'
import DefaultProfilePicture from '../../assets/images/default-profile-picture.jpg'
import { UploadImage, SafeImage } from '../../storybook/stories/Image'
import { Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { palette.black, palette.grey300, White, palette.blue400, palette.grey800, palette.grey700, palette.orange, palette.green400, palette.red400 } from '../../constants/Colors'
import {
  onSwipe,
  ProfilePlaceholder, renderCard
} from './common'
import Neutral from '../../assets/images/emoji/neutral'
import HeartEyes from '../../assets/images/emoji/heartEyes'
import BigMouthSmile from '../../assets/images/emoji/openMouthSmile'
import Smile from '../../assets/images/emoji/smile'
import StarEyes from '../../assets/images/emoji/starEyes'
import { COMPLETE_GOAL, COMPLETE_TASK, UPDATE_GOAL, UPDATE_TASK } from '../../graphql/mutations'
import { StatusSelector } from '../../components/Status/StatusSelector'
import { useNavigation } from '@react-navigation/native'
import ConfettiCannon from 'react-native-confetti-cannon'
import { UserCongratsContext } from '../../utils/contexts'
import { GoalCongratsModal, TaskCongratsModal } from '../../components/Modal'

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacingUnit * 3
  },
  percentageTextContainer: {
    marginTop: spacingUnit * 2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  percentageText: {
    marginLeft: spacingUnit,
    fontSize: 20,
    fontFamily: 'Rubik SemiBold'
  },
  actionContainer: {
    marginTop: spacingUnit * 3
  },
  actionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacingUnit * 2
  },
  actionHeaderText: {
    fontFamily: 'Rubik SemiBold',
    fontSize: 18
  },
  cursor: {
    marginLeft: spacingUnit
  },
  statusSelectorStyle: {
    marginTop: -spacingUnit * 1.5
  },
  actionStatusSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

const Emoji = ({ percentage }) => {
  if (percentage > 0 && percentage <= 20) {
    return <Neutral />
  } else if (percentage > 20 && percentage <= 40) {
    return <Smile />
  } else if (percentage > 40 && percentage <= 60) {
    return <BigMouthSmile />
  } else if (percentage > 60 && percentage < 80) {
    return <HeartEyes />
  } else if (percentage > 80) {
    return  <StarEyes />
  }
  return null
}

const TaskView = ({ tasks, user, totalTasks, completedTasks }) => {
  const loggedInUser = useMe()
  const navigation = useNavigation()
  const [confetti, setConfetti] = useState(false)
  const [taskCompleteModal, setTaskCompleteModal] = useState(false)
  const [updateTask] = useMutation(UPDATE_TASK)
  const [completeTask] = useMutation(COMPLETE_TASK, {
    refetchQueries: [
      { query: GET_USER_STREAK, variables: {
        userId: user?.id
      } },
      {
        query: GET_USER_RING_ACTION_COUNT,
        variables: {
          userId: user?.id
        }
      },
      {
        query: GET_USER_RING_TASKS,
        variables: {
          userId: user?.id
        }
      }
    ]
  })
  const ownedByUser = loggedInUser?.id === user?.id
  const [status, setStatus] = useState('created')
  const itemRefs = useRef(new Map())
  const correctTasks = status === 'created' ? tasks?.incompleteTasks : tasks?.completedTasks
  const onSwipeLeft = (item, type) => onSwipe({
    item,
    type: 'task',
    status: 'archived',
    completeTask,
    updateTask,
    project: false,
    user,
    actions: [],
    projectAskData: null
  })

  const onSwipeRight = (item, type) => {
    onSwipe({
      item,
      type: 'task',
      status: 'completed',
      completeTask,
      updateTask,
      project: false,
      user,
      actions: [],
      projectAskData: null,
      loggedInUser,
      setTaskCompleteModal,
      setConfetti
    })
  }
  return (
    <View style={{
      marginTop: spacingUnit
    }}>
      {
        confetti &&
        <ConfettiCannon count={200} origin={{x: -10, y: 0}} />
      }
      {
        ownedByUser &&
        <TaskCongratsModal user={user} isVisible={taskCompleteModal} setModalVisible={setTaskCompleteModal} />
      }
      <View style={styles.actionHeaderContainer}>
        <Paragraph style={styles.actionHeaderText}>
          Tasks
        </Paragraph>
      </View>
      <View style={styles.actionStatusSelectorContainer}>
        <StatusSelector includeArchived={false} style={styles.statusSelectorStyle} setStatus={setStatus} status={status} section={'tasks'} />
        <Paragraph>
          {completedTasks}/{totalTasks} tasks completed
        </Paragraph>
      </View>
      <View>
        {
          correctTasks?.map(task => (
            renderCard({ navigation, item: task, type: 'task', user, itemRefs, onSwipeRight, onSwipeLeft, loggedInUser })
          ))
        }
      </View>
    </View>
  )
}

const GoalView = ({ goals, totalGoals, completedGoals, user }) => {
  const loggedInUser = useMe()
  const navigation = useNavigation()
  const [updateGoal] = useMutation(UPDATE_GOAL)
  const [goalCompleteModal, setGoalCompleteModal] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const ownedByUser = loggedInUser?.id === user?.id
  const [completeGoal] = useMutation(COMPLETE_GOAL, {
    refetchQueries: [
      { query: GET_USER_STREAK, variables: {
        userId: user?.id
      } },
      {
        query: GET_USER_RING_ACTION_COUNT,
        variables: {
          userId: user?.id
        }
      },
      {
        query: GET_USER_RING_GOALS,
        variables: {
          userId: user?.id
        }
      }
    ]
  })

  const [status, setStatus] = useState('created')
  const onSwipeLeft = (item, type) => onSwipe({
    item,
    type: 'goal',
    status: 'archived',
    completeGoal,
    updateGoal,
    project: false,
    user,
    actions: [],
    projectAskData: null
  })

  const onSwipeRight = (item, type) => {
    onSwipe({
      item,
      type: 'goal',
      status: 'completed',
      completeGoal,
      updateGoal,
      project: false,
      user,
      actions: [],
      projectAskData: null,
      setConfetti,
      loggedInUser,
      setGoalCompleteModal
    })
  }
  const itemRefs = useRef(new Map())
  const correctGoals = status === 'created' ? goals?.incompleteGoals : goals?.completedGoals
  return (
    <View>
      {
        confetti &&
        <ConfettiCannon count={200} origin={{x: -10, y: 0}} />
      }
      {
        ownedByUser &&
        <GoalCongratsModal user={user} isVisible={goalCompleteModal} setModalVisible={setGoalCompleteModal} />
      }
      <View style={styles.actionHeaderContainer}>
      <Paragraph style={styles.actionHeaderText} color={palette.black}>
        Goals
      </Paragraph>
      </View>
      <View style={styles.actionStatusSelectorContainer}>
        <StatusSelector includeArchived={false} style={styles.statusSelectorStyle} setStatus={setStatus} status={status} section={'goals'} />
        <Paragraph>
          {completedGoals}/{totalGoals} goals completed
        </Paragraph>
      </View>
      <View>
        {correctGoals?.map(goal => {
          return renderCard({ navigation, item: goal, type: 'goal', user, itemRefs, onSwipeRight, onSwipeLeft, loggedInUser, goalBundle: false })
        })}
      </View>
    </View>
  )
}

const RingActions = ({ navigation, route }) => {
  const loggedInUser = useMe()
  const tab = route?.params?.tab
  const fetchedUser = route?.params?.fetchedUser
  const ownedByUser = loggedInUser?.id === fetchedUser?.id
  const [goalStatus, setGoalStatus] = useState('created')
  const [taskStatus, setTaskStatus] = useState('created')

  const {
    data: userRingActionCountData
  } = useQuery(GET_USER_RING_ACTION_COUNT, {
    variables: {
      userId: fetchedUser?.id
    }, 
    fetchPolicy: 'network-only'
  })

  const {
    data: userRingGoalData
  } = useQuery(GET_USER_RING_GOALS, {
    variables: {
      userId: fetchedUser?.id
    },
    fetchPolicy: 'network-only'
  })

  const {
    data: userRingTaskData
  } = useQuery(GET_USER_RING_TASKS, {
    variables: {
      userId: fetchedUser?.id
    },
    fetchPolicy: 'network-only'
  })

  const {
    percentage,
    incompleteRingActions,
    completedRingActions,
    completedGoalCount,
    completedTaskCount,
    incompleteGoalCount,
    incompleteTaskCount
  } = getRingActions(userRingActionCountData)
  const totalTaskCount = incompleteTaskCount + completedTaskCount
  const totalGoalCount = incompleteGoalCount + completedGoalCount

  let data = []
  if (userRingGoalData?.getUserRingGoals && totalGoalCount > 0) {
    data.push(userRingGoalData?.getUserRingGoals)
  }
  if (userRingTaskData?.getUserRingTasks && totalTaskCount > 0) {
    data.push(userRingTaskData?.getUserRingTasks)
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
        <Header title={`@${fetchedUser?.username}'s weekly ring`} />
        <UserCongratsContext.Provider value={{
          user: fetchedUser,
          incompleteRingActions,
          completedRingActions: completedRingActions === 0 ? 0 : completedRingActions - 1
        }}>
        <FlatList
          ListHeaderComponent={() => (
            <View style={styles.headerContainer}>
            <ProgressCircle
              percent={percentage}
              radius={48}
              borderWidth={8}
              color={palette.orange}
              shadowColor={palette.grey300}
              bgColor={White}
            >
              <SafeImage style={{
                width: spacingUnit * 10,
                height: spacingUnit * 10,
                borderRadius: spacingUnit * 5
              }} src={fetchedUser?.thumbnailPicture || fetchedUser.profilePicture} defaultImage={DefaultProfilePicture} />
            </ProgressCircle>
            <View style={styles.percentageTextContainer}>
              <Emoji percentage={percentage} />
              <Paragraph style={styles.percentageText} color={percentage > 50 ? palette.green400 : palette.red400}>
                {Math.round(percentage)}% complete
              </Paragraph>
            </View>
          </View>
          )}
          data={data}
          renderItem={({ item, index}) => {
            if (index === 0) {
              return <GoalView user={fetchedUser} goals={item} totalGoals={totalGoalCount} completedGoals={completedGoalCount} />
            } else if (index === 1) {
              return <TaskView user={fetchedUser} tasks={item} totalTasks={totalTaskCount} completedTasks={completedTaskCount} />
            }
            return null
          }}
        />
        </UserCongratsContext.Provider>
    </SafeAreaView>
  )
}

export default withAuth(RingActions)
