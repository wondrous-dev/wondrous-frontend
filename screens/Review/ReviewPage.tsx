import { useMutation, useQuery } from '@apollo/client'
import { format } from 'date-fns'
import React, { useState, useRef } from 'react'
import { SafeAreaView, StyleSheet, View, KeyboardAvoidingView, ScrollView, Pressable } from 'react-native'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

import { WriteComment } from '../../components/Comment'
import { Header } from '../../components/Header'
import { withAuth } from '../../components/withAuth'
import { White, Black, Grey400, Grey200 } from '../../constants/Colors'
import { CREATE_REVIEW_COMMENT } from '../../graphql/mutations'
import { GET_REVIEW_BY_ID, GET_REVIEW_COMMENTS } from '../../graphql/queries/review'
import { Paragraph, Subheading, RegularText } from '../../storybook/stories/Text'
import { renderMentionString, spacingUnit } from '../../utils/common'
import { CommentContext } from '../../utils/contexts'
import { GetReviewIcon } from './utils'
import DefaultProfilePicture from '../../assets/images/default-profile-picture.jpg'
import { SafeImage } from '../../storybook/stories/Image'

TimeAgo.locale(en)
const timeAgo = new TimeAgo('en-US')
const reviewStyles = StyleSheet.create({
  container: {
    marginTop: spacingUnit * 2,
    padding: spacingUnit * 2
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: spacingUnit * 6,
    height: spacingUnit * 6,
    borderRadius: spacingUnit * 3,
    marginRight: spacingUnit
  },
  content: {
    marginTop: spacingUnit * 2,
    alignContent: 'center',
    flexShrink: 1
  },
  commentText: {
    fontSize: 18
  }
})

const ReviewPage = ({ navigation, route }) => {
  const {
    tab,
    reviewId,
    initialReview
  } = route.params
  const { data, loading, error} = useQuery(GET_REVIEW_BY_ID, {
    variables: {
      reviewId
    }
  })
  const review = initialReview || (data && data.getReviewById)
  const [replyName, setReplyName] = useState(null)
  const scrollViewRef = useRef()
  const {
    data: reviewCommentData
  } = useQuery(GET_REVIEW_COMMENTS, {
    variables: {
      reviewId
    },
    fetchPolicy: 'network-only'
  })

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
            marginTop: spacingUnit * 3,
          }}>
            {
              reviewCommentData.getReviewComments.map((item, index) => {
                return (
                  <View style={{
                    padding: spacingUnit * 2,
                    ...(index !== reviewCommentData.getReviewComments.length -1 && {
                      borderBottomColor: Grey400,
                      borderBottomWidth: 1
                    })
                  }}>
                    <View style={reviewStyles.row}>
                    <Pressable onPress={() => navigation.navigate('Root', {
                        screen: route && route.params && route.params.tab || 'Profile',
                        params: {
                          screen: 'UserProfile',
                          params: {
                            userId: item.userId
                          }
                        }
                      })}>
                        <SafeImage style={reviewStyles.image} src={item.commenterProfilePicture} defaultImage={DefaultProfilePicture} />
                      </Pressable>
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}>
                        <Paragraph style={{
                        }} style={{
                          fontFamily: 'Rubik SemiBold',
                          marginRight: spacingUnit * 0.5
                        }} color={Black}
                        onPress={() => navigation.navigate('Root', {
                          screen: route && route.params && route.params.tab || 'Profile',
                          params: {
                            screen: 'UserProfile',
                            params: {
                              userId: item.userId
                            }
                          }
                        })}         
                        >{item.commenterFirstName} {item.commenterLastName}{` `}</Paragraph>
                        <RegularText  color={Grey200}>{timeAgo.format(new Date(item.createdAt))}</RegularText>     

                        </View>
                    </View>
                    <View style={reviewStyles.content}>
                    <Paragraph color={Black} style={reviewStyles.commentText}>
                      {renderMentionString({ content: item.content, navigation, tab })}
                      </Paragraph>
                    </View>
                  </View>
                )
              })
            }
          </View>
        }
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // style={{
        //   flex: 1
        // }}
        
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