import { useQuery, useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { Black, Blue400, Red400, Yellow300, Grey700, Grey800, Grey300 } from '../../constants/Colors'
import { spacingUnit } from '../../utils/common'
import { GET_FEED_REACTION_OBJ } from '../../graphql/queries'
import { REACT_FEED_ITEM } from '../../graphql/mutations'
import { LikeOutline, LikeFilled } from '../../assets/images/reactions/like'
import { Paragraph, RegularText } from '../../storybook/stories/Text'
import { useNavigation } from '@react-navigation/native'
import { ShareModal } from '../../components/Feed'

export const pageStyles = StyleSheet.create({
  container: {
    marginTop: spacingUnit * 3,
    paddingLeft: spacingUnit * 2,
    paddingRight: spacingUnit * 2
  },
  infoContainer: {
    flexDirection: 'row',
    marginTop: spacingUnit * 1.5
  },
  priorityContainer: {
    flexDirection: 'row',
    marginRight: spacingUnit,
    paddingLeft: spacingUnit * 1.5,
    paddingRight: spacingUnit * 1.5,
    borderRadius: 8
  },
  title: {
    fontFamily: 'Rubik SemiBold',
    fontSize: 18,
    lineHeight: 24,
    color: Black
  },
  paragraph: {
    fontFamily: 'Rubik Light',
    fontSize: 16,
    marginTop: spacingUnit
  },
  linkContainer: {
    flexDirection: 'row',
    marginTop: spacingUnit * 2
  },
  link: {
    fontFamily: 'Rubik Light',
    fontSize: 16,
    color: Blue400,
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
      return Red400
    case 'medium':
      return Yellow300
    case 'low':
      return Blue400
  }
}

export const ReactionFeed = ({ type, objId, user }) => {
  const navigation = useNavigation()
  const {
    data,
    loading,
    error
  } = useQuery(GET_FEED_REACTION_OBJ, {
    variables: {
      feedObjectId: objId,
      feedObjectType: type
    }
  })
  const [liked, setLiked] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false)
  const [reactionCount, setReactionCount] = useState(0)
  const [reactFeedItem] = useMutation(REACT_FEED_ITEM, {
    update(cache) {
      cache.modify({
        fields: {
          users(existingUser = {}) {
            if (liked && user && user.reactedFeedComments && user.reactedFeedComments.includes(item.id)) {
              // Unliked
              const newReactedFeedComments = user.reactedFeedComments.filter(reactedFeedComment => {
                return reactedFeedComment !== item.id
              })

              return [{
                ...user,
                reactedFeedComments: newReactedFeedComments
              }]
            } else if (!liked && user && user.reactedFeedComments && !user.reactedFeedComments.includes(item.id)) {
              return [{
                ...user,
                reactedFeedComments: [...user.reactedFeedComments, item.id]
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
      if (user && user.reactedFeedComments && user.reactedFeedComments.includes(id)) {
        setLiked(true)
      }
      if (reactionCount) {
        setReactionCount(Number(reactionCount))
      }
    }
  }, [data])
  const feedReactions = data && data.getFeedReactionObject
  const SHARE_URL = `https://wonderapp.co/feed/${feedReactions && feedReactions.id}`
  const CONTENT = 'Check this discussion from Wonder!'
  return (
    <View style={{
      marginTop: spacingUnit * 2
    }}>
    <ShareModal isVisible={isModalVisible} url={SHARE_URL} content={CONTENT} setModalVisible={setModalVisible} />
      {
        feedReactions &&
        <>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            {
              reactionCount > 0 &&
              <>
          {
            liked  ?
            <LikeFilled color={Red400} style={{
              marginRight: spacingUnit
            }} />
            :
            <LikeOutline color={Grey700} style={{
              marginRight: spacingUnit
            }} />
          }
            <View>
              <Paragraph color={liked ? Red400 : Grey800}>
                {feedReactions.reactionCount}
              </Paragraph>
            </View>
              </>
            }
          </View>
          <View>
            <Paragraph color={Grey800} onPress={() => navigation.navigate('Root', {
            screen: 'Profile',
            params: {
              screen: 'ProfileItem',
              params: {
                item: feedReactions,
                liked: false,
                comment: true,
                standAlone: true
              }
            }
          })}>
              {feedReactions.commentCount} comments
            </Paragraph>
          </View>
        </View>
        </>
      }
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          borderBottomColor: Grey300,
          paddingBottom: spacingUnit,
          borderBottomWidth: 1,
          paddingTop: spacingUnit,
          paddingTop: spacingUnit,
          marginTop: spacingUnit,
          ...((reactionCount > 0 || (feedReactions && feedReactions.commentCount > 0)) && {
            borderTopWidth: 1,
            borderTopColor: Grey300
          })
        }}>
          <Paragraph color={liked ? Blue400 : Grey800} onPress={() => {
            if (feedReactions && feedReactions.id) {
              reactFeedItem({
                variables: {
                  feedItemId: feedReactions && feedReactions.id
                }
              })
            }
            if (!liked) {
              setReactionCount(reactionCount + 1)
            } else if (liked) {
              setReactionCount(reactionCount - 1)
            }
            setLiked(!liked)
          }}>
            {liked ? 'Liked' : 'Like'}
          </Paragraph>
          <Paragraph color={Grey800} onPress={() => navigation.navigate('Root', {
            screen: 'Profile',
            params: {
              screen: 'ProfileItem',
              params: {
                item: feedReactions,
                liked: false,
                comment: true,
                standAlone: true
              }
            }
          })}>
            Comment
          </Paragraph>
          <Paragraph color={Grey800} onPress={() => setModalVisible(true)}>
            Share
          </Paragraph>
        </View>
    </View>
  )


}