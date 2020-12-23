import React, { useCallback, useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { Text, View, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'

import { Grey300, Black, Grey200, Grey600, Grey700 } from '../../constants/Colors'
import { GET_HOME_FEED } from '../../graphql/queries'
import { SafeImage, SvgImage } from '../../storybook/stories/Image'
import { TinyText, RegularText } from '../../storybook/stories/Text'
import { spacingUnit, capitalizeFirstLetter } from '../../utils/common'
import DefaultProfilePicture from '../../assets/images/default-profile-picture.jpg'
import ProjectIcon from '../../assets/images/actions/project.svg'
import GoalIcon from '../../assets/images/actions/goal.svg'
import TaskIcon from '../../assets/images/actions/task.svg'
import CompletedIcon from '../../assets/images/actions/completed.svg'
import { LikeOutline } from '../../assets/images/reactions/like'
import CommentIcon from '../../assets/images/reactions/comment'
import ShareIcon from '../../assets/images/share/feed'

const feedStyles = StyleSheet.create({
  feedItemContainer: {
    padding: spacingUnit * 2
  },
  feedItemName: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  feedItemImage: {
    width: spacingUnit * 3,
    height: spacingUnit * 3,
    borderRadius: spacingUnit * 1.25,
    marginRight: spacingUnit
  },
  feedItemContent: {
    flex: 1,
    flexDirection: 'row',
    marginTop: spacingUnit * 3,
    alignContent: 'center',
    flexShrink: 1
  },
  reactions: {
    flexDirection: 'row',
    marginTop: spacingUnit * 3,
    alignItems: 'center'
  }
})

const getCorrectSrc = (itemType) => {
  switch(itemType) {
    case 'project':
      return ProjectIcon
    case 'goal':
      return GoalIcon
    case 'task':
      return TaskIcon
    default:
      return ''
  }
}

const FeedString = ({ item }) => {
  if (item.objectType === 'project') {
    return (
      <View style={{
        paddingRight: spacingUnit * 2
      }}>
        <RegularText color={Black} style={{
          flex: 1,
          flexWrap: 'wrap'
        }}>
          {capitalizeFirstLetter(item.verb)} {item.objectType} - <RegularText style={{
            fontFamily: 'Rubik SemiBold',
            textDecorationLine: 'underline'
          }}> {item.projectName} </RegularText>
        </RegularText>
      </View>
    )
  }
  if (item.objectType === 'goal' || item.objectType === 'task') {
    return (
      <View style={{
        paddingRight: spacingUnit * 2,
        flexDirection: 'row'
      }}>
      <RegularText color={Black} style={{
          flexWrap: 'wrap',
          flexShrink: 1
      }}>
        {capitalizeFirstLetter(item.verb)} {item.objectType} <RegularText style={{
          fontFamily: 'Rubik SemiBold',
          textDecorationLine: 'underline',
        }}>{item.itemName} </RegularText> for <RegularText style={{
          fontFamily: 'Rubik SemiBold',
          textDecorationLine: 'underline'
        }}> {item.projectName} </RegularText>
      </RegularText>
      </View>
    )
  }
  return null
}

export const renderItem = ({ item }) => {
  return (
    <View style={feedStyles.feedItemContainer}>
      <View style={feedStyles.feedItemName}>
        <SafeImage style={feedStyles.feedItemImage} src={item.actorProfilePicture} defaultImage={DefaultProfilePicture}/>
        <RegularText style={{
          marginRight: spacingUnit
        }} color={Black}>{item.actorFirstName} {item.actorLastName}</RegularText>
        <RegularText style={{
          marginRight: spacingUnit
        }} color={Grey200}>{item.actorUsername}</RegularText>
      </View>
      <View style={feedStyles.feedItemContent}>
        {/* <SvgImage width="24" height="24" srcElement={getCorrectSrc(item.objectType)} style={{
          marginRight: spacingUnit
        }}/> */}
        <FeedString item={item} />
      </View>
      <View style={feedStyles.reactions}>
        <LikeOutline color={Grey700} style={{
          marginRight: spacingUnit
        }} />
        <RegularText color={Grey600} style={{
          marginRight: spacingUnit * 3
        }}>{item.likeCount}</RegularText>
        <CommentIcon color={Grey700} style={{
          marginRight: spacingUnit
        }}/>
        <RegularText color={Grey600} style={{
          marginRight: spacingUnit * 3
        }}>{item.commentCount}</RegularText>
        <ShareIcon color={Grey700} />
      </View>
    </View>
  )
}

const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

export const HomeFeed = () => {
  const [refreshing, setRefreshing] = useState(false)
  const [getItems, {loading, data, error, refetch, fetchMore}] = useLazyQuery(GET_HOME_FEED, {
    fetchPolicy: 'network-only'
  })
  if (error) {
    console.log('Error fetching Feed', error)
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    getItems()
    wait(2000).then(() => setRefreshing(false))
  }, [])

  useEffect(() => {
    getItems()
  }, [])
  console.log('data', data && data.getHomeFeed)

  if (loading) {
    return <ActivityIndicator />
  }

  return (
    <FlatList 
      contentContainerStyle={{
        paddingBottom: spacingUnit * 10
      }}
      data={data && data.getHomeFeed}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ItemSeparatorComponent={() => (
        <View
          style={{
            borderBottomColor: Grey300,
            borderBottomWidth: 1,
          }}
        />
      )}
    >
    </FlatList>
  )
}
