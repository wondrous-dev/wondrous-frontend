import { useQuery, useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'

import { palette.black, palette.blue400, palette.red400, palette.yellow300, palette.green400, palette.grey800, palette.grey300 } from '../../constants/Colors'
import { spacingUnit } from '../../utils/common'
import { GET_ASK_FEED, GET_GOAL_FEED, GET_REVIEW_FEED, GET_TASK_FEED } from '../../graphql/queries'
import { REACT_FEED_ITEM } from '../../graphql/mutations'
import { LikeOutline, LikeFilled } from '../../assets/images/reactions/like'
import { Paragraph, RegularText } from '../../storybook/stories/Text'
import { useNavigation } from '@react-navigation/native'
import { ShareModal, renderItem } from '../../components/Feed'

export const pageStyles = StyleSheet.create({
  container: {
    marginTop: spacingUnit * 3,
    paddingLeft: spacingUnit * 2,
    paddingRight: spacingUnit * 2
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center'
    // marginTop: -spacingUnit
  },
  priorityContainer: {
    flexDirection: 'row',
    marginRight: spacingUnit,
    paddingLeft: spacingUnit * 1.5,
    paddingRight: spacingUnit * 1.5,
    borderRadius: 8
  },
  markAsComplete: {
    borderColor: palette.green400,
    borderWidth: 1,
    marginRight: spacingUnit,
    paddingLeft: spacingUnit,
    paddingRight: spacingUnit,
    borderRadius: spacingUnit
  },
  title: {
    fontFamily: 'Rubik SemiBold',
    fontSize: 18,
    lineHeight: 24,
    color: palette.black,
    marginBottom: spacingUnit
  },
  paragraph: {
    fontFamily: 'Rubik Light',
    fontSize: 16,
    marginBottom: spacingUnit,
    lineHeight: 22
  },
  linkContainer: {
    flexDirection: 'row',
    marginTop: spacingUnit * 2
  },
  link: {
    fontFamily: 'Rubik Light',
    fontSize: 16,
    color: palette.blue400,
    marginLeft: spacingUnit
  },
  subContainer: {
    flexDirection: 'row',
    marginTop: spacingUnit * 2
  },
  additionalInfoText: {
    fontSize: 18,
    marginRight: spacingUnit * 0.5,

  }
})

export const sortPriority = (priority) => {
  switch(priority) {
    case 'high':
      return palette.red400
    case 'medium':
      return palette.yellow300
    case 'low':
      return palette.blue400
  }
}

export const ReactionFeed = ({ type, objId, user, tab }) => {
  const navigation = useNavigation()
  let variables, query
  if (type === 'goal') {
    variables = {
      goalId: objId
    }
    query = GET_GOAL_FEED
  } else if (type === 'task') {
    variables = {
      taskId: objId
    }
    query = GET_TASK_FEED
  } else if (type === 'ask') {
    variables = {
      askId: objId
    }
    query = GET_ASK_FEED
  } else if (type === 'weekly_review') {
    variables = {
      reviewId: objId
    }
    query = GET_REVIEW_FEED
  }

  const {
    data,
    loading,
    error
  } = useQuery(query, {
    variables
  })

  const [liked, setLiked] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false)
  const [reactionCount, setReactionCount] = useState(0)
  const [reactFeedItem] = useMutation(REACT_FEED_ITEM, {
    update(cache) {
      cache.modify({
        fields: {
          users(existingUser = {}) {
            if (liked && user && user.reactedFeedItems && user.reactedFeedItems.includes(item.id)) {
              // Unliked
              const newReactedFeedComments = user.reactedFeedItems.filter(reactedFeedComment => {
                return reactedFeedComment !== item.id
              })

              return [{
                ...user,
                reactedFeedItems: newReactedFeedComments
              }]
            } else if (!liked && user && user.reactedFeedItems && !user.reactedFeedItems.includes(item.id)) {
              return [{
                ...user,
                reactedFeedItems: [...user.reactedFeedItems, item.id]
              }]
            }
          }
        }
      })
    }
  })
  useEffect(() => {
    if (data && data.getFeedReactionObj) {
      const {
        id,
        commentCount,
        reactionCount
      } = data.getFeedReactionObj
      if (user && user.reactedFeedItems && user.reactedFeedItems.includes(id)) {
        setLiked(true)
      }
      if (reactionCount) {
        setReactionCount(Number(reactionCount))
      }
    }
  }, [data])

  let finalData = []
  if (type === 'goal') {
    finalData = data && data.getGoalFeed
  } else if (type === 'task') {
    finalData = data && data.getTaskFeed
  } else if (type === 'ask') {
    finalData = data && data.getAskFeed
  } else if (type === 'weekly_review') {
    finalData = data?.getReviewFeed
  }

  return (
    <>
    <Paragraph color={palette.grey800} style={{
      marginTop: spacingUnit * 2
    }}>
      Activity
    </Paragraph>
    <FlatList 
      contentContainerStyle={{
        paddingBottom: spacingUnit * 10,
        borderTopColor: palette.grey300,
        borderTopWidth: 1,
        marginTop: spacingUnit
      }}
      data={finalData}
      renderItem={({ item }) => renderItem({ item, navigation, screen: 'Root', activityPage: true, params: {
        screen: tab || 'Profile',
        params: {
          screen: 'FeedItem',
          params: {
            item
          }
        }
      } })}
      keyExtractor={item => item.id}
      ItemSeparatorComponent={() => (
        <View
          style={{
            borderBottomColor: palette.grey300,
            borderBottomWidth: 1,
          }}
        />
      )}
    >
    </FlatList>
    </>
  )


}