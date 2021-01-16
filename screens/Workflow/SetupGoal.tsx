import React, { useState } from 'react'
import { SafeAreaView, View, StyleSheet, Pressable } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'

import { Paragraph, Subheading } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import { ProfileTabParamList } from '../../types'
import { withAuth, useMe } from '../../components/withAuth'
import { Header } from '../../components/Header'
import { Grey400, White, Black, Grey500 } from '../../constants/Colors'
import { spacingUnit } from '../../utils/common'
import AddIcon from '../../assets/images/add-dark-button.svg'
import { SvgImage } from '../../storybook/stories/Image'
import GoalIcon from '../../assets/images/goal/standalone'
import { FullScreenGoalModal } from '../../components/Modal/GoalModal'

const setupGoalStyles = StyleSheet.create({
  setupGoalContainer: {
    alignItems: 'center',
    paddingRight: spacingUnit * 2,
    paddingLeft: spacingUnit * 2,
    marginTop: spacingUnit * 3
  }
})

function SetupGoalScreen({
  route,
  navigation
}: StackScreenProps<ProfileTabParamList, 'SetupGoal'>) {
  const {
    projectId
  } = route.params
  console.log('projectId for goal setup', projectId)
  const [modalVisible, setModalVisible] = useState(false)
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <Header />
      <FullScreenGoalModal setModalVisible={setModalVisible} isVisible={modalVisible} setup={true} projectId={projectId} />
      <View style={setupGoalStyles.setupGoalContainer}>
        <GoalIcon style={{
          width: spacingUnit * 8,
          height: spacingUnit * 8
        }} />
        <Subheading color={Black} style={{
          marginTop: spacingUnit * 2
        }}>
          Add goals
        </Subheading>
        <Paragraph color={Grey500} style={{
          textAlign: 'center',
          paddingLeft: spacingUnit,
          paddingRight: spacingUnit,
          marginTop: spacingUnit
        }}>
          Goals are measurable wins you want to achieve with this project
        </Paragraph>
        <Pressable onPress={() => setModalVisible(true)}>
          <SvgImage width={spacingUnit * 8} height={spacingUnit * 8} srcElement={AddIcon} style={{
            marginTop: spacingUnit * 3
          }} />
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default withAuth(SetupGoalScreen)