import React, { useRef, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { SafeAreaView, View, ScrollView , StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { useQuery, useMutation } from '@apollo/client'
import { gql } from '@apollo/client'

import { ActivityFeedItem } from '../graphql/fragments/feed'
import { withAuth } from '../components/withAuth'
import { RootStackParamList } from '../types'
import { Header } from '../components/Header'
import { FeedItem } from '../components/Feed'
import { WriteComment } from '../components/Comment'
import { spacingUnit } from '../utils/common'
import { Grey300, White } from '../constants/Colors'
import { GET_FEED_COMMENTS } from '../graphql/queries'
import { RegularText } from '../storybook/stories/Text'
import { CREATE_FEED_COMMENT, DELETE_FEED_COMMENT } from '../graphql/mutations/feed'
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

  const { data, loading, error, fetchMore } = useQuery(GET_FEED_COMMENTS, {
    variables: {
      feedItemId: item.id
    }
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

  return (
    <>
    <SafeAreaView style={{
      backgroundColor: White,
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
            data && data.getFeedItemComments.map(feedComment => {
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
          setReplyName
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