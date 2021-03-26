import React, { useState } from 'react'
import { SafeAreaView, View, Pressable, TextInput, StyleSheet } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import Modal from 'react-native-modal'

import { Black, White } from '../../constants/Colors'
import { Title, RegularText, Subheading, Paragraph } from '../../storybook/stories/Text'
import { spacingUnit } from '../../utils/common'

import Neutral from '../../assets/images/emoji/neutral'
import Smile from '../../assets/images/emoji/smile'
import OpenMouthSmile from '../../assets/images/emoji/openMouthSmile'
import HeartEyes from '../../assets/images/emoji/heartEyes'
import Fire from '../../assets/images/fire'

const iconStyles = StyleSheet.create({
  emoji: {
    width: spacingUnit * 3,
    height: spacingUnit * 3
  }
})

const StreakIcon = ({ streak, iconStyle }) => {
  if (streak) {
    if (streak.currentStreak === 0) {
      return <Neutral style={{
        ...iconStyles.emoji,
        ...iconStyle
      }} />
    } else if (streak.currentStreak > 9) {
      return <Fire style={{
        ...iconStyles.emoji,
        ...iconStyle
      }} />
    } else if (streak.currentStreak > 6) {
      return <HeartEyes style={{
        ...iconStyles.emoji,
        ...iconStyle
      }} />
    } else if (streak.currentStreak > 3) {
      return <OpenMouthSmile style={{
        ...iconStyles.emoji,
        ...iconStyle
      }} />
    } else if (streak.currentStreak > 0) {
      return <Smile style={{
        ...iconStyles.emoji,
        ...iconStyle
      }} />
    }
  }
  return null
}

const StreakModal = ({ isVisible, streak, setStreakModal, viewing }) => {
  return (
    <Modal isVisible={isVisible}
    onBackdropPress={() => setStreakModal(false)}
    >
      <View style={{
        alignSelf: 'center',
        padding: spacingUnit * 4,
        backgroundColor: White,
        borderRadius: spacingUnit
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: spacingUnit * 2
        }}>
          <StreakIcon streak={streak} iconStyle={{
            width: spacingUnit * 4,
            height: spacingUnit * 4,
            marginRight: spacingUnit
          }} />
          <View>
        <Subheading color={Black} style={{
          fontFamily: 'Rubik SemiBold',
          fontSize: 22
        }}>
          {streak && streak.currentStreak}
        </Subheading>
        </View>
        </View>
        <Paragraph color={Black} style={{
          textAlign: 'center'
        }}>
          {
            viewing
            ?
            `This is the action streak of @${viewing}. This is extended by creating/completing a task or a goal daily. `
            :
            'Your action streak can be extended by creating/completing a task or a goal daily.'
          }
        </Paragraph>
      </View>
    </Modal>
  )
}

export const Streak = ({ streakContainerStyle, streak, viewing }) => {
  const [streakModal, setStreakModal] = useState(false)

  return (
    <>
    <StreakModal isVisible={streakModal} setStreakModal={setStreakModal} streak={streak} viewing={viewing} />
    <Pressable onPress={() => {
      setStreakModal(true)
    }} >
      <View style={{
        flexDirection: 'row',
        ...streakContainerStyle
      }}>
      <StreakIcon streak={streak} />
      <Paragraph color={Black} style={{
        fontFamily: 'Rubik SemiBold',
        marginLeft: spacingUnit * 0.75
      }}>
        {streak && streak.currentStreak}
      </Paragraph>
      </View>
    </Pressable>
    </>
  )
}