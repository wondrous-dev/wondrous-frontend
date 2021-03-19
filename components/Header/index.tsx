import React, { useState } from 'react'
import { SafeAreaView, View, Pressable, TextInput, StyleSheet } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
// import * as Sharing from 'expo-sharing'

import { Orange, Grey300, Grey250, Grey100, White, Black, Grey800, Blue400 } from '../../constants/Colors'
import { Title, RegularText, Subheading, Paragraph } from '../../storybook/stories/Text'
import BackCaret from '../../assets/images/back-caret'
import { spacingUnit } from '../../utils/common'
import { ShareModal } from '../Feed'
import SearchIcon from '../../assets/images/bottomNav/search'
import Cancel from '../../assets/images/cancel'
import { Streak } from '../Streak'
import { GET_USER_STREAK } from '../../graphql/queries'
import { useQuery } from '@apollo/client'
import { useMe } from '../../components/withAuth'


const shouldbackPageRoutes = {
  'Dashboard': true,
  'Search': true,
  'Notifications': true,
  'Welcome': true,
  'Profile': true,
  'Feed': true
}


const shouldBackPage = (route) => {
  if (route.name && (route.name in shouldbackPageRoutes )) {
    return false
  }
  return true
}

export const SearchBar = ({ searchString, setSearchString, placeholder='' }) => {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Grey100,
      marginLeft: spacingUnit * 2,
      marginRight: spacingUnit * 2,
      borderRadius: spacingUnit * 2,
      padding: spacingUnit * 2,
      paddingLeft: spacingUnit,
      paddingTop: spacingUnit * 1.5,
      paddingBottom: spacingUnit * 1.5,
      marginBottom: spacingUnit * 0.5,
      flex: 1
    }}>
      <SearchIcon iconColor={Grey800} />
      <TextInput
          value={searchString}
          onChangeText={setSearchString}
          placeholder= {placeholder || 'Search by username or project name'}
          style={{
            flex: 1,
            marginLeft: spacingUnit * 0.5,
            fontSize: 16
          }}
      />
      <Cancel color={Grey800} onPress={() => setSearchString('')} />
    </View>
  )
}

export const Header = ({
  title,
  skip,
  skipParams,
  noGoingBack,
  share,
  rightButton,
  search,
  searchString,
  setSearchString,
  streak
}) => {
  const route = useRoute()
  const navigation = useNavigation()
  const backPage = noGoingBack ? false : shouldBackPage(route)
  const [modalVisible, setModalVisible] = useState(false)
  const user = useMe()
  const { data, loading, error } = useQuery(GET_USER_STREAK, {
    variables: {
      userId: user && user.id
    }
  })
  return (
    <SafeAreaView style={{
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      height: 64,
      borderBottomWidth: 1,
      borderBottomColor: Grey300,
    }}>
      <Pressable onPress={() => {
        navigation.goBack()
      }} style={{
        width: 50,
        marginRight: -50
      }}>
      {
        backPage &&
        <BackCaret />
      }
      </Pressable>
      {
        !backPage && share && rightButton &&
        <View />
      }
      {
        title ?
        <Subheading color={Black}>
          {title}
        </Subheading>
        :
        <>
        {search ?
        <SearchBar searchString={searchString} setSearchString={setSearchString} />
      :
      <Title style={{
        color: Orange,
        // flex: 2
      }}>
        W
      </Title>}
        </>
      }
      {
        skip &&
        <Pressable onPress={() => {
          navigation.navigate(skip, skipParams)
        }} style={{
          marginRight: spacingUnit * 2,
          marginLeft: -spacingUnit * 2
        }}>
          <RegularText color={Grey250}>
            Skip
          </RegularText>
        </Pressable>
      }
      {
        share &&
        <View>
        <ShareModal isVisible={modalVisible} url={share} content='' setModalVisible={setModalVisible} />
        <Pressable onPress={() => {
          setModalVisible(true)
        }} style={{
          right: spacingUnit * 2,
          top: -spacingUnit,
          position: 'absolute'
        }}>
          <RegularText color={Grey250}>
            Share
          </RegularText>
        </Pressable>
        </View>
      }
      {
        rightButton &&
        <View>
        <Pressable onPress={rightButton.onPress} style={{
          backgroundColor: rightButton.color,
          right: spacingUnit * 2,
          top: -spacingUnit * 2.5,
          borderRadius: 4,
          padding: spacingUnit,
          paddingLeft: spacingUnit * 1.5,
          paddingRight: spacingUnit * 1.5,
          position: 'absolute',
          ...(rightButton.style && {
            ...rightButton.style
          })
        }}>
          <RegularText color={rightButton.textColor || White}>
            {rightButton.text}
          </RegularText>
        </Pressable>
        </View>
      }
      {
        !skip && !rightButton && !share &&
        <View />
      }
      {
        streak && data &&
        <View style={{
          right: spacingUnit * 2,
          position: 'absolute'
        }}>
          <Streak streak={data.getUserStreak} />
        </View>

      }
    </SafeAreaView>
  )
}
