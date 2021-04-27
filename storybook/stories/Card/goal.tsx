import React, { useEffect, useState, useRef } from 'react'
import { 
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
  UIManager,
  Pressable,
  Dimensions,
} from 'react-native'
import { useMutation, useLazyQuery, useQuery } from '@apollo/client'
import { Bar } from 'react-native-progress'

import { Orange, Blue400, Green400, White, Grey400, Grey450, Purple, Red400, Yellow300, Grey300, Grey350, Grey800, Blue500, Black, Grey200, Grey100 } from '../../../constants/Colors'
import CompleteSvg from '../../../assets/images/complete'
import ArchiveSvg from '../../../assets/images/archive'
import { RegularText, TinyText, Paragraph } from '../Text'
import { formatDueDate, redDate, sortByDueDate } from '../../../utils/date'
import { spacingUnit, renderMentionString } from '../../../utils/common'
import PriorityFlame from '../../../assets/images/modal/priority'
import { FullScreenGoalModal } from '../../../components/Modal/GoalModal'
import { Tag } from '../../../components/Tag'
import { useNavigation, useRoute } from '@react-navigation/native'
import apollo from '../../../services/apollo'
import { UPDATE_GOAL, UPDATE_TASK, UPDATE_ASK, CREATE_TASK } from '../../../graphql/mutations'
import { GetReviewIcon } from '../../../screens/Review/utils'
import { format } from 'date-fns'
import RightCaret from '../../../assets/images/right-caret'
import { styles } from './styles'
import { GET_TASKS_FROM_GOAL } from '../../../graphql/queries'
import TaskIcon from '../../../assets/images/task/standalone'
import { Card } from './index'
import { useMe } from '../../../components/withAuth'
import { FullScreenTaskModal } from '../../../components/Modal/TaskModal'

export const GoalCard = ({
  icon,
  iconSize,
  type,
  redirect,
  redirectParams,
  route,
  item,
  onSwipeRight,
  onSwipeLeft,
  swipeEnabled,
}) => {
  const user = useMe()
  const [status, setStatus] = useState('created')
  const navigation = useNavigation()
  const [taskModalVisible, setTaskModalVisible] = useState(false)
  const [clicked, setClicked] = useState(false)
  const Icon = icon
  const name = item?.name
  const dueDate = item?.dueDate
  const projectName = item?.project?.name
  const description = item?.detail
  const priority = item?.priority
  const completedAt = item?.completedAt
  const taskCount = item?.taskCount
  const completedTaskCount = item?.completedTaskCount
  const [tasks, setTasks] = useState(item?.tasks)
  const itemRefs = useRef(new Map())
  const [createTask] = useMutation(CREATE_TASK, {
    onCompleted: () => {
      setTasks(sortByDueDate([...tasks, createTask]))
    }
  })

  const [getTasksFromGoal, {
    data: goalTasksData
  }] = useLazyQuery(GET_TASKS_FROM_GOAL, {
    fetchPolicy: 'network-only',
    onCompleted: (goalTasksData) => {
      console.log('what the fuck')
      if (goalTasksData) {
        setTasks(goalTasksData?.getTasksFromGoal)
      }
    }
  })

  const sortPriority = () => {
    switch(priority) {
      case 'high':
        return Red400
      case 'medium':
        return Yellow300
      case 'low':
        return Blue400
    }
  }

  const isRedDate = redDate(dueDate)

  useEffect(() => {
    if (item?.tasks) {
      setTasks(item?.tasks)
    }
  }, [item?.tasks])
  let progress = 0
  if (completedTaskCount && completedTaskCount !== 0) {
    progress = completedTaskCount /  taskCount
  }

  const showGoals = () => {
    if (taskCount) {
      if (!clicked) {
        getTasksFromGoal({
          variables: {
            goalId: item?.id,
            status
          }
        })
      }
      setClicked(!clicked)
    }
  }
  return (
      <View>
      <FullScreenTaskModal setModalVisible={setTaskModalVisible} isVisible={taskModalVisible} taskMutation={createTask} goalId={item?.id} projectId={item?.projectId} />

        <TouchableWithoutFeedback onPress={showGoals}>
        <View style={[styles.row, { 
          borderRadius: spacingUnit,
          flexDirection: 'column',
          alignItems: 'flex-start',
          backgroundColor: clicked ? Orange : White,
          justifyContent: 'space-between',
          ...(clicked && {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0
          })
        }]}>
            <View style={[styles.topInfoContainer, styles.flex]}>
              {/* {
                profilePicture && 
                <SafeImage src={profilePicture} style={styles.profilePicture} />
              } */}
              <View style={{
                marginLeft: -4
              }}>
              {
                icon &&
                <Icon style={{
                  width: iconSize,
                  height: iconSize
                }} />

              }
              </View>
              <View>
              <Text style={[styles.text, {
                marginLeft: spacingUnit,
                paddingRight: 4,
                color: clicked ? White : Black
              }]}>{renderMentionString({ content: name, textStyle: styles.text, navigation, tab: route && route.params && route.params.tab })}</Text>
              </View>
            </View>
            {
              description &&
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: spacingUnit,
                marginBottom: spacingUnit,
                flex: 1
              }}>
                <Paragraph color={clicked ? White : Grey800} style={{
                  fontSize: 16
                }}>
                  {renderMentionString({ content: description, textStyle: {
                    fontSize: 16,
                    color: clicked ? White : Grey800
                  }, navigation, tab: route && route.params && route.params.tab })}
                </Paragraph>
              </View>
            }
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: spacingUnit,
              flex: 1
            }}>
              <View style={[styles.bottomInfoContainer, {
                flex: 1,
                flexWrap: 'wrap'
              }]}>
                {
                  priority &&
                  <PriorityFlame color={sortPriority()} style={{
                    // marginLeft: spacingUnit,
                    marginRight: spacingUnit * 1.5
                  }} />
                }
                {
                  projectName &&
                  <Tag color={Purple} style={{
                    marginRight: spacingUnit,
                    marginBottom: spacingUnit
                  }}>
                    <RegularText color={White}>
                      {projectName}
                    </RegularText>
                  </Tag>
                }
                {dueDate && !completedAt &&  
                    <RegularText color={isRedDate ? Red400 : Grey450} style={styles.dueText}>
                    Due {formatDueDate(new Date(dueDate))}
                  </RegularText>
                }
              </View>
              <View>
                {
                  item?.status === 'completed' &&
                  <Tag color={Green400} style={{
                  }}>
                    <RegularText color={White}>
                      Completed {formatDueDate(new Date(completedAt))}
                    </RegularText>
                  </Tag>
                }
                {
                  item?.status === 'archived' &&
                  <Tag color={Grey300}>
                    <RegularText color={Grey800}>
                      Archived
                    </RegularText>
                  </Tag>
                }
              </View>
            </View>
            {
              taskCount !== undefined && completedTaskCount !== undefined &&
              <View style={{
                flex: 1,
                width: '100%',
                marginTop: spacingUnit,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
              <View>
                <Bar width={Dimensions.get('window').width - (32 * 4)} progress={progress} color={Blue500} height={spacingUnit * 1.25} unfilledColor={Grey350} borderWidth={0} />
              </View>
              <RegularText color={clicked ? White : Grey800} style={{
                  marginLeft: spacingUnit
                }}>
                  {completedTaskCount || 0}/{taskCount || 0}
                </RegularText>
              </View>
            }
            {
              taskCount 
              ?
              <Pressable style={{
                marginTop: spacingUnit,
                flex: 1,
                alignContent: 'center',
                alignSelf: 'center'
              }} onPress={showGoals}>
                <Paragraph color={clicked ? White : Grey800} style={{
                  alignSelf: 'center'
                }}>
                  {
                    clicked
                    ?
                    ''
                    :
                    'View all tasks'
                  }
                </Paragraph>
              </Pressable>
              :
              (
                <>
                {
                  completedAt
                  ?
                  null
                  :
                  <Pressable onPress={() => setTaskModalVisible(true)} style={styles.addTask}>
                  <Paragraph color={Blue400}>
                    +{` `}
                  </Paragraph>
                    <Paragraph color={Blue400}>
                      Add task
                    </Paragraph>
                </Pressable>
                }
                </>
              )
            }
          </View>
      </TouchableWithoutFeedback>
      {
        clicked &&
        <View style={{
          borderWidth: 1,
          borderColor: Grey400,
          borderTopWidth: 0,
          marginTop: -spacingUnit * 2,
          borderRadius: spacingUnit,
          marginBottom: spacingUnit * 2,
          backgroundColor: Grey100,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0
        }}>
           <Pressable onPress={() => setTaskModalVisible(true)} style={{
             ...styles.addTask,
             alignSelf: 'flex-start',
             marginLeft: spacingUnit * 2
           }}>
                <Paragraph color={Blue400}>
                  +{` `}
                </Paragraph>
                  <Paragraph color={Blue400}>
                    Add task
                  </Paragraph>
            </Pressable>
          <View style={{
            marginTop: spacingUnit
          }}>
          {
            tasks && tasks?.map(task => {
              const icon = TaskIcon
              const iconSize = spacingUnit * 3
              const redirect = 'Root'
              const redirectParams = {
                screen: route?.params?.tab || 'Profile',
                params: {
                  screen: 'TaskPage',
                  params: {
                    task: item
                  }
                }
              }
              const newOnSwipeRight = () => {
                const newTasks = tasks.filter(existingTask => existingTask?.id !== task?.id)
                setTasks(newTasks)
                onSwipeRight(task, 'task')
              }
              const newOnSwipeLeft = () => {
                const newTasks = tasks.filter(existingTask => existingTask?.id !== task?.id)
                setTasks(newTasks)
                onSwipeLeft(task, 'task')
              }
              return (
                <View key={task?.id} style={{
                  flex: 1,
                  marginLeft: spacingUnit * 2,
                  marginRight: spacingUnit * 2
                }}>
                  <Card
                    key={task?.id}
                    navigation={navigation}
                    route={route}
                    redirect={redirect}
                    redirectParams={redirectParams}
                    type={type}
                    icon={icon}
                    iconSize={iconSize}
                    profilePicture={user && (user.thumbnailPicture || user.profilePicture)}
                    item={task}
                    swipeEnabled={swipeEnabled}
                    itemRefs={itemRefs && itemRefs.current}
                    onSwipeRight={newOnSwipeRight}
                    onSwipeLeft={newOnSwipeLeft}
                  />
                </View>
              )
            })
          }
          </View>
        </View>
      }

      </View>
  )
}
