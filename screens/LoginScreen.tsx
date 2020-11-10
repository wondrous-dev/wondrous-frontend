import * as React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, SafeAreaView } from 'react-native'

import { RootStackParamList } from '../types'
import { Orange, Black } from '../constants/Colors'
import { Title, Subheading, Paragraph, ButtonText } from '../storybook/stories/Text'
import { PrimaryButton, SecondaryButton } from '../storybook/stories/Button'
import { scale, moderateScale, verticalScale } from '../utils/scale'
import { styles } from './HomeScreen'

const loginStyles = StyleSheet.create({
  container: styles.container
})

export default function LoginScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'Login'>) {
  return (
    <View style={styles.container}>
      <Title>
        Wonder
      </Title>
    </View>
  )
}