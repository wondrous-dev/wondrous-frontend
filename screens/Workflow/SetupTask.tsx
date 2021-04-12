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
import AddIcon from '../../assets/images/add-dark-button'
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
    marginTop: spacingUnit * 3,
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
  const taskArray = taskData && taskData.getTasksFromProject
  const [createTask] = useMutation(CREATE_TASK, {
    refetchQueries: [
      { query: GET_USER_STREAK, variables: {
        userId: user && user.id
      } }
    ],
    update(cache, { data }) {
      cache.modify({
          fields: {
              getTasksFromProject() {
                return [
                  data.createTask,
                  ...taskArray
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
          navigation.push('Root', {
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
          {/* <CardList /> */}
          <FlatList
            data={taskArray}
            ListHeaderComponent={() => (
              <View style={{
                alignItems: 'center'
              }}>
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
            Tasks are small units of work that can be finished in a day
          </Paragraph>
          <Pressable onPress={() => setModalVisible(true)}>
          <AddIcon style={{
                  marginTop: spacingUnit * 3,
                  width: spacingUnit * 8,
                  height: spacingUnit * 8
                }} />
          </Pressable>
              </View>
            )}
            renderItem={({ item }) => <Card type='task' route={route} navigation={navigation} iconSize={spacingUnit * 3} icon={TaskIcon} profilePicture={user && (user.thumbnailPicture || user.profilePicture)} item={item} swipeEnabled={false} itemRefs={itemRefs && itemRefs.current} key={item && item.name} />}
            ListFooterComponent={<View style={{ marginBottom: spacingUnit * 3 }} />}
          >

          </FlatList>
        </View>
    </SafeAreaView>
  )
}

export default withAuth(SetupTaskScreen)