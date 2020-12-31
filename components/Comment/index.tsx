import * as React from 'react'
import { SafeAreaView, View, FlatList, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { TextEditor } from '../../storybook/stories/TextEditor'
import { useComment } from '../../utils/hooks'
import { spacingUnit } from '../../utils/common'
import { useMe } from '../withAuth'
import { PrimaryButton } from '../../storybook/stories/Button'
import { ButtonText } from '../../storybook/stories/Text'
import { SafeImage } from '../../storybook/stories/Image'
import DefaultProfilePicture from '../../assets/images/default-profile-picture.jpg'
import { Grey300, White } from '../../constants/Colors'

const commentStyles = StyleSheet.create({
  commentContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  inner: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: White,
    padding: spacingUnit * 2,
    borderTopWidth: 1,
    borderTopColor: Grey300
  }
})

const WriteComment = ({ commentMutation }) => {
  const user = useMe()
  return (
    <View style={commentStyles.commentContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={commentStyles.inner}>
        <SafeImage style={{
          width: spacingUnit * 4,
          height: spacingUnit * 4,
          borderRadius: spacingUnit * 2,
          marginRight: spacingUnit,
          marginBottom: 4
        }} src={null} defaultImage={DefaultProfilePicture} />
        <TextEditor />
        {/* <PrimaryButton>
          <ButtonText>
            Reply
          </ButtonText>
        </PrimaryButton> */}
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

export {
  WriteComment
}
