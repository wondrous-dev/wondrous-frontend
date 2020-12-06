import React, { useState } from 'react'
import {
  Appearance,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  AppState,
  Animated,
  ActivityIndicator,
  Image,
  Pressable,
  Dimensions
} from 'react-native'
import DraggableFlatList, { RenderItemInfo, OnMoveEndInfo } from 'react-native-draggable-flatlist'

import { Card } from '../Card'

const dummies = [
  {
    id: '1',
    name: 'Task 1',
    detail: 'Hello',
    priority: 'high',
    hasLeft: true,
    hasRight: false,
  },
  {
    id: '2',
    name: 'Goal 1',
    detail: 'must finish weekly goal',
    hasLeft: false,
    hasRight: true
  }
]
const {width} = Dimensions.get('window')

const parentWidth = width
const childrenWidth = width
const childrenHeight = 48


// Wrap ResponsiveGridLayout around Swiper
class CardList extends React.Component {
  state = {
    currentBreakpoint: "lg",
    compactType: "vertical",
    mounted: false,
    layouts: this.props.layouts || { lg: [] },
    data: this.props.data || dummies,
    scrollEnabled: true,
    onDragEnd: false
  }

  onMoveEnd = ({ data }: OnMoveEndInfo<Language>) => {
    this.setState({ data: data ? [...data] : [] })
  }

  constructor (props) {
    super(props)
  }

  itemRefs = new Map()

  renderItem = ({ item, drag, moveEnd, isActive }) => {
    return (
      <Card
        item={item}
        drag={drag}
        moveEnd={moveEnd}
        isActive={isActive}
        width={width}
        height={50}
        itemRefs={this.itemRefs}
        onDragEnd={this.state.onDragEnd}
      />
    )
  }

  onDragEnd = ({ data }) => {
    this.setState({
      data,
      onDrag: true
    })
  }

  render () {
    return (
      <SafeAreaView
        style={{
          marginTop: 50
        }}
      >
        <DraggableFlatList
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.id}
          onDragEnd={this.onDragEnd}
          activationDistance={15}
        />
          {/* <DragSortableView
              dataSource={this.state.cards}
              keyExtractor={(item,index)=> item.id}
              parentWidth={parentWidth}
              childrenWidth= {childrenWidth}
              childrenHeight={childrenHeight}
              scaleStatus={'scaleY'}
              onDragStart={(startIndex,endIndex)=>{
                console.log("THE FUCK")
                this.setState({
                    scrollEnabled: false
                })
            }}
            onDataChange = {(data)=>{
              console.log('data', data)
              if (data.length != this.state.cards.length) {
                  this.setState({
                      cards: data
                  })
              }
          }}
            onClickItem={(data,item,index)=>{
              console.log("ANYTHING")
            }}
            onDragEnd={(startIndex)=>{
              console.log('no dragging')
                this.setState({
                    scrollEnabled: true
                })
            }}
              sortable={true}
              renderItem={(item,index)=>{
                  return (
                    <Card width={childrenWidth} height={childrenHeight} />
                  )
              }}
          /> */}
      </SafeAreaView>
    )
  }

}

export { CardList }
