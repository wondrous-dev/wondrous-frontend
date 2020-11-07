import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native'
import baseStyle from './style'

export const Title = ({ style, children }) => (
  <Text style={{
    ...baseStyle.title,
    ...style
  }}> {children} </Text>
)
