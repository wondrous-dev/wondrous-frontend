import React, { useCallback, useState } from 'react'
import { SafeAreaView, ScrollView, View, TextInput, TouchableWithoutFeedback, Keyboard, Pressable, ActivityIndicator } from 'react-native'
import Modal from 'react-native-modal'
import { Black, White } from '../../constants/Colors'
import { PrimaryButton } from '../../storybook/stories/Button'
import { SvgImage } from '../../storybook/stories/Image'
import { ButtonText, Paragraph, Subheading } from '../../storybook/stories/Text'
import { spacingUnit } from '../../utils/common'
import { modalStyles } from './common'
import CommunitySvg from '../../assets/images/community.svg'

export const ProjectFAQModal = ({ isVisible, setModalVisible }) => {
  return (
    <Modal isVisible={isVisible}>
      <SafeAreaView style={{
        ...modalStyles.fullScreenContainer,
        alignItems: 'center',
      }}>
      <SvgImage width="80" height="80" srcElement={CommunitySvg} style={{
         marginTop: spacingUnit * 10,
         marginBottom: spacingUnit * 4
        }}/>
        <Subheading color={Black} style={{
          paddingLeft: spacingUnit * 2,
          paddingRight: spacingUnit * 2
        }}>
          A project can be any large goal that you want to get done.
        </Subheading>
        <Paragraph style={{
          paddingLeft: spacingUnit * 2,
          paddingRight: spacingUnit * 2,
          marginTop: spacingUnit * 2
        }}>
          This could be anything you are currently working on, or just ideas that you want to make reality.{` `}
        </Paragraph>
        <Paragraph style={{
            fontFamily: 'Rubik SemiBold',
            marginTop: spacingUnit * 2,
            paddingLeft: spacingUnit * 2,
            paddingRight: spacingUnit * 2
          }}>
            A startup/side hustle? That album you've always wanted to make? Those fitness goals you set in the new year?
          </Paragraph>
        <Paragraph style={{
          marginTop: spacingUnit* 2,
          marginBottom: spacingUnit * 3
        }}>
          Creating a project not only helps us{` `}
          <Paragraph style={{
            fontFamily: 'Rubik SemiBold'
          }}>
          celebrate your progress and keep you accountable
            </Paragraph>, but also lets us connect you with
          the{` `}
          <Paragraph style={{
            fontFamily: 'Rubik SemiBold'
          }}>
            relevant people who can help.
            </Paragraph>
        </Paragraph>

        <PrimaryButton onPress={() => setModalVisible(false)}>
          <ButtonText color={White}>
            Got it
          </ButtonText>
        </PrimaryButton>
      </SafeAreaView>
    </Modal>
  )
}