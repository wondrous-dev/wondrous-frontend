import * as React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { SafeAreaView, StyleSheet, View } from 'react-native'

import { withAuth } from '../../components/withAuth'
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
  return (
    <SafeAreaView style={{
      backgroundColor: White,
      flex: 1
    }}>
      <Header />
      <View style={addStyles.container}>
      <Subheading color={Black}>
        Launch Pad
      </Subheading>
      <Paragraph color={Black} style={addStyles.paragraph}>
        What do you want to add?
      </Paragraph>
      <View style={addStyles.choiceContainer}>
        <View style={addStyles.choiceBox}>
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
        </View>
        <View style={addStyles.choiceBox}>
        <GoalIcon style={addStyles.choiceImage} />
        <Paragraph color={Black} style={addStyles.choiceText}>
          Goal
        </Paragraph>
        </View>
      </View>
      <View style={addStyles.choiceContainer}>
        <View style={addStyles.choiceBox}>
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
        </View>
        <View style={addStyles.choiceBox}>
          <AskIcon style={addStyles.choiceImage} />
        <Paragraph color={Black} style={{
          ...addStyles.choiceText,
          marginTop: spacingUnit * 1.5
        }}>
          Ask
        </Paragraph>
        </View>
      </View>
      <View style={addStyles.choiceContainer}>
        <View style={addStyles.choiceBox}>
          <PostIcon style={addStyles.choiceImage} />
          <Paragraph color={Black} style={addStyles.choiceText}>
            Post
          </Paragraph>
        </View>
      </View>
      </View>
    </SafeAreaView>
  )
}

export default withAuth(AddScreen)