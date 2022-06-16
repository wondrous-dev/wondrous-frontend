import React, { useRef, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { SafeAreaView, View, ScrollView , StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { useQuery, useMutation } from '@apollo/client'

import { withAuth, useMe } from '../components/withAuth'
import { RootStackParamList } from '../types'
import { Header } from '../components/Header'
import { FeedItem } from '../components/Feed'
import { WriteComment } from '../components/Comment'
import { spacingUnit } from '../utils/common'
import palette from 'theme/palette'
import { GET_FEED_COMMENTS } from '../graphql/queries'
import { CREATE_FEED_COMMENT } from '../graphql/mutations/feed'
import { CommentContext } from '../utils/contexts'

const feedItemStyles = StyleSheet.create({
  commentContainer: {
    minHeight: spacingUnit * 37.5
  }
})

// const FeedComment = ({ feedComment }) => {
//   return (

//   )
// }

function FeedItemScreen({
  route,
  navigation
}: StackScreenProps<RootStackParamList, 'FeedItem'>) {
  const {
    item,
    liked
  } = route.params
  const scrollViewRef = useRef()
  const [replyName, setReplyName] = useState(null)
  const replyToComment = (value) => {
    setReplyName(value)
  }
  const user = useMe()
  const { data, loading, error, fetchMore } = useQuery(GET_FEED_COMMENTS, {
    variables: {
      feedItemId: item.id
    },
    fetchPolicy: 'network-only'
  })
  const [createFeedComment] = useMutation(CREATE_FEED_COMMENT, {
    update(cache, { data: { createFeedComment }}) {
      if (scrollViewRef) {
        scrollViewRef.current.scrollToEnd({ animated: true })
      }
      cache.modify({
        fields: {
          getFeedItemComments(existingFeedItems = []) {
            return [...existingFeedItems, createFeedComment]
          }
        }
      })
    }
  })
  let previousCommenterIds: [string?] = []
  if (data?.getFeedItemComments && data?.getFeedItemComments.length > 0) {
    data.getFeedItemComments.forEach(feedItemComment => {
      if (!previousCommenterIds.includes(feedItemComment?.userId)) {
        previousCommenterIds.push(feedItemComment?.userId)
      }
    })
  }
  const filteredComments = data?.getFeedItemComments?.filter(comment => {
    return !(user?.blockedUsers?.includes(comment.userId) || user?.blockedByUsers?.includes(comment.userId))
  })
  return (
    <>
    <SafeAreaView style={{
      backgroundColor: palette.white,
      flex: 1
    }}>
      <Header />
      <ScrollView keyboardDismissMode='interactive' keyboardShouldPersistTaps='handled' style={{
        marginTop: spacingUnit,
        marginBottom: spacingUnit * 10
      }}
      ref={scrollViewRef}
      >
        <FeedItem item={item} standAlone={true} key={item.id} onCommentPress={replyToComment} />
        <View style={feedItemStyles.commentContainer}>
          {
            filteredComments?.map(feedComment => {
              return (
                <FeedItem item={feedComment} comment={true} key={feedComment.id} onCommentPress={replyToComment}/>
              )
            })
          }
        </View>
        {/* # Minimum div which contains all the comments */}
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1
        }}
        
      >
        <CommentContext.Provider value={{
          commentMutation: createFeedComment,
          feedItemId: item.id,
          replyName,
          setReplyName,
          previousCommenterIds
        }}>
          <View style={{
            flex: 1
          }}>
            <WriteComment />
          </View>
      </CommentContext.Provider>
      </KeyboardAvoidingView>
    </SafeAreaView>

    </>
  )
}

export default withAuth(FeedItemScreen)