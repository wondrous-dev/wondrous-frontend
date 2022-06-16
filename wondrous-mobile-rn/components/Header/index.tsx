import React, { useState } from 'react'
import { SafeAreaView, View, Pressable, TextInput, StyleSheet, Keyboard } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'

import palette from 'theme/palette'
import { Title, RegularText, Subheading } from '../../storybook/stories/Text'
import BackCaret from '../../assets/images/back-caret'
import { spacingUnit } from '../../utils/common'
import SearchIcon from '../../assets/images/bottomNav/search'
import AddFriend from '../../assets/images/add-friend'
import Cancel from '../../assets/images/cancel'
import { Streak } from '../Streak'
import { GET_USER_STREAK } from '../../graphql/queries'
import { useQuery } from '@apollo/client'
import { useMe } from '../../components/withAuth'
import { ContactsModal } from '../../screens/Profile/ContactsModal'
import Options from '../../assets/images/options'

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

export const SearchBar = ({ searchString, setSearchString, setFocus, placeholder='' }) => {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.grey100,
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
      <SearchIcon iconColor={palette.grey800} />
      <TextInput
          value={searchString}
          onChangeText={setSearchString}
          placeholder= {placeholder || 'Search by username or project name'}
          style={{
            flex: 1,
            marginLeft: spacingUnit * 0.5,
            fontSize: 16
          }}
          onFocus={() => {
            if (setFocus) {
              setFocus(true)
            }
          }}
      />
      <Cancel color={palette.grey800} onPress={() => {
        if (!searchString) {
          Keyboard.dismiss()
        }
        setSearchString('')
        if (setFocus) {
          setFocus(false)
        }
      }} />
    </View>
  )
}

export const Header = ({
  title,
  skip,
  skipParams,
  noGoingBack,
  options,
  rightButton,
  search,
  searchString,
  setSearchString,
  streak,
  setFocus
}) => {
  const route = useRoute()
  const navigation = useNavigation()
  const backPage = noGoingBack ? false : shouldBackPage(route)
  const [modalVisible, setModalVisible] = useState(false)
  const [contactsModal, setContactsModal] = useState(false)
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
      borderBottomColor: palette.grey300,
    }}>
      <ContactsModal isVisible={contactsModal} setModalVisible={setContactsModal} />
      <Pressable onPress={() => {
        navigation.pop()
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
        !backPage &&
        <Pressable style={{
          position: 'absolute',
          marginLeft: spacingUnit * 2
        }} onPress={() => setContactsModal(true)}>
        <AddFriend />
        </Pressable>
      }
      {
        title ?
        <Subheading color={palette.black}>
          {title}
        </Subheading>
        :
        <>
        {search ?
        <SearchBar searchString={searchString} setSearchString={setSearchString} setFocus={setFocus} />
      :
      <Title style={{
        color: palette.orange,
        // flex: 2
      }}>
        W
      </Title>}
        </>
      }
      {
        skip &&
        <Pressable onPress={() => {
          navigation.push(skip, skipParams)
        }} style={{
          marginRight: spacingUnit * 2,
          marginLeft: -spacingUnit * 2
        }}>
          <RegularText color={palette.grey250}>
            Skip
          </RegularText>
        </Pressable>
      }
      {
        options &&
        <Pressable style={{
          right: spacingUnit * 2,
          position: 'absolute'
        }} onPress={() => {
          const optionPress = options.setModalVisible
          optionPress(true)
        }}>
              <Options color={palette.grey700} />
          </Pressable>
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
          <RegularText color={rightButton.textColor || palette.white}>
            {rightButton.text}
          </RegularText>
        </Pressable>
        </View>
      }
      {
        !skip && !rightButton &&
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
