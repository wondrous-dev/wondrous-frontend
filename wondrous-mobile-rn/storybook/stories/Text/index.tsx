import React from 'react'
import { Text } from 'react-native'
import baseStyle from './style'
import palette from 'theme/palette'

export const Title = ({ style, children }) => (
  <Text style={{
    ...baseStyle.title,
    ...style
  }}>{children}</Text>
)

export const Subheading = ({ style, children, color=palette.white }) => (
  <Text style={{
    ...baseStyle.subheading,
    ...style,
    ... {
      color
    }
  }}>{children}</Text>
)

export const Paragraph = ({ style, children, color=palette.black, ...props }) => (
  <Text {...props} style={{
    ...baseStyle.paragraph,
    ...style,
    ...{
      color
    }
  }}>{children}</Text>
)

export const RegularText = ({ style, children, color, ...props }) => (
  <Text {...props} style={{
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
  }}>{children}</Text>
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

export const ErrorText = ({ style, children, color=palette.red400 }) => (
  <Text style={{
    ...baseStyle.errorText,
    ...style,
    ... {
      color
    }
  }}>{children}</Text>
)