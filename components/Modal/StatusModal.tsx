import React, { useState, useCallback } from 'react'
import { ScrollView, View, Dimensions, StyleSheet, Pressable, TouchableWithoutFeedback, Keyboard } from 'react-native'
import Modal from 'react-native-modal'
import Clipboard from 'expo-clipboard'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { spacingUnit, renderMentionString } from '../../utils/common'
import { Grey300, Black, Grey150, White, Grey800, Blue500, Blue400 } from '../../constants/Colors'
import { ErrorText, Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import Checkmark from '../../assets/images/checkmark'
import { modalStyles } from './index'

export const StatusModal = ({ isVisible, setModalVisible, statusArr, setStatus, status, headerText, ...props }) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={() => setModalVisible(false)} {...props}>
      <View style={{
        ...modalStyles.fixedContainer,
        paddingBottom: spacingUnit * 2
      }}>
        <View style={{
          // justifyContent: centered ? 'center' : 'space-between',
          padding: spacingUnit * 2,
          paddingLeft: spacingUnit * 3,
        }}>
        {
          statusArr.map(statusElement => (
            <Pressable onPress={() => {
              setStatus(statusElement?.value)
              setModalVisible(false)
            }} style={{
              flexDirection: 'row',
              marginTop: spacingUnit,
              marginBottom: spacingUnit
            }}>
              <Paragraph color={Black} style={{
                ...(statusElement.value === status && {
                  fontFamily: 'Rubik SemiBold'
                })
              }}>
              {statusElement.label}
              </Paragraph>
              {
                statusElement.value === status &&
                <>
                <View style={{
                  flex: 1
                }} />
                <Checkmark color={Blue400} />
                </>
              }
            </Pressable>
          ))
        }
        </View>
      </View>
    </Modal>
  )
}