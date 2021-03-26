import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View, Image, StyleSheet, Dimensions, Platform, TextInput, TouchableOpacity, Pressable } from 'react-native'
import Modal from 'react-native-modal'

import { SafeImage } from '../../storybook/stories/Image'
import { spacingUnit } from '../../utils/common'

const ProfilePictureModal = ({ profilePicture, isVisible, setModalVisible }) => {
  return (
    <Modal
    isVisible={isVisible}
    backdropOpacity={0.9}
    onBackdropPress={() => {
      setModalVisible(false)
    }}
    >
      <SafeAreaView style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <SafeImage style={{
          width: spacingUnit * 40,
          height: spacingUnit * 40,
          borderRadius: spacingUnit * 20
        }}  src={profilePicture} />
      </SafeAreaView>
    </Modal>
  )
}

export default ProfilePictureModal
