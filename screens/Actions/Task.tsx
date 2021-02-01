import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, ScrollView } from 'react-native'
import { useLazyQuery, useMutation } from '@apollo/client'

import { withAuth, useMe } from '../../components/withAuth'
import { Header } from '../../components/Header'
import { Grey800, Purple, Red400, White, Yellow300, Blue400, Grey450 } from '../../constants/Colors'
import { FullScreenTaskModal } from '../../components/Modal/TaskModal'
import { pageStyles, sortPriority } from './common'
import { UPDATE_TASK } from '../../graphql/mutations'
import { ErrorText, Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import PriorityFlame from '../../assets/images/modal/priority'
import { capitalizeFirstLetter, renderMentionString, spacingUnit } from '../../utils/common'
import { Tag } from '../../components/Tag'
import { formatDueDate, redDate } from '../../utils/date'
import { GET_TASK_BY_ID } from '../../graphql/queries'
import { MyCarousel } from '../../storybook/stories/Carousel'
import { LinkIcon } from '../../assets/images/link'

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

          }
        }
      })
    }
  })

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
          task.description &&
          <View>
            <Text style={pageStyles.paragraph}>
              {renderMentionString({content: task.description, navigation })}
            </Text>
          </View>
        }
        {
          task.additionalData && goal.additionalData.link &&
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
      </ScrollView>
    </SafeAreaView>
  )
}

export default withAuth(TaskPage)