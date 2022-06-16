import React, { useState } from 'react'
import { StyleSheet, View, ScrollView, Pressable, Text, Image, SafeAreaView, KeyboardAvoidingView, TextInput } from 'react-native'
import ProgressCircle from 'react-native-progress-circle'

import { Subheading, Paragraph, ButtonText } from '../../storybook/stories/Text'
import palette from 'theme/palette'
import { Header } from '../../components/Header'
import { usernameSetupStyles } from './UsernameSetupScreen'
import Smile from '../../assets/images/emoji/smile'
import { spacingUnit } from '../../utils/common'
import { PrimaryButton } from '../../storybook/stories/Button'

const groupStyles = StyleSheet.create({
  heading: {
    fontSize: 36
  },
  groupContainer: {
    padding: spacingUnit * 2,
    alignItems: 'center'
  },
  pill: {
    width: spacingUnit * 28,
    borderWidth: 1,
    borderColor: palette.black,
    marginTop: spacingUnit * 2,
    borderRadius: spacingUnit * 3.5,
    alignItems: 'center',
    padding: spacingUnit * 1.5
  },
  pillText: {
    fontSize: 18,
    fontFamily: 'Rubik SemiBold'
  },
  navigationButtonContainer: {
    flexDirection: 'row',
    padding: spacingUnit * 2,
    alignItems: 'center',
    marginTop: spacingUnit * 3
  }
})

const GROUPS = [
  'On Deck',
  'Community College',
  '/r/SideProject',
  '#buildinpublic'
]

const Pill = ({ text, selected }) => {
  return (
    <View style={{
      ...groupStyles.pill,
      ...(selected && {
        backgroundColor: palette.orange,
        borderWidth: 0
      })
    }}>
      <Paragraph color={selected ? palette.white : palette.black} style={groupStyles.pillText}>
        {text}
      </Paragraph>
    </View>
  )
}

const GroupSetupScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(null)

  return (
    <SafeAreaView style={{
      backgroundColor: palette.white,
      flex: 1,
    }}>
      <Header noGoingBack={true} />
      <View style={usernameSetupStyles.progressCircleContainer}>
        <ProgressCircle
          percent={66}
          radius={50}
          borderWidth={10}
          color={palette.yellow300}
          shadowColor={palette.grey300}
          bgColor={palette.white}
        >
          <Smile />
        </ProgressCircle>
        <View style={usernameSetupStyles.stepContainer}>
          <Text style={usernameSetupStyles.stepCount}>step 2/3</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={groupStyles.groupContainer}>
        <Subheading style={groupStyles.heading} color={palette.black}>
          What's your group?
        </Subheading>
        <Paragraph color={palette.grey500} style={{
          textAlign: 'center',
          marginTop: spacingUnit
        }}>
          What communities are you already apart of?{'\n'}
          If none, just click continue : )
        </Paragraph>
        {
          GROUPS.map(group => (
            <Pressable onPress={() => setSelected(group)}>
              <Pill text={group} selected={selected === group}/>
            </Pressable>
          ))
        }
        <View style={groupStyles.navigationButtonContainer}>
          <PrimaryButton
            style={{
              backgroundColor: palette.white,
              borderWidth: 1,
              borderColor: palette.black,
              flex: 1,
              marginRight: spacingUnit * 3
            }}
          >
            <ButtonText>
              Back
            </ButtonText>
          </PrimaryButton> 
          <PrimaryButton
              textStyle={{ color: palette.white }}
              style={{
                flex: 1
              }}
              onPress={() => {
                // navigation.push('')
              }}
            >
              <ButtonText color={palette.white}> Continue </ButtonText>
            </PrimaryButton>
        </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default GroupSetupScreen