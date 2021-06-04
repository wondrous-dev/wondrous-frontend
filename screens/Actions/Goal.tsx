import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, ScrollView, Pressable, TouchableOpacity } from 'react-native'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import Toast from 'react-native-toast-message'
import ConfettiCannon from 'react-native-confetti-cannon'

import { withAuth, useMe } from '../../components/withAuth'
import { Header } from '../../components/Header'
import { Grey800, Purple, Red400, White, Yellow300, Grey300, Blue400, Grey450, Black, Green400 } from '../../constants/Colors'
import { FullScreenGoalModal } from '../../components/Modal/GoalModal'
import { GoalCongratsModal, TaskCongratsModal } from '../../components/Modal'
import { pageStyles, sortPriority, ReactionFeed } from './common'
import { UPDATE_GOAL, COMPLETE_GOAL, NUDGE_GOAL } from '../../graphql/mutations'
import { ErrorText, Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import PriorityFlame from '../../assets/images/modal/priority'
import { capitalizeFirstLetter, getRingActions, renderMentionString, spacingUnit, getLocale } from '../../utils/common'
import { Tag } from '../../components/Tag'
import { formatDueDate, redDate } from '../../utils/date'
import { GET_GOAL_BY_ID, GET_USER_STREAK, CHECK_USER_FOLLOWS_BACK, GET_USER_RING_ACTION_COUNT } from '../../graphql/queries'
import { MyCarousel, VideoDisplay } from '../../storybook/stories/Carousel'
import LinkIcon from '../../assets/images/link'
import Nudge from '../../assets/images/actions/nudge'
import { UserCongratsContext } from '../../utils/contexts'

const GoalPage = ({ navigation, route }) => {
  const user = useMe()
  const {
    goal: initialGoal,
    goalId,
    tab
  } = route.params
  const [goal, setGoal] = useState(initialGoal)
  const ownedByUser = (goal && goal.ownerId) === (user && user.id)
  const [status, setStatus] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [followBack, setFollowBack] = useState(null)
  const [getGoal, {
    data,
    loading,
    error
  }] = useLazyQuery(GET_GOAL_BY_ID, {
    fetchPolicy: 'network-only'
  })
  const [confetti, setConfetti] = useState(false)
  const [goalCompleteModal, setGoalCompleteModal] = useState(false)
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

  const [updateGoal] = useMutation(UPDATE_GOAL, {
    update: (cache, { data }) => {
      if (data) {
        setGoal(data && data.updateGoal)
      }
      cache.modify({
        fields: {
          getGoalsFromProject(existingGoals=[]) {
            // console.log('existingGoals', existingGoals)
            return existingGoals
          },
          getGoalsFromUser() {

          },
          getUserActions() {
            
          },
          getGoalById() {
            
          }
        }
      })
    }
  })

  const [nudgeGoal] = useMutation(NUDGE_GOAL, {
    onCompleted: () => {
      Toast.show({
        text1: 'Nudge successfully sent!',
        position: 'bottom',
      })
    }
  })

  const [completeGoal] = useMutation(COMPLETE_GOAL, {
    refetchQueries: [
      { query: GET_USER_STREAK, variables: {
        userId: user && user.id
      } },
      {
        query: GET_USER_RING_ACTION_COUNT,
        variables: {
          userId: user?.id
        }
      }
    ],
    update: (cache, { data }) => {
      if (data) {
        setGoal(data?.completeGoal)
      }
    }
  })

  const [checkUserFollowBack, {
    data: followBackData
  }] = useLazyQuery(CHECK_USER_FOLLOWS_BACK)

  useEffect(() => {
    if (!goal) {
      getGoal({
        variables: {
          goalId
        }
      })
    }
    if (data) {
      setGoal(data.getGoalById)
    }
    if (goal?.status) {
      setStatus(goal?.status)
    }
    if (goal?.ownerId && followBack === null) {
      checkUserFollowBack({
        variables: {
          userId: goal?.ownerId
        }
      })
    }
    if (followBackData) {
      setFollowBack(followBackData?.doesUserFollowBack)
    }
  }, [data, goal, followBackData])

  const completed = status === 'completed'
  const archived = status === 'archived'
  if (!goal) {
    return (
      <View>
        {/* <ErrorText>
          No goal found
        </ErrorText> */}
      </View>
    )
  }
  const images = goal.additionalData && goal.additionalData.images
  const muxPlaybackId = goal.muxPlaybackId
  const asks = goal && goal.relatedAskIds
  const tasks = goal.taskCount && Number(goal.taskCount)
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <FullScreenGoalModal setModalVisible={setModalVisible} isVisible={modalVisible} setup={true} goal={goal} goalMutation={updateGoal} completeGoalMutation={completeGoal} />
      <Header title='Goal' rightButton={ownedByUser && {
        style: {
          borderWidth: 1,
          borderColor: Grey800
        },
        textColor: Grey800,
        text: 'Edit Goal',
        onPress: () => {
          setModalVisible(true)
        }
      }}/>
      {
        confetti &&
        <ConfettiCannon count={200} origin={{x: -10, y: 0}} />
      }
      {
        ownedByUser && goalCompleteModal &&
        <UserCongratsContext.Provider value={{
          user,
          incompleteRingActions,
          completedRingActions: completedRingActions
        }}>
        <GoalCongratsModal user={user} isVisible={goal} setModalVisible={setGoalCompleteModal} />
        </UserCongratsContext.Provider>
      }
      <ScrollView style={pageStyles.container}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-start'
        }}>
        <Text style={pageStyles.title}>
          {renderMentionString({ content: goal.name, navigation, tab })}
        </Text>
        {
                status === 'created' && followBack &&
                <>
                <View style={{
                  flex: 1
                }} />
                <TouchableOpacity style={{
                  marginLeft: spacingUnit
                }} onPress={() => nudgeGoal({
                  variables: {
                    goalId: goal?.id
                  }
                })}>
                  <Nudge color={Yellow300} />
                </TouchableOpacity>
                </>
          }
        </View>
        {
          goal.detail &&
          <View>
            <Text style={pageStyles.paragraph}>
              {renderMentionString({ content: goal.detail, navigation, tab })}
            </Text>
          </View>
        }
        <View style={[pageStyles.infoContainer]}>
          {
            completed
            ?
            <Tag color={Green400} style={{
              marginRight: spacingUnit,
              marginTop: spacingUnit
            }}>
              <RegularText color={White}>
                Completed
              </RegularText>
            </Tag>
            :
            (
              archived
              ?
              <Tag color={Grey300} style={{
                marginRight: spacingUnit,
                marginTop: spacingUnit
              }}>
                  <RegularText color={Grey800}>
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
                  setGoalCompleteModal(true)
                  completeGoal({
                    variables: {
                      goalId: goal?.id,
                      currentTimezone: getLocale()
                    }
                  })
    
                }} style={pageStyles.markAsComplete}>
                  <RegularText color={Green400}>
                    Mark as complete
                  </RegularText>
                </Pressable>
              }
              </>
            )
          }

          {
              goal.priority &&
              <View style={[pageStyles.priorityContainer, {
                backgroundColor: sortPriority(goal.priority),
                marginTop: spacingUnit
              }]}>
              <PriorityFlame color={White} style={{
                // marginLeft: spacingUnit,
                marginRight: spacingUnit
              }} />
              <RegularText color={White}>
                {capitalizeFirstLetter(goal.priority)} Priority
              </RegularText>
              </View>
            }
            {
              goal.project &&
              <Tag color={Purple} style={{
                marginRight: spacingUnit ,
                marginTop: spacingUnit 
              }}>
                <RegularText color={White}>
                  {goal.project && goal.project.name}
                </RegularText>
              </Tag>
            }
            { goal.dueDate &&
            <View style={{
              marginTop: spacingUnit
            }}>
                <RegularText color={redDate(goal.dueDate) ? Red400 : Grey450}>
                Due {formatDueDate(new Date(goal.dueDate))}
              </RegularText>
              </View>
            }
        </View>
        {
          goal.additionalData && goal.additionalData.link &&
          <View style={pageStyles.linkContainer}>
            <LinkIcon color={Grey800} style={{
              // marginRight: spacingUnit
            }} />
            <Paragraph color={Blue400} style={pageStyles.link}>
              {goal.additionalData.link}
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
          ] : images} images={true} passiveDotColor={Grey800} activeDotColor={Blue400} />
        }
        </View>
        <View style={[pageStyles.subContainer]}>
        {
          asks &&
          <Pressable onPress={() => navigation.push('Root', {
            screen: tab || 'Profile',
            params: {
              screen: 'ActionList',
              params: {
                goalId: goal.id,
                routeLabel: 'Asks',
                type: 'ask',
                askIds: asks
              }
            }
          })} style={{
            marginRight: spacingUnit
          }}>
          <Paragraph color={Black} style={pageStyles.additionalInfoText}>
            {asks.length}
            <Paragraph color={Black} style={{
            // textDecorationLine: 'underline'
          }}>
            {asks.length === 1 ? ' ask' : ' asks'}
          </Paragraph>
          </Paragraph>
          </Pressable>
        }
        {
          tasks !== 0 &&
          <Pressable onPress={() => navigation.push('Root', {
            screen: tab || 'Profile',
            params: {
              screen: 'ActionList',
              params: {
                goalId: goal.id,
                routeLabel: 'Tasks',
                type: 'task'
              }
            }
          })}>
            <Paragraph color={Black} style={pageStyles.additionalInfoText}>
              {tasks}
              <Paragraph color={Black}>
                {Number(tasks)=== 1 ? ' task' : ' tasks'}
              </Paragraph>
            </Paragraph>
          </Pressable>
        }
        </View>
        <ReactionFeed type={'goal'} objId={goal.id} user={user} tab={tab} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default withAuth(GoalPage)