
import React, { useState, useCallback, useEffect } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { Dimensions, Image, Pressable, SafeAreaView, StyleSheet, View, RefreshControl, FlatList, Button, TouchableOpacity } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { useMutation, useLazyQuery, useQuery } from '@apollo/client'
import * as Linking from 'expo-linking'

import { GET_USER_PROJECTS } from '../../graphql/queries'
import { withAuth, useMe } from '../../components/withAuth'
import { Black, White, Grey800 } from '../../constants/Colors'
import { Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { spacingUnit, cutString } from '../../utils/common'
import { ProfilePlaceholder } from './common'
import { SafeImage } from '../../storybook/stories/Image'
import DefaultProfilePicture from '../../assets/images/default-profile-picture.jpg'
import { Header } from '../../components/Header'


const listStyles = StyleSheet.create({
  listContainer: {
    marginTop: spacingUnit * 2
  },
  listItem: {
    flexDirection: 'row',
    paddingLeft: spacingUnit * 2,
    paddingRight: spacingUnit * 2,
    alignItems: 'flex-start',
    marginBottom: spacingUnit
  },
  listImage: {
    width: spacingUnit * 6,
    height: spacingUnit * 6,
    borderRadius: spacingUnit * 3,
    marginRight: spacingUnit
  }
})

const ProjectItem = ({
  profilePicture,
  project,
  user, 
  itemName,
  itemDescription,
  buttonOnPress,
  buttonText,
  itemPressed }) => {

  return (
    <TouchableOpacity onPress={itemPressed}>
      <View style={listStyles.listItem}>
        {
          profilePicture ?
          <View>
          <SafeImage src={profilePicture} style={listStyles.listImage} />
          </View>
          :
          (project
            ?
            <ProfilePlaceholder />
            :
            <Image source={DefaultProfilePicture} style={{
              marginRight: 8,
              width: spacingUnit * 4,
              height: spacingUnit * 4,
              borderRadius: 2
            }} />
          )
        }
        <View style={{
          paddingRight: spacingUnit,
          flex: 1
        }}>
          <Subheading style={{
            fontSize: 18
          }} color={Black}>{itemName}</Subheading>
          {itemDescription &&
            <RegularText color={Grey800} style={{
              marginTop: spacingUnit * 0.5
            }}>
            {cutString(itemDescription)}
          </RegularText>
          }
        </View>
        {
          buttonText &&
          <Pressable onPress={buttonOnPress}>
            <RegularText color={Black}>
              {buttonText}
            </RegularText>
          </Pressable>
        }
      </View>
    </TouchableOpacity>
  )
}
const ProjectList = ({
  navigation
}) => {

  const user = useMe()
  const {
    data,
    loading,
    error
  } = useQuery(GET_USER_PROJECTS, {
    variables: {
      userId: user && user.id
    }
  })

  const projects = data && data.getUserProjects
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <Header title={user && user.username} />
      <View>
        <Subheading>
          Projects
        </Subheading>
        <View style={listStyles.listContainer}>
          {
            projects && projects.map(projectItem => {
              const project = projectItem.project
              return (
                <ProjectItem
                key={project.id}
              profilePicture={project.profilePicture}
              project={true}
              itemDescription={project.description}
              itemName={project.name}
              itemPressed={() => navigation.navigate('Root', {
                screen: 'Profile',
                params: {
                  screen: 'ProjectProfile',
                  params: {
                    projectId: project.id
                  }
                }
              })}
              />
              )
            })
          }
        </View>
      </View>
    </SafeAreaView>
  )
}

export default withAuth(ProjectList)