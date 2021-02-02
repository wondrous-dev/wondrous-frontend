import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, ScrollView, Pressable } from 'react-native'
import { useLazyQuery, useMutation } from '@apollo/client'

import { withAuth, useMe } from '../../components/withAuth'
import { Header } from '../../components/Header'
import { Grey800, Purple, Red400, White, Black, Blue400, Grey450 } from '../../constants/Colors'
import { FullScreenTaskModal } from '../../components/Modal/TaskModal'
import { pageStyles, sortPriority } from './common'
import { UPDATE_TASK } from '../../graphql/mutations'
import { ErrorText, Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import PriorityFlame from '../../assets/images/modal/priority'
import { capitalizeFirstLetter, renderMentionString, spacingUnit } from '../../utils/common'
import { Tag } from '../../components/Tag'
import { formatDueDate, redDate } from '../../utils/date'
import { GET_TASK_BY_ID, GET_GOAL_BY_ID } from '../../graphql/queries'
import { MyCarousel } from '../../storybook/stories/Carousel'
import LinkIcon from '../../assets/images/link'

const TaskPage = ({ navigation, route }) => {
  const user = useMe()
  const {
    task: initialTask,
    taskId
  } = route.params
  const [task, setTask] = useState(initialTask)
  const ownedByUser = (task && task.ownerId) === (user && user.id)
  const [modalVisible, setModalVisible] = useState(false)
  const [getTask, {
    data,
    loading,
    error
  }] = useLazyQuery(GET_TASK_BY_ID)
  const [updateTask] = useMutation(UPDATE_TASK, {
    update: (cache) => {
      cache.modify({
        fields: {
          getTasksFromProject(existingTasks=[]) {

          },
          getTasksFromUser() {

          },
          getUserActions() {

          }
        }
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
    
    if (task.goalId) {
      getGoalName({
        variables: {
          goalId: task.goalId
        }
      })
    }
  }, [data])


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
  const asks = task.additionalData && task.additionalData.relatedAskIds
  const goal = taskGoal && taskGoal.getGoalById

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <FullScreenTaskModal setModalVisible={setModalVisible} isVisible={modalVisible} setup={true} task={task} taskMutation={updateTask} />
      <Header rightButton={ownedByUser && {
        style: {
          borderWidth: 1,
          borderColor: Grey800
        },
        textColor: Grey800,
        text: 'Edit Profile',
        onPress: () => {
          setModalVisible(true)
        }
      }}/>
      <ScrollView style={pageStyles.container}>
        <Text style={pageStyles.title}>
          {renderMentionString({ content: task.name, navigation })}
        </Text>
        {
          task.detail &&
          <View>
            <Text style={pageStyles.paragraph}>
              {renderMentionString({ content: task.detail, navigation })}
            </Text>
          </View>
        }
        <View style={pageStyles.infoContainer}>
          {
              task.priority &&
              <View style={[pageStyles.priorityContainer, {
                backgroundColor: sortPriority(task.priority)
              }]}>
              <PriorityFlame color={White} style={{
                // marginLeft: spacingUnit,
                marginRight: spacingUnit
              }} />
              <RegularText color={White}>
                {capitalizeFirstLetter(task.priority)} Priority
              </RegularText>
              </View>
            }
            {
              task.project &&
              <Tag color={Purple} style={{
                marginRight: spacingUnit  
              }}>
                <RegularText color={White}>
                  {task.project && task.project.name}
                </RegularText>
              </Tag>
            }
            { task.dueDate &&
                <RegularText color={redDate(task.dueDate) ? Red400 : Grey450}>
                Due {formatDueDate(new Date(task.dueDate))}
              </RegularText>
            }
        </View>
        {
          goal &&
          <View style={{
            marginTop: spacingUnit
          }}>
            <RegularText color={Black}>
              From{` `}
                <RegularText onPress={() => navigation.navigate('Root', {
                screen: 'Profile',
                params: {
                  screen: 'GoalPage',
                  params: {
                    goal
                  }
                }
              })} color={Blue400} style={{
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
            <LinkIcon color={Grey800} style={{
              marginRight: spacingUnit
            }} />
            <Paragraph color={Blue400} style={pageStyles.link}>
              {task.additionalData.link}
            </Paragraph>
          </View>
        }
        <View style={pageStyles.imageContainer}>
        {
          images &&
          <MyCarousel data={images} images={true} passiveDotColor={Grey800} activeDotColor={Blue400}/>
        }
        </View>
        <View style={[pageStyles.subContainer]}>
        {
          asks &&
          <Pressable onPress={() => navigation.navigate('Root', {
            screen: 'Profile',
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
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default withAuth(TaskPage)