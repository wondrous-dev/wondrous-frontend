import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { TouchableHighlight, Pressable } from 'react-native'

import palette from 'theme/palette'
import baseStyle from './style'

const BaseButton = ({
  onPress,
  children,
  style,
  baseStyle,
  buttonPressStyle,
  color,
  ...props
}) => {
  const [pressStatus, setPressStatus] = useState(false)
  const finalStyle = pressStatus ? {
    ...baseStyle,
    ...buttonPressStyle
  } :
  {
    ...baseStyle,
    ...style
  }

  return (
    <Pressable onPress={onPress} style={finalStyle}
      {...props}
    >
        {children}
    </Pressable>
  )
}

export function PrimaryButton ({ onPress, children, style, ...props }) {
  return <BaseButton onPress={onPress} style={style} baseStyle={baseStyle.primary} buttonPressStyle={{
    backgroundColor: palette.blue500,
    ...baseStyle.primary,
    ...style
  }} {...props}>
    
    {children}
    </BaseButton>
}

export function SecondaryButton ({ onPress, children, style, ...props }) {
  return <BaseButton onPress={onPress} style={style} baseStyle={baseStyle.secondary} buttonPressStyle={{
    backgroundColor: palette.grey100,
    color: palette.black,
  ...baseStyle.secondary,
  ...style,
}}
  {...props}
>
    {children}
  </BaseButton>
}

export function FlexibleButton ({ onPress, children, style, ...props }) {
  return (
    <TouchableHighlight onPress={onPress} style={{
      ...style,
      borderRadius: 4
    }} {...props}>
      {children}
    </TouchableHighlight>
  )
}

// export function GreyButton ({ onPress, children, style, ...props }) {
//   return <BaseButton onPress={onPress} style={style} {...props}>
//     {children}
//   </BaseButton>
// }

PrimaryButton.defaultProps = {
  children: null,
  onPress: () => {},
}

PrimaryButton.propTypes = {
  children: PropTypes.node,
  onPress: PropTypes.func,
}

SecondaryButton.defaultProps = {
  children: null,
  onPress: () => {}
}

SecondaryButton.propTypes = {
  children: PropTypes.node,
  onPress: PropTypes.func
}
