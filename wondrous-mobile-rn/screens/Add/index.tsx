import React, { useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { Pressable, SafeAreaView, StyleSheet, ScrollView, View } from 'react-native'
import { useMutation } from '@apollo/client'

import { useMe, withAuth } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { Black, Grey300, White } from '../../constants/Colors'
import { Paragraph, Subheading } from '../../storybook/stories/Text'
import { spacingUnit } from '../../utils/common'
import GoalIcon from '../../assets/images/actions/goal'
import TaskIcon from '../../assets/images/actions/task'
import AskIcon from '../../assets/images/ask/standalone'
import ProjectIcon from '../../assets/images/actions/project'
import PostIcon from '../../assets/images/actions/post'
import AddFriendIcon from '../../assets/images/actions/add_friend'
import { SvgImage } from '../../storybook/stories/Image'
import { FullScreenGoalModal } from '../../components/Modal//GoalModal'
import { FullScreenAskModal } from '../../components/Modal/AskModal'
import { FullScreenTaskModal } from '../../components/Modal/TaskModal'
import { FullScreenPostModal } from '../../components/Modal/PostModal'

import { CREATE_ASK, CREATE_GOAL, CREATE_TASK } from '../../graphql/mutations'
import { CREATE_POST } from '../../graphql/mutations/post'
import Toast from 'react-native-toast-message'
import { GET_USER_STREAK, WHOAMI } from '../../graphql/queries'
import { updateUsageProgress } from '../../utils/apollo'
import { ContactsModal } from '../Profile/ContactsModal'

const addStyles = StyleSheet.create({
  container: {
    marginTop: spacingUnit * 3,
    paddingLeft: spacingUnit * 2,
    paddingRight: spacingUnit * 2
  },
  paragraph: {
    marginTop: spacingUnit,
    marginBottom: spacingUnit * 3
  },
  choiceContainer: {
    marginTop: spacingUnit * 2,
    flexDirection: 'row'
  },
  choiceBox: {
    flex: 1,
    borderColor: Grey300,
    borderRadius: 8,
    borderWidth: 1,
    padding: spacingUnit * 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacingUnit * 2
  },
  choiceText: {
    marginTop: spacingUnit * 1.5,
    fontFamily: 'Rubik SemiBold'
  },
  choiceImage: {
    width: spacingUnit * 6,
    height: spacingUnit * 6
  }
})

function AddScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'Add'>) {
  const [goalModalVisible, setGoalModalVisible] = useState(false)
  const [taskModalVisible, setTaskModalVisible] = useState(false)
  const [askModalVisible, setAskModalVisible] = useState(false)
  const [postModalVisible, setPostModalVisible] = useState(false)
  const [contactsModal, setContactsModal] = useState(false)
  const user = useMe()

  const [createGoal] = useMutation(CREATE_GOAL, {
    refetchQueries: [
      { query: GET_USER_STREAK,
      variables: {
        userId: user && user.id
      } }
    ],
    update(cache, { data }) {
      Toast.show({
        text1: 'Goal successfully created',
        position: 'bottom',
      })
    }
  })
  const [createTask] = useMutation(CREATE_TASK, {
    refetchQueries: [
      { query: GET_USER_STREAK,
      variables: {
        userId: user && user.id
      } }
    ],
    update(cache, { data }) {
      Toast.show({
        text1: 'Task successfully created',
        position: 'bottom',
      })
    }
  })


  const [createAsk, { data: createAskData, loading: createAskLoading, error: createAskError }] = useMutation(CREATE_ASK, {
    update(cache, { data }) {
      Toast.show({
        text1: 'Ask successfully created',
        position: 'bottom'
      })
      cache.modify({
          fields: {
              users() {
                return updateUsageProgress({ user, newKey: 'askCreated'})
              }
          }
      })
    }
  })

  const [createPost] = useMutation(CREATE_POST, {
    update(cache) {
      Toast.show({
        text1: 'Post successfully created',
        position: 'bottom'
      })
    }
  })

  return (
    <SafeAreaView style={{
      backgroundColor: White,
      flex: 1
    }}>
      <ScrollView>
        <Header />
        <FullScreenGoalModal setModalVisible={setGoalModalVisible} isVisible={goalModalVisible} goalMutation={createGoal} />
        <FullScreenTaskModal setModalVisible={setTaskModalVisible} isVisible={taskModalVisible} taskMutation={createTask} />
        <FullScreenAskModal setModalVisible={setAskModalVisible} isVisible={askModalVisible} askMutation={createAsk} />
        <FullScreenPostModal setModalVisible={setPostModalVisible} isVisible={postModalVisible} postMutation={createPost} />
        <ContactsModal isVisible={contactsModal} setModalVisible={setContactsModal} />
        <View style={addStyles.container}>
        <Subheading color={Black}>
          Launch Pad
        </Subheading>
        <Paragraph color={Black} style={addStyles.paragraph}>
          What do you want to create?
        </Paragraph>
        <View style={addStyles.choiceContainer}>
          <Pressable style={addStyles.choiceBox} onPress={() => navigation.push('FirstProjectSetup', {
            setup: false,
            noGoingBack: true
          })}>
          <ProjectIcon
            style={addStyles.choiceImage}
          />
          <Paragraph color={Black} style={{
            ...addStyles.choiceText
          }}>
            Project
          </Paragraph>
          </Pressable>
          <Pressable style={addStyles.choiceBox} onPress={() => setGoalModalVisible(true)}>
          <GoalIcon style={addStyles.choiceImage} />
          <Paragraph color={Black} style={addStyles.choiceText}>
            Goal
          </Paragraph>
          </Pressable>
        </View>
        <View style={addStyles.choiceContainer}>
          <Pressable style={addStyles.choiceBox} onPress={() => setTaskModalVisible(true)}>
          <TaskIcon
            style={{
              width: spacingUnit * 6,
              height: spacingUnit * 6
            }} />
          <Paragraph color={Black} style={{
            ...addStyles.choiceText,
            marginTop: spacingUnit * 1.5
          }}>
            Task
          </Paragraph>
          </Pressable>
          <Pressable style={addStyles.choiceBox} onPress={() => setAskModalVisible(true)}>
            <AskIcon style={addStyles.choiceImage} />
          <Paragraph color={Black} style={{
            ...addStyles.choiceText,
            marginTop: spacingUnit * 1.5
          }}>
            Ask
          </Paragraph>
          </Pressable>
        </View>
        <View style={addStyles.choiceContainer}>
          <Pressable style={addStyles.choiceBox} onPress={() => setPostModalVisible(true)}>
            <PostIcon style={addStyles.choiceImage} />
            <Paragraph color={Black} style={addStyles.choiceText}>
              Post
            </Paragraph>
          </Pressable>
          <Pressable style={addStyles.choiceBox} onPress={() => setContactsModal(true)}>
          <AddFriendIcon style={addStyles.choiceImage} />
            <Paragraph color={Black} style={addStyles.choiceText}>
              Add friends
            </Paragraph>
          </Pressable>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default withAuth(AddScreen)