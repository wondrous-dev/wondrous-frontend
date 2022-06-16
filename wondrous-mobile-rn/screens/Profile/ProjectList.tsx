
import React, { useEffect, useState, useCallback } from 'react'
import { Image, Pressable, SafeAreaView, RefreshControl, FlatList, View, TouchableOpacity } from 'react-native'
import { useLazyQuery } from '@apollo/client'

import { GET_USER_PROJECTS } from '../../graphql/queries'
import { withAuth, useMe } from '../../components/withAuth'
import { palette.black, White, palette.grey800 } from '../../constants/Colors'
import { Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { spacingUnit, cutString, wait } from '../../utils/common'
import { ProfilePlaceholder } from './common'
import { SafeImage } from '../../storybook/stories/Image'
import DefaultProfilePicture from '../../assets/images/default-profile-picture.jpg'
import { Header } from '../../components/Header'
import { listStyles } from './style'

export const ProjectItem = ({
  profilePicture,
  project,
  user, 
  itemName,
  itemDescription,
  buttonOnPress,
  buttonText,
  itemPressed,
  privacyLevel
  }) => {
  const publicProject = privacyLevel === 'public'
  const userFollowingProject = user?.projectsFollowing.some(id => id === projectId)
  const accessible = publicProject || userFollowingProject
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
            <ProfilePlaceholder imageStyle={{
              width: spacingUnit * 6,
              height: spacingUnit * 6,
              marginRight: spacingUnit
            }} />
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
          }} color={palette.black}>{itemName}</Subheading>
          {itemDescription && accessible &&
            <RegularText color={palette.grey800} style={{
              marginTop: spacingUnit * 0.5
            }}>
            {cutString(itemDescription)}
          </RegularText>
          }
        </View>
        {
          buttonText &&
          <Pressable onPress={buttonOnPress}>
            <RegularText color={palette.black}>
              {buttonText}
            </RegularText>
          </Pressable>
        }
      </View>
    </TouchableOpacity>
  )
}
const ProjectList = ({
  navigation,
  route
}) => {

  const {
    userId,
    user,
    tab
  } = route.params
  const [refreshing, setRefreshing] = useState(false)
  const [
    getUserProjects,
    {
      data,
      loading,
      error
    }
  ] = useLazyQuery(GET_USER_PROJECTS, {
    variables: {
      userId
    },
    fetchPolicy: 'network-only'
  })

  const projects = data && data.getUserProjects
  
  useEffect(() => {
    getUserProjects()
  }, [])
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    getUserProjects()
    wait(2000).then(() => setRefreshing(false))
  }, [])

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

        <FlatList    
        contentContainerStyle={listStyles.listContainer}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        data={projects}
        renderItem={({ item }) => {
          const project = item.project
          return (
            <ProjectItem
            key={project.id}
            profilePicture={project.profilePicture}
            project={true}
            privacyLevel={project?.privacyLevel}
            itemDescription={project.description}
            itemName={project.name}
            itemPressed={() => navigation.navigate('Root', {
              screen: tab || 'Profile',
              params: {
                screen: 'ProjectProfile',
                params: {
                  projectId: project.id
                }
              }
            })}
            />
          )
        }}
          ></FlatList>
        </View>
    </SafeAreaView>
  )
}

export default withAuth(ProjectList)