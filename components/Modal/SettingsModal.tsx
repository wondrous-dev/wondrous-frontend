import React, { Component, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Pressable, Dimensions, SafeAreaView } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator'
import { useNavigation } from '@react-navigation/native'

import BackCaret from '../../assets/images/back-caret'
import { Grey300, Black, Blue400, White } from '../../constants/Colors'
import { Paragraph, RegularText } from '../../storybook/stories/Text';
import { getFilenameAndType, uploadMedia } from '../../utils/image';
import { FlexRowContentModal } from '.';
import { logout } from '../withAuth';
import Logout from '../../assets/images/logout';
import { spacingUnit } from '../../utils/common';

export const SettingsModal = ({ isVisible, setModalVisible }) => {
  const navigation = useNavigation()
  return (
    <FlexRowContentModal
    headerText='Settings'
    setModalVisible={setModalVisible}
    isVisible={isVisible}
    >
      <View />
      <Pressable onPress={() => {
        logout(navigation)
        setModalVisible(false)
      }}>
      <View style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Logout />
        <Paragraph style={{
          marginTop: spacingUnit * 0.5
        }}>
          Log out
        </Paragraph>
      </View>
      </Pressable>
      <View />
    </FlexRowContentModal>
  )
}