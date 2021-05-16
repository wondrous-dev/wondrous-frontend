import React, { useState, useCallback } from 'react'
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { TextEditor } from '../../storybook/stories/TextEditor'
import { useComment } from '../../utils/hooks'
import { TextEditorContext } from '../../utils/contexts'
import { spacingUnit, getMentionArray } from '../../utils/common'
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
    feedItemId,
    replyName,
    setReplyName,
    reviewId,
    projectDiscussionId,
    previousCommenterIds
  } = useComment()
  const pressComment = useCallback(async content => {
    if (content) {
      const {
        mentionedUsers,
        mentionedProjects
      } = getMentionArray(content)
      try {
        if (reviewId) {
          await commentMutation({
            variables: {
              input: {
                content,
                reviewId,
                ...(mentionedUsers.length > 0 && {
                  userMentions: mentionedUsers
                }),
                ...(mentionedProjects.length > 0 && {
                  projectMentions: mentionedProjects
                })
              }
            }
          })
        }  else if (feedItemId) {
          await commentMutation({
            variables: {
              feedItemId,
              content,
              ...(mentionedUsers.length > 0 && {
                userMentions: mentionedUsers
              }),
              ...(mentionedProjects.length > 0 && {
                projectMentions: mentionedProjects
              }),
              ...(previousCommenterIds.length > 0 && {
                previousCommenterIds
              })
            }
          })
        } else if (projectDiscussionId) {
          await commentMutation({
            variables: {
              input: {
                projectDiscussionId,
                content,
                ...(mentionedUsers.length > 0 && {
                  userMentions: mentionedUsers
                }),
                ...(mentionedProjects.length > 0 && {
                  projectMentions: mentionedProjects
                })
              }
            }
          })
        }
      } catch (error) {
        console.log("error commenting", JSON.stringify(error, null, 2))
      }
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
        }} src={ user && (user.thumbnailPicture || user.profilePicture) } defaultImage={DefaultProfilePicture} />
        <TextEditorContext.Provider value={{
          content,
          setContent,
          replyName,
          setReplyName,
          placeholder: 'Add comment...'
        }}>
        <TextEditor renderBottom={false} style={{
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
