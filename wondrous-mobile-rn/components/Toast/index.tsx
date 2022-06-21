import React from 'react'
import { View } from 'react-native'
import Toast, { BaseToast } from 'react-native-toast-message'

import { Black, Green400, Grey800 } from '../../constants/Colors'
import { Paragraph } from '../../storybook/stories/Text'
import { spacingUnit } from '../../utils/common'
import Cancel from '../../assets/images/cancel'

export const toastConfig = {
  success: ({ text1, props, ...rest }) => (
    <BaseToast
      {...rest}
      style={{ borderLeftColor: Green400 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontFamily: 'Rubik SemiBold'
      }}
      text1={text1}
      onTrailingIconPress={() => {
        Toast.hide()
      }}
    />
  ),
  error: () => {},
  info: () => {},
  any_custom_type: () => {}
}