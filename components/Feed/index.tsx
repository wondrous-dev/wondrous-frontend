import React, { useEffect } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { Text, View, FlatList, StyleSheet } from 'react-native'

import { Grey300 } from '../../constants/Colors'
import { GET_HOME_FEED } from '../../graphql/queries'
import { spacingUnit } from '../../utils/common'

const feedStyles = StyleSheet.create({
  feedItemContainer: {
    padding: spacingUnit * 2
  }
})

export const renderItem = ({ item }) => {
  console.log('What the fuck')
  return (
    <View style={feedStyles.feedItemContainer}>
      <Text>Feed Items!</Text>
    </View>
  )
}

export const HomeFeed = () => {
  const [getItems, {loading, data, error, refetch, fetchMore}] = useLazyQuery(GET_HOME_FEED, {
    fetchPolicy: 'network-only'
  })
  if (error) {
    console.log('Error fetching Feed', error)
}

  useEffect(() => {
    getItems()
  }, [])
  console.log('data', data && data.getHomeFeed)

  return (
    <FlatList 
      data={data && data.getHomeFeed}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      onScrollEndDrag={() => getItems()}
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
