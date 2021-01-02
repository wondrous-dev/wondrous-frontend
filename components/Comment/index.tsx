import React, { useState, useCallback } from 'react'
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { TextEditor } from '../../storybook/stories/TextEditor'
import { useComment } from '../../utils/hooks'
import { TextEditorContext } from '../../utils/contexts'
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

const WriteComment = () => {
  const user = useMe()
  const [content, setContent] = useState('')
  const [userMentions, setUserMentions] = useState([])
  const {
    commentMutation,
    feedItemId
  } = useComment()

  const pressComment = useCallback(async content => {
    console.log('content', content)
    if (content) {
      await commentMutation({
        variables: {
          feedItemId,
          content
        }
      })
      setContent('')
      Keyboard.dismiss()
    }
  }, [])

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
        }} src={ user && user.profilePicture } defaultImage={DefaultProfilePicture} />
        <TextEditorContext.Provider value={{
          content,
          setContent
        }}>
        <TextEditor style={{
          width: Dimensions.get('window').width - (spacingUnit * 18),
        }} />
        </TextEditorContext.Provider>
        <PrimaryButton onPress={() => pressComment(content)} disabled={!content} style={{
          width: spacingUnit * 8,
          marginLeft: spacingUnit
        }}>
          <ButtonText color={White}>
            Reply
          </ButtonText>
        </PrimaryButton>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

export {
  WriteComment
}
