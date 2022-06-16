import React from 'react'
import { SafeAreaView } from 'react-native'
import Modal from 'react-native-modal'
import palette from 'theme/palette'
import { PrimaryButton } from '../../storybook/stories/Button'
import { ButtonText, Paragraph, Subheading } from '../../storybook/stories/Text'
import { spacingUnit } from '../../utils/common'
import { modalStyles } from './common'
import CommunitySvg from '../../assets/images/community'

export const ProjectFAQModal = ({ isVisible, setModalVisible }) => {
  return (
    <Modal isVisible={isVisible}>
      <SafeAreaView style={{
        ...modalStyles.fullScreenContainer,
        alignItems: 'center',
        paddingLeft: spacingUnit * 2,
        paddingRight: spacingUnit * 2
      }}>

        <CommunitySvg style={{
          width: 80,
          height: 80,
          marginTop: spacingUnit * 10,
          marginBottom: spacingUnit * 4
        }} />
        <Subheading color={palette.black} style={{
          fontSize: 18,
          lineHeight: 28,
          paddingLeft: spacingUnit * 2,
          paddingRight: spacingUnit * 2,
        }}>
          A project can be anything you are currently working on, or an idea you want to explore
        </Subheading>

        <Paragraph style={{
            marginTop: spacingUnit * 2,
            paddingLeft: spacingUnit * 1.5,
            paddingRight: spacingUnit * 1.5
          }}>
            A startup/side hustle? That album you've always wanted to make? Those fitness goals you set in the new year?
        </Paragraph>
        <Paragraph style={{
          marginTop: spacingUnit* 2,
          marginBottom: spacingUnit * 4,
        }}>
          Creating a project not only helps us celebrate your progress and keep you accountable but also lets us connect you with the relevant people who can help.
        </Paragraph>

        <PrimaryButton onPress={() => setModalVisible(false)}>
          <ButtonText color={palette.white}>
            Got it
          </ButtonText>
        </PrimaryButton>
      </SafeAreaView>
    </Modal>
  )
}