import React, { useRef, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { SafeAreaView, View, ScrollView , StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { useQuery, useMutation } from '@apollo/client'

import { withAuth } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { ProjectDiscussionItem } from '../../components/ProjectDiscussion'
import { WriteComment } from '../../components/Comment'
import { spacingUnit } from '../../utils/common'
import { White } from '../../constants/Colors'
import { GET_PROJECT_DISCUSSION, GET_PROJECT_DISCUSSION_COMMENTS } from '../../graphql/queries'
import { CREATE_PROJECT_DISCUSSION_COMMENT } from '../../graphql/mutations'
import { CommentContext } from '../../utils/contexts'

const feedItemStyles = StyleSheet.create({
  commentContainer: {
    minHeight: spacingUnit * 37.5
  }
})

// const FeedComment = ({ feedComment }) => {
//   return (

//   )
// }

function ProjectDiscussionItemScreen({
  route,
  navigation
}: StackScreenProps<RootStackParamList, 'ProjectDiscussionItem'>) {
  const {
    item,
    liked,
    userOwned
  } = route.params
  const scrollViewRef = useRef()
  const [replyName, setReplyName] = useState(null)
  const replyToComment = (value) => {
    setReplyName(value)
  }

  const { data, loading, error, fetchMore } = useQuery(GET_PROJECT_DISCUSSION_COMMENTS, {
    variables: {
      projectDiscussionId: item?.id
    },
    fetchPolicy: 'network-only'
  })
  const [createDiscussionComment] = useMutation(CREATE_PROJECT_DISCUSSION_COMMENT, {
    update(cache, { data: { createProjectDiscussionComment }}) {
      if (scrollViewRef) {
        scrollViewRef.current.scrollToEnd({ animated: true })
      }
      cache.modify({
        fields: {
          getProjectDiscussionComments(existingFeedItems = []) {
            return [...existingFeedItems, createProjectDiscussionComment]
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
        <ProjectDiscussionItem item={item} standAlone={true} key={item.id} onCommentPress={replyToComment} userOwned={userOwned} />
        <View style={feedItemStyles.commentContainer}>
          {
            data && data.getProjectDiscussionComments.map(discussionComment => {
              return (
                <ProjectDiscussionItem item={discussionComment} comment={true} key={discussionComment.id} onCommentPress={replyToComment}/>
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
          commentMutation: createDiscussionComment,
          projectDiscussionId: item.id,
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

export default withAuth(ProjectDiscussionItemScreen)