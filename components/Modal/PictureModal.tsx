import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View, Image, StyleSheet, Dimensions, Platform, TextInput, TouchableOpacity, Pressable } from 'react-native'
import Modal from 'react-native-modal'
import Cancel from '../../assets/images/cancel'
import { White } from '../../constants/Colors'

import { SafeImage } from '../../storybook/stories/Image'
import { spacingUnit } from '../../utils/common'

const PictureModal = ({ picture, isVisible, setModalVisible }) => {
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
        <Cancel color={White} style={{
          marginBottom: spacingUnit,
          width: spacingUnit * 4,
          height: spacingUnit * 4,
          alignSelf: 'flex-start'
        }} onPress={() => setModalVisible(false)}/>
        <SafeImage style={{
          width: Dimensions.get('window').width - (spacingUnit * 4),
          height: Dimensions.get('window').height - (spacingUnit * 25),
          borderRadius: spacingUnit * 0.5
        }}  src={picture} />
      </SafeAreaView>
    </Modal>
  )
}

export default PictureModal
