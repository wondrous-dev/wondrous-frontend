import * as React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { SafeAreaView, View, ScrollView , StyleSheet} from 'react-native'
import { useQuery } from '@apollo/client'

import { withAuth } from '../components/withAuth'
import { RootStackParamList } from '../types'
import { Header } from '../components/Header'
import { FeedItem } from '../components/Feed'
import { spacingUnit } from '../utils/common'
import { Grey300, White } from '../constants/Colors'
import { GET_FEED_COMMENTS } from '../graphql/queries'
import { RegularText } from '../storybook/stories/Text'

const feedItemStyles = StyleSheet.create({
  commentContainer: {
    minHeight: spacingUnit * 37.5
  },
  likeCount: {
    paddingLeft: spacingUnit * 2,
    paddingTop: spacingUnit,
    paddingBottom: spacingUnit
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
  const { data, loading, error, fetchMore } = useQuery(GET_FEED_COMMENTS, {
    variables: {
      feedItemId: item.id
    }
  })
  console.log('data', data)
  return (
    <SafeAreaView style={{
      backgroundColor: White
    }}>
      <Header />
      <ScrollView style={{
        marginTop: spacingUnit
      }}>
        <FeedItem item={item} standAlone={true} />
        <View
          style={{
            borderBottomColor: Grey300,
            borderBottomWidth: 1,
          }}
        />
        {
          Number(item.reactionCount) > 0 &&
          <>
            <RegularText style={feedItemStyles.likeCount}>
              {item.reactionCount} likes
            </RegularText>
            <View
              style={{
                borderBottomColor: Grey300,
                borderBottomWidth: 1,
              }}
            />
          </>
        }
        <View style={feedItemStyles.commentContainer}>
          {
            data && data.getFeedItemComments.map(feedComment => {
              return (
                <FeedItem item={feedComment} comment={true} />
              )
            })
          }
        </View>
        {/* # Minimum div which contains all the comments */}
      </ScrollView>
      {/* #bottom nav div */}
    </SafeAreaView>
  )
}

export default FeedItemScreen