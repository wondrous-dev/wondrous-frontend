import { useQuery } from '@apollo/client'
import { format } from 'date-fns'
import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { Header } from '../../components/Header'
import { withAuth } from '../../components/withAuth'
import { White, Black } from '../../constants/Colors'
import { GET_REVIEW_BY_ID } from '../../graphql/queries/review'
import { Paragraph, Subheading } from '../../storybook/stories/Text'
import { renderMentionString, spacingUnit } from '../../utils/common'
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
  
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <Header />
      {
        review &&
        <View style={reviewStyles.container}>
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
      </View>
      }
    </SafeAreaView>
  )
}

export default withAuth(ReviewPage)