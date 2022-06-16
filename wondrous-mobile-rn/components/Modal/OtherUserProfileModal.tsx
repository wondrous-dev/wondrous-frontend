import React from 'react'
import { View, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { Paragraph } from '../../storybook/stories/Text'
import { FlexRowContentModal } from '.'
import { palette.grey800, palette.red400 } from '../../constants/Colors'
import Logout from '../../assets/images/logout'
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