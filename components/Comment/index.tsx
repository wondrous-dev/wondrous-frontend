import * as React from 'react'
import { SafeAreaView, View, FlatList } from 'react-native'

const renderComment = ({ item }) => {
  return (
    <View>
      
    </View>
  )
}

export const CommentContainer = ({ comments }) => {
  return (
    <FlatList
      data={comments}
      renderItem={renderComment}
    >

    </FlatList>
  )
}