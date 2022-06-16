import React from 'react'
import Toast, { BaseToast } from 'react-native-toast-message'

import palette from 'theme/palette'

export const toastConfig = {
  success: ({ text1, props, ...rest }) => (
    <BaseToast
      {...rest}
      style={{ borderLeftColor: palette.green400 }}
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