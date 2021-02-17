import React, { useRef, useState } from 'react'
import { SafeAreaView, View, StyleSheet, Pressable, Dimensions, FlatList } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useQuery, useMutation } from '@apollo/client'

import { Paragraph, Subheading } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import { ProfileTabParamList } from '../../types'
import { withAuth, useMe } from '../../components/withAuth'
import { Header } from '../../components/Header'
import { Grey400, White, Black, Grey500, Blue500 } from '../../constants/Colors'
import { spacingUnit, getLocale } from '../../utils/common'
import AddIcon from '../../assets/images/add-dark-button.svg'
import { SvgImage } from '../../storybook/stories/Image'
import TaskIcon from '../../assets/images/task/standalone'
import { FullScreenTaskModal } from '../../components/Modal/TaskModal'
import { CREATE_TASK } from '../../graphql/mutations'
import { GET_TASKS_FROM_PROJECT, GET_USER_STREAK } from '../../graphql/queries'
import { Card } from '../../storybook/stories/Card'
import { WHOAMI } from '../../graphql/queries'
import { updateUsageProgress } from '../../utils/apollo'

const setupTaskStyles = StyleSheet.create({
  setupTaskContainer: {
    alignItems: 'center',
    paddingRight: spacingUnit * 2,
    paddingLeft: spacingUnit * 2,
    marginTop: spacingUnit * 3
  }
})


function SetupTaskScreen({
  route,
  navigation
}: StackScreenProps<ProfileTabParamList, 'SetupTask'>) {
  const {
    projectId
  } = route.params
  const user = useMe()
  const { data: taskData, loading, error } = useQuery(GET_TASKS_FROM_PROJECT, {
    variables: {
      projectId
    }
  })
  const [createTask] = useMutation(CREATE_TASK, {
    refetchQueries: [
      { query: GET_USER_STREAK, variables: {
        userId: user && user.id
      } }
    ],
    update(cache, { data }) {
      cache.modify({
          fields: {
              getTasksFromProject(existingTasks=[]) {
                return [
                  data.createTask,
                  ...existingTasks
                ]
              },
              users() {
                return updateUsageProgress({ user, newKey: 'taskCreated'})
              }
          }
      })
    }
  })

  const [modalVisible, setModalVisible] = useState(false)
  const taskArray = taskData && taskData.getTasksFromProject
  const itemRefs = useRef(new Map())

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <Header rightButton={taskArray && taskArray.length > 0 && {
        color: Blue500,
        text: 'Continue',
        onPress: () => {
          navigation.navigate('Root', {
            screen: 'Profile',
            params: {
              screen: 'SetupAsk',
              params: {
                projectId
              }
            }
          })
        }
      }} />
      <FullScreenTaskModal firstTime={true} setModalVisible={setModalVisible} isVisible={modalVisible} projectId={projectId} taskMutation={createTask} />
      <View style={setupTaskStyles.setupTaskContainer}>
        <TaskIcon style={{
          width: spacingUnit * 6,
          height: spacingUnit * 6
        }} />
        <Subheading color={Black} style={{
          marginTop: spacingUnit * 2
        }}>
          Add tasks
        </Subheading>
        <Paragraph color={Grey500} style={{
          textAlign: 'center',
          paddingLeft: spacingUnit * 1.25,
          paddingRight: spacingUnit * 1.25,
          marginTop: spacingUnit
        }}>
          Tasks are small units of work that can be completed in a day
        </Paragraph>
        <Pressable onPress={() => setModalVisible(true)}>
          <SvgImage width={spacingUnit * 8} height={spacingUnit * 8} srcElement={AddIcon} style={{
            marginTop: spacingUnit * 3
          }} />
        </Pressable>
        <View>
          {/* <CardList /> */}
          <FlatList
            data={taskArray}
            renderItem={({ item }) => <Card type='task' navigation={navigation} iconSize={spacingUnit * 3} icon={TaskIcon} profilePicture={user && user.profilePicture} item={item} swipeEnabled={false} width={Dimensions.get('window').width} itemRefs={itemRefs && itemRefs.current} key={item && item.name} />}
            style={{
              marginBottom: spacingUnit * 65
            }}
          >

          </FlatList>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default withAuth(SetupTaskScreen)