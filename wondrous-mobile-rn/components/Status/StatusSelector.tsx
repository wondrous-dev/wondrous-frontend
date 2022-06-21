


import React, { useState } from 'react'
import { Pressable, View } from 'react-native'

import { Black } from '../../constants/Colors'
import { RegularText } from '../../storybook/stories/Text'
import { spacingUnit } from '../../utils/common'
import DownCaret from '../../assets/images/down-caret'
import { StatusModal } from '../Modal/StatusModal'

export const STATUS_ARR = [
  {
    label: 'To do',
    value: 'created',
  },
  {
    label: 'Completed',
    value: 'completed'
  },
  {
    label: 'Archived',
    value: 'archived'
  }
]

export const StatusSelector = ({ setStatus, status, section, style, includeArchived=true }) => {
  let text = 'goals'
  if (section === 'asks') {
    text = 'asks'
  } else if (section === 'tasks') {
    text = 'tasks'
  }
  const statusMap = {
    'created': 'Incomplete',
    'completed': 'Completed',
    'archived': 'Archived'
  }

  const [modalVisible, setModalVisible] = useState(false)
  return (
      <View style={{
        paddingLeft: spacingUnit * 2,
        paddingRight: spacingUnit * 2,
        marginBottom: spacingUnit * 2,
        ...style
      }}>
        <StatusModal isVisible={modalVisible} setModalVisible={setModalVisible} statusArr={ includeArchived ? STATUS_ARR : STATUS_ARR.slice(0, 2)} setStatus={setStatus} status={status} headerText={text} />
        <View style={[{
          marginTop: spacingUnit * 3,
          flexDirection: 'row'
        }]}>
        <Pressable onPress={() => setModalVisible(true)} style={{
          borderWidth: 1,
          borderColor: Black,
          padding: spacingUnit,
          paddingLeft: spacingUnit * 2,
          paddingRight: spacingUnit,
          borderRadius: spacingUnit * 2,
          flexDirection: 'row'
        }}>
          <RegularText color={Black}>
            {statusMap[status]} {text}
          </RegularText>
          <DownCaret />
        </Pressable>
        </View>
      </View>
  )
}