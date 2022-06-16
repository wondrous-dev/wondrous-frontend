import React from 'react'
import { View, Pressable } from 'react-native'

import { Paragraph } from '../../storybook/stories/Text'
import { FlexRowContentModal } from '.'
import palette from 'theme/palette'
import { spacingUnit } from '../../utils/common'

export const OtherUserProfileModal = ({ isVisible, setModalVisible, headerText, blockUser }) => {
  return (
    <FlexRowContentModal
    headerText={headerText}
    setModalVisible={setModalVisible}
    isVisible={isVisible}
    flexDirection='column'
    >
      <View />
      <Pressable onPress={() => {
        blockUser()
        setModalVisible(false)
      }}>
      <View style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Paragraph style={{
          marginTop: spacingUnit * 0.5
        }} color={palette.red400}>
          Block user
        </Paragraph>
      </View>
      </Pressable>
      <View />
    </FlexRowContentModal>
  )
}