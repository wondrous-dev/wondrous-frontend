import React, { useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { SafeAreaView, TextInput, View, TouchableWithoutFeedback, Keyboard, Image, Pressable } from 'react-native'

import SearchIcon from '../../assets/images/bottomNav/search'
import { withAuth } from '../../components/withAuth'
import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { White, Grey100, Grey800, Grey300,Grey200, Black } from '../../constants/Colors'
import { spacingUnit } from '../../utils/common'
import { useQuery } from '@apollo/client'
import { GET_USERS_AND_PROJECTS } from '../../graphql/queries/search'
import { Paragraph, RegularText } from '../../storybook/stories/Text'
import { SafeImage } from '../../storybook/stories/Image'
import DefaultProfilePicture from '../../assets/images/default-profile-picture.jpg'
import { useNavigation } from '@react-navigation/native'

const SearchBar = () => {
  const [searchString, setSearchString] = useState('')
  return (
    <View style={{
      flexDirection: 'row',
      marginTop: spacingUnit * 2,
      alignItems: 'center',
      backgroundColor: Grey100,
      marginLeft: spacingUnit * 2,
      marginRight: spacingUnit * 2,
      borderRadius: spacingUnit * 2,
      padding: spacingUnit * 2
    }}>
      <TextInput
          value={searchString}
          onChangeText={setSearchString}
          placeholder='Search by username or project name'
      />
    </View>
  )
}

const SearchResult = ({ result, project, user }) => {
  const navigation = useNavigation()
  const {
    profilePicture,
    firstName,
    lastName,
    username,
    name,
    description,
    id
  } = result
  return (
    <Pressable onPress={() => {
      if (project) {
        navigation.navigate('Root', {
          screen: 'ProjectProfile',
          params: {
            projectId: id
          }
        })
      } else if (user) {
        navigation.navigate('Root', {
          screen: 'UserProfile',
          params: {
            userId: id
          }
        })
      }
    }} style={{
      flexDirection: 'row',
      borderBottomColor: Grey300,
      borderBottomWidth: 1,
      paddingLeft: spacingUnit * 2,
      paddingRight: spacingUnit * 2,
      paddingTop: spacingUnit * 1.5,
      paddingBottom: spacingUnit * 1.5
    }}>
      {
          profilePicture && profilePicture !== 'None' ?
          <SafeImage
          src={profilePicture} style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            marginRight: 8
          }} />
          :
          <Image source={DefaultProfilePicture} style={{
            marginRight: 8,
            width: 30,
            height: 30,
            borderRadius: 15
          }} />
                    
      }
      <View>
        <Paragraph style={{color: Black, fontWeight: 'bold', fontFamily: 'Rubik SemiBold'}}>
          {user ? `${firstName} ${lastName}` : name}
        </Paragraph>
        {
          user &&
          <RegularText color={Grey200} style={{ fontSize: 14 }}>
            @{username}
          </RegularText>
        }
        {
          project &&
          <RegularText color={Black}>
            {description}
          </RegularText>
        }
      </View>
    </Pressable>
  )
}

function SearchScreen({
  navigation
}: StackScreenProps<RootStackParamList, 'Dashboard'>) {
  const [searchString, setSearchString] = useState('')
  const { data: searchDataResp, loading, error} = useQuery(GET_USERS_AND_PROJECTS, {
    variables: {
      searchString
    }
  })

  const searchData = searchDataResp && searchDataResp.getUsersAndProjects

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <SafeAreaView style={{
      backgroundColor: White,
      flex: 1
    }}>
      <Header search={true} searchString={searchString} setSearchString={setSearchString} />
      {
        searchData && searchData.projects && searchData.users
        ?
        <>
        {
          searchData.projects.length > 0 && searchData.users.length > 0 ?
          <View style={{
            marginTop: spacingUnit * 2,
          }}>
            <Paragraph color={Grey800} style={{
              paddingLeft: spacingUnit * 2,
              paddingRight: spacingUnit * 2,
              marginBottom: spacingUnit
            }}>
              Users
            </Paragraph>
            {searchData.users.slice(0, 6).map(userResult => {
              return (
                <SearchResult user={true} result={userResult} />
              )
            })}
            <Paragraph color={Grey800} style={{
              paddingLeft: spacingUnit * 2,
              paddingRight: spacingUnit * 2,
              marignBottom: spacingUnit,
              marginTop: spacingUnit * 2
            }}>
              Projects
            </Paragraph>
            {
              searchData.projects.slice(0, 6).map(projectResult => {
                return (
                  <SearchResult project={true} result={projectResult} />
                )
              })
            }
          </View>
          :
          <Paragraph color={Grey800} style={{
            paddingLeft: spacingUnit * 2,
            marginTop: spacingUnit * 2
          }}>
            No results found
          </Paragraph>
        }
        </>
        :
        <View>

        </View>
      }
    </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

export default withAuth(SearchScreen)