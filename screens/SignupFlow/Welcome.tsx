import * as React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, SafeAreaView } from 'react-native'

import { RootStackParamList } from '../types'
import { Orange, Black } from '../constants/Colors'
import { styles } from '../HomeScreen'

const loginStyles = StyleSheet.create({
  container: {
    ...styles.container
  },

})

export default function WelcomeScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'Welcome'>) {
  return (
    <View style={styles.container}>
      <Title>
        Welcome to Wonder! Successfully logged in
      </Title>
    </View>
  )
}