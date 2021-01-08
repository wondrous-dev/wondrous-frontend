import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native'
import baseStyle from './style'
import { White, Red400 } from '../../../constants/Colors'

export const Title = ({ style, children }) => (
  <Text style={{
    ...baseStyle.title,
    ...style
  }}> {children} </Text>
)

export const Subheading = ({ style, children, color=White }) => (
  <Text style={{
    ...baseStyle.subheading,
    ...style,
    ... {
      color
    }
  }}> {children} </Text>
)

export const Paragraph = ({ style, children }) => (
  <Text style={{
    ...baseStyle.paragraph,
    ...style
  }}> {children} </Text>
)

export const RegularText = ({ style, children, color }) => (
  <Text style={{
    ...baseStyle.regular,
    ...style,
    ...{
      color
    }
  }}>{children}</Text>
)
export const ButtonText = ({ style, children, color }) => (
  <Text style={{
    ...baseStyle.buttonText,
    ...style,
    ...{
      color
    }
  }}> {children} </Text>
)

export const TinyText = ({ style, children, color }) => (
  <Text style={{
    ...baseStyle.tinyText,
    ...style,
    ...{
      color
    }
  }}>{children}</Text>
)

export const ErrorText = ({ style, children, color=Red400 }) => (
  <Text style={{
    ...baseStyle.errorText,
    ...style,
    ... {
      color
    }
  }}> {children} </Text>
)