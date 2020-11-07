import React from 'react'
import PropTypes from 'prop-types'
import { TouchableHighlight } from 'react-native'

import baseStyle from './style'

export function PrimaryButton ({ onPress, children, style }) {
  return <TouchableHighlight onPress={onPress} style={{
    ...baseStyle.primary,
    ...style
  }}>
    
    {children}
    </TouchableHighlight>
}

export function SecondaryButton ({ onPress, children, style }) {
  return <TouchableHighlight onPress={onPress} style={{
    ...baseStyle.secondary,
    ...style
  }}>
    {children}
  </TouchableHighlight>
}

PrimaryButton.defaultProps = {
  children: null,
  onPress: () => {},
}

PrimaryButton.propTypes = {
  children: PropTypes.node,
  onPress: PropTypes.func,
}
