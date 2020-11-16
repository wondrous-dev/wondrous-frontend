import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { TouchableHighlight } from 'react-native'

import { Blue400, Blue500, White, Grey100, Black } from '../../../constants/Colors'
import baseStyle from './style'
import { ButtonText } from '../Text'

const BaseButton = ({
  onPress,
  children,
  style,
  baseStyle,
  buttonPressStyle,
  color,
  textStyle,
  textPressStyle }) => {
  const [pressStatus, setPressStatus] = useState(false)
  const finalStyle = pressStatus ? {
    ...baseStyle,
    ...buttonPressStyle
  } :
  {
    ...baseStyle,
    ...style
  }

  const finalTextStyle = pressStatus ? textPressStyle : textStyle

  return (
    <TouchableHighlight onPress={onPress} style={finalStyle}
      onHideUnderlay={() => setPressStatus(false)}
      onShowUnderlay={() => setPressStatus(true)}
      underlayColor={pressStatus ? baseStyle.backgroundColor : buttonPressStyle.backgroundColor}
    >
        {children}
    </TouchableHighlight>
  )
}

export function PrimaryButton ({ onPress, children, style, textStyle, textPressStyle }) {
  return <BaseButton onPress={onPress} style={style} baseStyle={baseStyle.primary} buttonPressStyle={{
    backgroundColor: Blue500,
    ...baseStyle.primary,
    ...style
  }} textStyle={textStyle} textPressStyle={textPressStyle}>
    
    {children}
    </BaseButton>
}

export function SecondaryButton ({ onPress, children, style, textStyle, textPressStyle }) {
  return <BaseButton onPress={onPress} style={style} baseStyle={baseStyle.secondary} buttonPressStyle={{
    backgroundColor: Grey100,
    color: Black,
  ...baseStyle.secondary,
  ...style,
}} textStyle={textStyle} textPressStyle={textPressStyle}>
    {children}
  </BaseButton>
}

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

export * from './Google'