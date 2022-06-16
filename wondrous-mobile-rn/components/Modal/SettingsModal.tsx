import React from 'react';
import { View, Pressable } from 'react-native';

import { Paragraph } from '../../storybook/stories/Text';
import { FlexRowContentModal } from '.';
import Logout from '../../assets/images/logout';
import { spacingUnit } from '../../utils/common';
import { useAuth } from '../../session';

export const SettingsModal = ({ isVisible, setModalVisible }) => {

  const { signOut } = useAuth()

  return (
    <FlexRowContentModal
      headerText='Settings'
      setModalVisible={setModalVisible}
      isVisible={isVisible}
    >
      <View />
      <Pressable onPress={() => {
        signOut()
        setModalVisible(false)
      }}>
      <View style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Logout />
        <Paragraph style={{
          marginTop: spacingUnit * 0.5
        }}>
          Log out
        </Paragraph>
      </View>
      </Pressable>
      <View />
    </FlexRowContentModal>
  )
}