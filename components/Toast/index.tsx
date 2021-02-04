import React from 'react'
import { View } from 'react-native'
import { BaseToast } from 'react-native-toast-message'

import { Black, Green400 } from '../../constants/Colors'
import { Paragraph } from '../../storybook/stories/Text'
import { spacingUnit } from '../../utils/common'

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
    />
  ),
  error: () => {},
  info: () => {},
  any_custom_type: () => {}
}