import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, ScrollView, Pressable } from 'react-native'
import { useLazyQuery, useMutation } from '@apollo/client'

import { withAuth, useMe } from '../../components/withAuth'
import { Header } from '../../components/Header'
import { Grey800, Purple, Red400, White, Black, Blue400, Grey450, Green400 } from '../../constants/Colors'
import { FullScreenTaskModal } from '../../components/Modal/TaskModal'
import { pageStyles, sortPriority, ReactionFeed } from './common'
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
    taskId,
    tab
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
    update: (cache, { data } ) => {
      if (data) {
        setTask(data && data.updateTask)
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
  const asks = task && task.relatedAskIds
  const goal = taskGoal && taskGoal.getGoalById

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <FullScreenTaskModal setModalVisible={setModalVisible} isVisible={modalVisible} setup={true} task={task} taskMutation={updateTask} />
      <Header title='Task' rightButton={ownedByUser && {
        style: {
          borderWidth: 1,
          borderColor: Grey800
        },
        textColor: Grey800,
        text: 'Edit Task',
        onPress: () => {
          setModalVisible(true)
        }
      }}/>
      <ScrollView style={pageStyles.container}>
        <Text style={pageStyles.title}>
          {renderMentionString({ content: task.name, navigation, tab })}
        </Text>
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
            task.status === 'completed' &&
            <Tag color={Green400} style={{
              marginRight: spacingUnit,
              marginTop: spacingUnit
            }}>
              <RegularText color={White}>
                Completed
              </RegularText>
            </Tag>
          }
          {
            task.status === 'archived' &&
            <Tag color={Grey300} style={{
              marginRight: spacingUnit,
              marginTop: spacingUnit
            }}>
              <RegularText color={Grey800}>
                Completed
              </RegularText>
          </Tag>
          }
          {
              task.priority &&
              <View style={[pageStyles.priorityContainer, {
                backgroundColor: sortPriority(task.priority),
                marginTop: spacingUnit
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
                marginRight: spacingUnit,
                marginTop: spacingUnit  
              }}>
                <RegularText color={White}>
                  {task.project && task.project.name}
                </RegularText>
              </Tag>
            }
            { task.dueDate &&
            <View style={{
              marginTop: spacingUnit
            }}>
                <RegularText color={redDate(task.dueDate) ? Red400 : Grey450}>
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
            <RegularText color={Black}>
              From{` `}
                <RegularText onPress={() => navigation.navigate('Root', {
                screen: tab || 'Profile',
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
        <ReactionFeed type={'task'} objId={task.id} user={user} tab={tab} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default withAuth(TaskPage)