import React, { useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { Pressable, SafeAreaView, StyleSheet, View } from 'react-native'
import { useMutation } from '@apollo/client'

import { useMe, withAuth } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { Black, Grey300, White } from '../../constants/Colors'
import { Paragraph, Subheading } from '../../storybook/stories/Text'
import { spacingUnit } from '../../utils/common'
import GoalIcon from '../../assets/images/actions/goal'
import TaskIcon from '../../assets/images/actions/task.svg'
import AskIcon from '../../assets/images/ask/standalone'
import ProjectIcon from '../../assets/images/actions/project'
import PostIcon from '../../assets/images/actions/post'
import { SvgImage } from '../../storybook/stories/Image'
import { FullScreenGoalModal } from '../../components/Modal//GoalModal'
import { CREATE_ASK, CREATE_GOAL, CREATE_TASK } from '../../graphql/mutations'

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
  const [goalModalVisible, setGolModalVisible] = useState(false)
  const user = useMe()
  const [createGoal] = useMutation(CREATE_GOAL, {
    update(cache, { data }) {
      cache.modify({
          fields: {
              getGoalsFromProject(existingGoals=[]) {
                return [
                  data.createGoal,
                  ...existingGoals
                ]
              },
              users() {
                if ((user && !user.usageProgress) || (user && user.usageProgress && !user.usageProgress.goalCreated)) {
                  const newUsageProgress = user.usageProgress ? {
                    ...user.usageProgress,
                    goalCreated: true
                  } : {
                    goalCreated: true
                  }
                  return [{
                    ...user,
                    usageProgress: newUsageProgress
                  }]
                }
              }
          }
      })
    }
  })
  const [createTask] = useMutation(CREATE_TASK)
  const [createAsk] = useMutation(CREATE_ASK)
  return (
    <SafeAreaView style={{
      backgroundColor: White,
      flex: 1
    }}>
      <Header />
      <FullScreenGoalModal firstTime={true} setModalVisible={setGolModalVisible} isVisible={goalModalVisible} goalMutation={createGoal} />
      <View style={addStyles.container}>
      <Subheading color={Black}>
        Launch Pad
      </Subheading>
      <Paragraph color={Black} style={addStyles.paragraph}>
        What do you want to create?
      </Paragraph>
      <View style={addStyles.choiceContainer}>
        <Pressable style={addStyles.choiceBox} onPress={() => navigation.navigate('FirstProjectSetup')}>
        <ProjectIcon
          style={{
            width: spacingUnit * 6,
            height: spacingUnit * 6,

          }}
        />
        <Paragraph color={Black} style={{
          ...addStyles.choiceText
        }}>
          Project
        </Paragraph>
        </Pressable>
        <Pressable style={addStyles.choiceBox}>
        <GoalIcon style={addStyles.choiceImage} />
        <Paragraph color={Black} style={addStyles.choiceText}>
          Goal
        </Paragraph>
        </Pressable>
      </View>
      <View style={addStyles.choiceContainer}>
        <Pressable style={addStyles.choiceBox}>
        <SvgImage
          width={spacingUnit * 6}
          height={spacingUnit * 6}
          srcElement={TaskIcon}
        />
        <Paragraph color={Black} style={{
          ...addStyles.choiceText,
          marginTop: spacingUnit * 1.5
        }}>
          Task
        </Paragraph>
        </Pressable>
        <Pressable style={addStyles.choiceBox}>
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
        <Pressable style={addStyles.choiceBox}>
          <PostIcon style={addStyles.choiceImage} />
          <Paragraph color={Black} style={addStyles.choiceText}>
            Post
          </Paragraph>
        </Pressable>
      </View>
      </View>
    </SafeAreaView>
  )
}

export default withAuth(AddScreen)