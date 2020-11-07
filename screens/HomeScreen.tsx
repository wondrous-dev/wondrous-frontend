import * as React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, SafeAreaView } from 'react-native'
import { SvgXml } from "react-native-svg"

import { RootStackParamList } from '../types'
import { Orange } from '../constants/Colors'
import { Title } from '../storybook/stories/Text'
import { SvgImage } from '../storybook/stories/Image'
import { scale, moderateScale, verticalScale } from '../utils/scale'
import SuperHeroSvg from '../assets/images/superhero.svg'

export default function HomeScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'Home'>) {
  return (
    <View style={styles.container}>
      <Title>
        Wonder
      </Title>
      <SvgImage width="196" height="200" style={styles.logo} srcElement={SuperHeroSvg} />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Orange,
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(16),
  },
  logo: {
    marginTop: moderateScale(48),
    width: 196,
    height: 220
  }
})