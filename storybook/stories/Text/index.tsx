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

export const Subheading = ({ style, children }) => (
  <Text style={{
    ...baseStyle.subheading,
    ...style
  }}> {children} </Text>
)

export const Paragraph = ({ style, children }) => (
  <Text style={{
    ...baseStyle.paragraph,
    ...style
  }}> {children} </Text>
)

export const ButtonText = ({ style, children }) => (
  <Text style={{
    ...baseStyle.buttonText,
    ...style
  }}> {children} </Text>
)
