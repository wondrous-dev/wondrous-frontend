
import { GET_FEED_ITEM_FOR_FEED_COMMENT } from '../../graphql/queries'

import apollo from '../../services/apollo'

export const handleFeedCommentClick = async ({
  objectId,
  navigation,
  tab
}) => {
    // Fetch feed review id and then navigate there
    try {
      const feedResponse = await apollo.query({
        query: GET_FEED_ITEM_FOR_FEED_COMMENT,
        variables: {
          commentId: objectId
        }
      })
      if (feedResponse && feedResponse.data && feedResponse.data.getFeedItemForFeedComment) {
        navigation.push('Root', {
          screen: tab || 'Profile',
          params: {
            screen: 'ProfileItem',
            params: {
              item: feedResponse.data.getFeedItemForFeedComment,
              comment: true,
              standAlone: true
            }
          }
        })
      }
    } catch (err) {
      console.log('err')
    }
}