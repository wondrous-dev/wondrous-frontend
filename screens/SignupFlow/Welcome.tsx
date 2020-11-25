import * as React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, SafeAreaView } from 'react-native'

import { RootStackParamList } from '../types'
import { Orange, Black } from '../constants/Colors'
import { styles } from '../HomeScreen'
import { Title, Subheading, Paragraph, ButtonText } from '../../storybook/stories/Text'
import { DescriptionTextEditor  } from '../../storybook/stories/TextEditor'
import { withAuth, useMe } from '../../components/withAuth'

const loginStyles = StyleSheet.create({
  container: {
    ...styles.container
  },

})

function WelcomeScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'Welcome'>) {
  const user = useMe()

  return (
    <View style={styles.container}>
      <Title>
        Welcome to Wonder! Successfully logged in
      </Title>
      <DescriptionTextEditor  />
    </View>
  )
}

export default withAuth(WelcomeScreen)