import React from 'react'
import { View, Pressable } from 'react-native'
import Modal from 'react-native-modal'

import palette from 'theme/palette'
import { spacingUnit } from '../../utils/common'
import { Paragraph } from '../../storybook/stories/Text'
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
            <Pressable 
            key={statusElement?.value}
            onPress={() => {
              setStatus(statusElement?.value)
              setModalVisible(false)
            }} style={{
              flexDirection: 'row',
              marginTop: spacingUnit,
              marginBottom: spacingUnit
            }}>
              <Paragraph color={palette.black} style={{
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
                <Checkmark color={palette.blue400} />
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