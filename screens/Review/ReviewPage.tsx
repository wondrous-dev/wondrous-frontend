import { useMutation, useQuery } from '@apollo/client'
import { format } from 'date-fns'
import React, { useState, useRef } from 'react'
import { SafeAreaView, StyleSheet, View, KeyboardAvoidingView, ScrollView } from 'react-native'
import { WriteComment } from '../../components/Comment'
import { Header } from '../../components/Header'
import { withAuth } from '../../components/withAuth'
import { White, Black, Grey400 } from '../../constants/Colors'
import { CREATE_REVIEW_COMMENT } from '../../graphql/mutations'
import { GET_REVIEW_BY_ID, GET_REVIEW_COMMENTS } from '../../graphql/queries/review'
import { Paragraph, Subheading } from '../../storybook/stories/Text'
import { renderMentionString, spacingUnit } from '../../utils/common'
import { CommentContext } from '../../utils/contexts'
import { GetReviewIcon } from './utils'

const reviewStyles = StyleSheet.create({
  container: {
    marginTop: spacingUnit * 2,
    padding: spacingUnit * 2
  }
})

const ReviewPage = ({ navigation, route }) => {
  const {
    tab,
    reviewId
  } = route.params
  const { data, loading, error} = useQuery(GET_REVIEW_BY_ID, {
    variables: {
      reviewId
    }
  })
  const review = data && data.getReviewById
  const [replyName, setReplyName] = useState(null)
  const scrollViewRef = useRef()
  const {
    data: reviewCommentData
  } = useQuery(GET_REVIEW_COMMENTS)

  const [createReviewComment] = useMutation(CREATE_REVIEW_COMMENT, {
    update(cache, { data: {createReviewComment }}) {
      cache.modify({
        fields: {
          getReviewComments() {
            if (reviewCommentData && reviewCommentData.getReviewComments) {
              return [
                ...reviewCommentData.getReviewComments,
                createReviewComment
              ]
            }
            return [createReviewComment]
          }
        }
      })
    }
})

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <Header />
      {
        review &&
        <>
        <ScrollView keyboardDismissMode='interactive' keyboardShouldPersistTaps='handled' style={{
        marginBottom: spacingUnit * 10,
        ...reviewStyles.container
      }}
      contentContainerStyle={{
        flex: 1
      }}
      ref={scrollViewRef}>
        <View style={{flexDirection: 'row'}}>
        <Subheading color={Black}>
          Review on {format(new Date(review.createdAt), 'dd/MM/yy')}:
        </Subheading>
        <GetReviewIcon review={review}  style={{
          width: 24,
          height: 24,
          marginLeft: spacingUnit
        }}/>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginTop: spacingUnit
        }}>
        <Paragraph style={{
          flex: 1
        }}>{renderMentionString({ content: review.description, navigation, tab })}</Paragraph>
        </View>
        {
          reviewCommentData && reviewCommentData.getReviewComments && reviewCommentData.getReviewComments.length > 0 &&
          <View style={{
            borderTopColor: Grey400,
            borderTopWidth: 1,
            marginTop: spacingUnit * 3
          }}>
  
          </View>
        }
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1
        }}
        
      >
      <CommentContext.Provider value={{
          commentMutation: createReviewComment,
          reviewId: review && review.id,
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
      </>
      }
    </SafeAreaView>
  )
}

export default withAuth(ReviewPage)