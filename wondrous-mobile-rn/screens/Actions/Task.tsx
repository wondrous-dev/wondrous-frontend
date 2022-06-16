import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, ScrollView, Pressable, TouchableOpacity } from 'react-native'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import Toast from 'react-native-toast-message'
import ConfettiCannon from 'react-native-confetti-cannon'

import { withAuth, useMe } from '../../components/withAuth'
import { Header } from '../../components/Header'
import palette from 'theme/palette'
import { FullScreenTaskModal } from '../../components/Modal/TaskModal'
import { pageStyles, sortPriority, ReactionFeed } from './common'
import { COMPLETE_TASK, UPDATE_TASK, NUDGE_TASK } from '../../graphql/mutations'
import { ErrorText, Paragraph, RegularText } from '../../storybook/stories/Text'
import PriorityFlame from '../../assets/images/modal/priority'
import { capitalizeFirstLetter, renderMentionString, spacingUnit, getRingActions } from '../../utils/common'
import { Tag } from '../../components/Tag'
import { formatDueDate, redDate } from '../../utils/date'
import { GET_TASK_BY_ID, GET_GOAL_BY_ID, GET_USER_STREAK, CHECK_USER_FOLLOWS_BACK, GET_USER_RING_ACTION_COUNT } from '../../graphql/queries'
import { MyCarousel, VideoDisplay } from '../../storybook/stories/Carousel'
import LinkIcon from '../../assets/images/link'
import Nudge from '../../assets/images/actions/nudge'
import { TaskCongratsModal } from '../../components/Modal'
import { UserCongratsContext } from '../../utils/contexts'

const TaskPage = ({ navigation, route }) => {
  const user = useMe()
  const {
    task: initialTask,
    taskId,
    tab
  } = route.params
  const [task, setTask] = useState(initialTask)
  const ownedByUser = (task && task.ownerId) === (user && user.id)
  const [status, setStatus] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [taskCompleteModal, setTaskCompleteModal] = useState(false)
  const [confetti, setConfetti]  = useState(false)
  const [getTask, {
    data,
    loading,
    error
  }] = useLazyQuery(GET_TASK_BY_ID)
  const [followBack, setFollowBack] = useState(null)
  const [checkUserFollowBack, {
    data: followBackData
  }] = useLazyQuery(CHECK_USER_FOLLOWS_BACK)
  const [updateTask] = useMutation(UPDATE_TASK, {
    update: (cache, { data } ) => {
      if (data) {
        setTask(data?.updateTask)
      }
      cache.modify({
        fields: {
          getTasksFromProject(existingTasks=[]) {

          },
          getTasksFromUser() {

            
          },
          getUserActions() {

          },
          getTaskById() {
            // console.log('updateTask', updateTask)
            // setTask(updateTask)
            // return [updateTask]
          }
        }
      })
    }
  })

  const {
    data: userRingActionCountData
  } = useQuery(GET_USER_RING_ACTION_COUNT, {
    variables: {
      userId: user?.id
    }, 
    fetchPolicy: 'network-only'
  })

  const {
    percentage,
    incompleteRingActions,
    completedRingActions
  } = getRingActions(userRingActionCountData)

  const [completeTask] = useMutation(COMPLETE_TASK, {
    refetchQueries: [
      { query: GET_USER_STREAK, variables: {
        userId: user && user.id
      } }
    ],
    update: (cache, { data } ) => {
      if (data) {
        setTask(data?.completeTask)
      }
    }
  })

  const [nudgeTask] = useMutation(NUDGE_TASK, {
    onCompleted: () => {
      Toast.show({
        text1: 'Nudge successfully sent!',
        position: 'bottom',
      })
    }
  })

  const [getGoalName, {
    data: taskGoal
  }] = useLazyQuery(GET_GOAL_BY_ID)

  useEffect(() => {
    if (!task) {
      getTask({
        variables: {
          taskId
        }
      })
    }
    if (data) {
      setTask(data.getTaskById)
    }
    
    if (task && task.goalId) {
      getGoalName({
        variables: {
          goalId: task.goalId
        }
      })
      if (followBack === null) {
        checkUserFollowBack({
          variables: {
            userId: task?.ownerId
          }
        })
      }
    }
    if (task?.status) {
      setStatus(task?.status)
    }
    if (followBackData) {
      setFollowBack(followBackData?.doesUserFollowBack)
    }
  }, [data, task, followBackData])


  if (!task) {
    return (
      <View>
        {/* <ErrorText>
          No goal found
        </ErrorText> */}
      </View>
    )
  }
  const images = task.additionalData && task.additionalData.images
  const muxPlaybackId = task.muxPlaybackId
  const asks = task && task.relatedAskIds
  const goal = taskGoal && taskGoal.getGoalById
  const completed = status === 'completed'
  const archived = status === 'archived'
  const onboarding = task?.additionalData?.onboarding
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: palette.white
    }}>
      <FullScreenTaskModal setModalVisible={setModalVisible} isVisible={modalVisible} setup={true} task={task} taskMutation={updateTask} completeTaskMutation={completeTask} />
      <Header title='Task' rightButton={ownedByUser && !onboarding && {
        style: {
          borderWidth: 1,
          borderColor: palette.grey800
        },
        textColor: palette.grey800,
        text: 'Edit Task',
        onPress: () => {
          setModalVisible(true)
        }
      }}/>
      {
        confetti &&
        <ConfettiCannon count={200} origin={{x: -10, y: 0}} />
      }
      {
        ownedByUser && taskCompleteModal &&
        <UserCongratsContext.Provider value={{
          user,
          incompleteRingActions,
          completedRingActions: completedRingActions
        }}>
        <TaskCongratsModal user={user} isVisible={task} setModalVisible={setTaskCompleteModal} />
        </UserCongratsContext.Provider>
      }
      <ScrollView style={pageStyles.container}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-start'
        }}>
          <Text style={pageStyles.title}>
            {renderMentionString({ content: task.name, navigation, tab })}
          </Text>
          {
                status === 'created' && followBack &&
                <>
                <View style={{
                  flex: 1
                }} />
                <TouchableOpacity style={{
                  marginLeft: spacingUnit
                }} onPress={() => nudgeTask({
                  variables: {
                    taskId: task?.id
                  }
                })}>
                  <Nudge color={palette.yellow300} />
                </TouchableOpacity>
                </>
          }
        </View>
        {
          task.detail &&
          <View>
            <Text style={pageStyles.paragraph}>
              {renderMentionString({ content: task.detail, navigation, tab })}
            </Text>
          </View>
        }
        <View style={pageStyles.infoContainer}>
          {
            completed
            ?
            <Tag color={palette.green400} style={{
              marginRight: spacingUnit,
              marginTop: spacingUnit
            }}>
              <RegularText color={palette.white}>
                Completed
              </RegularText>
            </Tag>
            :
            (
              archived
              ?
              <Tag color={palette.grey300} style={{
                marginRight: spacingUnit,
                marginTop: spacingUnit
              }}>
                <RegularText color={palette.grey800}>
                  Archived
                </RegularText>
              </Tag>
              :
              <>
              {
                ownedByUser &&
                <Pressable onPress={() => {
                  setStatus('completed')
                  setConfetti(true)
                  setTimeout(() => {
                    setConfetti(false)
                  }, 5000)
                  setTaskCompleteModal(true)
                  completeTask({
                    variables: {
                      taskId: task?.id
                    }
                  })
    
                }} style={pageStyles.markAsComplete}>
                  <RegularText color={palette.green400}>
                    Mark as complete
                  </RegularText>
                </Pressable>
              }
              </>
            )
          }
          {
              task.priority &&
              <View style={[pageStyles.priorityContainer, {
                backgroundColor: sortPriority(task.priority),
                marginTop: spacingUnit
              }]}>
              <PriorityFlame color={palette.white} style={{
                // marginLeft: spacingUnit,
                marginRight: spacingUnit
              }} />
              <RegularText color={palette.white}>
                {capitalizeFirstLetter(task.priority)} Priority
              </RegularText>
              </View>
            }
            {
              task.project &&
              <Tag color={palette.purple} style={{
                marginRight: spacingUnit,
                marginTop: spacingUnit  
              }}>
                <RegularText color={palette.white}>
                  {task.project && task.project.name}
                </RegularText>
              </Tag>
            }
            { task.dueDate &&
            <View style={{
              marginTop: spacingUnit
            }}>
                <RegularText color={redDate(task.dueDate) ? palette.red400 : palette.grey450}>
                Due {formatDueDate(new Date(task.dueDate))}
              </RegularText>
              </View>
            }
        </View>
        {
          goal &&
          <View style={{
            marginTop: spacingUnit
          }}>
            <RegularText color={palette.black}>
              From{` `}
                <RegularText onPress={() => navigation.navigate('Root', {
                screen: tab || 'Profile',
                params: {
                  screen: 'GoalPage',
                  params: {
                    goal
                  }
                }
              })} color={palette.blue400} style={{
                  marginLeft: spacingUnit * 0.5
                }}>
                  {goal.name}
                </RegularText>
            </RegularText>
          </View>
        }
        {
          task.additionalData && task.additionalData.link &&
          <View style={pageStyles.linkContainer}>
            <LinkIcon color={palette.grey800} style={{
              marginRight: spacingUnit
            }} />
            <Paragraph color={palette.blue400} style={pageStyles.link}>
              {task.additionalData.link}
            </Paragraph>
          </View>
        }
        <View style={pageStyles.imageContainer}>
        {!images && muxPlaybackId &&
          <VideoDisplay video={muxPlaybackId} />
        }
        {
          images &&
          <MyCarousel data={muxPlaybackId ? [
            {
              video: muxPlaybackId
            },
            ...images
          ] : images} images={true} passiveDotColor={palette.grey800} activeDotColor={palette.blue400} />
        }
        </View>
        <View style={[pageStyles.subContainer]}>
        {
          asks &&
          <Pressable onPress={() => navigation.navigate('Root', {
            screen: tab || 'Profile',
            params: {
              screen: 'ActionList',
              params: {
                taskId: task.id,
                routeLabel: 'Asks',
                type: 'ask',
                askIds: asks
              }
            }
          })} style={{
            marginRight: spacingUnit
          }}>
          <Paragraph color={palette.black} style={pageStyles.additionalInfoText}>
            {asks.length}
            <Paragraph color={palette.black} style={{
            // textDecorationLine: 'underline'
          }}>
            {asks.length === 1 ? ' ask' : ' asks'}
          </Paragraph>
          </Paragraph>
          </Pressable>
        }
        </View>
        <ReactionFeed type={'task'} objId={task.id} 
         />
      </ScrollView>
    </SafeAreaView>
  )
}

export default withAuth(TaskPage)