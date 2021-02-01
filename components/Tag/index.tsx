import React from 'react'
import { StyleSheet, View } from 'react-native'
import { spacingUnit } from '../../utils/common'

const styles = StyleSheet.create({
  tag: {
    borderRadius: 8,
    paddingLeft: spacingUnit * 1.5,
    paddingRight: spacingUnit * 1.5
  }
})

export const Tag = ({ color, children, style }) => (
  <View style={[styles.tag, {
    backgroundColor: color,
    ...style
  }]}>
    {children}
  </View>
)