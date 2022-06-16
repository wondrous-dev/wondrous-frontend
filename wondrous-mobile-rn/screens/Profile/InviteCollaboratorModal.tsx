import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView, FlatList, View, Image, TouchableOpacity, Pressable } from 'react-native'
import Modal from 'react-native-modal'
import { useMutation, useQuery, useLazyQuery } from '@apollo/client'
import * as Analytics from 'expo-firebase-analytics'

import { palette.black, White, palette.blue400, palette.grey400, palette.grey800, palette.grey750, palette.blue500, palette.red400, palette.yellow300, palette.grey300 } from '../../constants/Colors'
import { ErrorText, Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { capitalizeFirstLetter, cutString, getNonWhiteSpaceLength, spacingUnit } from '../../utils/common'
import { modalStyles } from '../../components/Modal/common'
import { SafeImage } from '../../storybook/stories/Image'
import { useMe } from '../../components/withAuth'
import DefaultProfilePicture from '../../assets/images/default-profile-picture.jpg'
import { ProfilePlaceholder } from './common'
import { listStyles, profileStyles } from './style'
import { SearchBar } from '../../components/Header'
import { useNavigation, useRoute } from '@react-navigation/native'
import { GET_PROJECT_INVITES, GET_USER_FOLLOWERS, GET_USER_FOLLOWING } from '../../graphql/queries'
import { INVITE_COLLABORATOR } from '../../graphql/mutations'
import { LogEvents } from '../../utils/analytics'


export const CollaboratorItem = ({ item, project, initialInvited, projectInvites, setModalVisible }) => {
  const navigation = useNavigation()
  const route = useRoute()
  const user = useMe()
  const [invited, setInvited] = useState(initialInvited)
  const [inviteCollaborator] = useMutation(INVITE_COLLABORATOR, {
    variables: {
      input: {
        projectId: project && project.id,
        inviteeId: item.id,
        role: 'collaborator'
      }
    },
    update(cache) {
      cache.modify({
        fields: {
          getProjectInvitesForProject() {
            const newProjectInvite = {
              project: {
                id: project.id
              },
              invitor: {
                id: user?.id
              },
              invitee: {
                id: item.id
              },
              role: 'collaborator'
            }
            if (projectInvites) {
              const newArr = [
                ...projectInvites,
                newProjectInvite
              ]
              return newArr
            }
            return [newProjectInvite]
          }
        }
      })
    }
  })

  return (
    <TouchableOpacity onPress={() => {
      if (setModalVisible) {
        setModalVisible(false)
      }
      navigation.navigate('Root', {
        screen: route && route.params && route.params.tab || 'Profile',
        params: {
          screen: 'OtherUserProfile',
          params: {
            userId: item.id
          }
        }
      })
    }}>
    <View style={[listStyles.listItem, {
      alignItems: 'flex-start',
      marginBottom: spacingUnit * 2.5
    }]}>
      {
        item.profilePicture ?
        <View>
        <SafeImage src={item.thumbnailPicture || item.profilePicture} style={listStyles.listImage} />
        </View>
        :
        <Image source={DefaultProfilePicture} style={{
          marginRight: 8,
          width: spacingUnit * 6,
          height: spacingUnit * 6,
          borderRadius: spacingUnit * 3
        }} />
      }
      <View style={{
        paddingRight: spacingUnit,
        flex: 1
      }}>
        <Subheading style={{
          fontSize: 16
        }} color={palette.black}>{(item?.firstName || '') + ' ' +  (item?.lastName || '')}</Subheading>
        {item?.username &&
        <RegularText color={palette.grey800}>
          @{item?.username}
        </RegularText>}
        {item?.bio &&
          <RegularText color={palette.black} style={{
            marginTop: spacingUnit * 0.5
          }}>
          {cutString(item?.bio)}
        </RegularText>
        }
      </View>
{
        invited
        ?
        <Pressable style={listStyles.followingButton}>
          <Paragraph color={palette.black}>
            Invited
          </Paragraph>
        </Pressable>
        :
        <Pressable onPress={() => {
          setInvited(true)
          try {
            Analytics.logEvent(LogEvents.INVITE_INTERNAL_COLLABORATOR, {
              user_id: user?.id,
              inviteeId: item.id
            })
          } catch (err) {
            console.log('Error logging inviting internal collaborator: ', err)
          }
          inviteCollaborator()
        }} style={listStyles.followButton}>
          <Paragraph color={White}>
            Invite
          </Paragraph>
        </Pressable>
      }

    </View>
</TouchableOpacity>
  )
}

export const InviteCollaboratorList = ({ isVisible, project, setModalVisible }) => {
    const {
      data: followingData,
      loading: followingLoading,
      error: followingError
    } = useQuery(GET_USER_FOLLOWING, {
      fetchPolicy: 'no-cache'
    })
    const [getProjectInvites, {
      data: projectInviteData
    }] = useLazyQuery(GET_PROJECT_INVITES, {
      variables: {
        projectId: project.id
      },
      fetchPolicy: 'network-only'
    })

    const [searchString, setSearchString] = useState('')

    const following = followingData && followingData.getUserFollowing && followingData.getUserFollowing.users
    let filteredData = following && following.filter(item => {
      return !(project.collaborators && project.collaborators.some(element => element.user.id === item.id))
    })

    if (searchString) {
      filteredData = filteredData && filteredData.filter(one => {
        return one.username.toLocaleLowerCase().includes(searchString.toLocaleLowerCase())
      })
    }
    useEffect(() => {
      if (isVisible) {
        getProjectInvites()
      }
    }, [isVisible])

    const projectInvites = projectInviteData && projectInviteData.getProjectInvitesForProject
  return (
    <>
      <View style={{
              height: spacingUnit * 6
            }}>
      <SearchBar searchString={searchString} setSearchString={setSearchString} placeholder={'Search by username'} />
      </View>
      {
        (!filteredData || filteredData?.length === 0) &&
        <Paragraph style={{
          padding: spacingUnit * 2
        }} onPress={() => navigation.navigate('Root', {
          screen: 'Search',
          params: {
            screen: 'Default'
          }
        })}>
          You can only invite users you follow. Go to our <Paragraph color={palette.blue400}>
            search page
          </Paragraph> to find some cool projects or users to follow!
        </Paragraph>
      }
      <FlatList
        data={filteredData}
        contentContainerStyle={listStyles.listContainer}
        renderItem={({ item }) => {
          const invited = projectInvites && projectInvites.some(element => {
            return element?.inviteeId === item?.id
          })
          return (
            <CollaboratorItem
            item={item}
            project={project}
            initialInvited={invited}
            projectInvites={projectInvites}
            setModalVisible={setModalVisible}
            />
          )
        }}
      />
      </>
  )
}
export const InviteCollaboratorModal = ({ project, inviteMutation, isVisible, setModalVisible}) => {

  return (
    <Modal isVisible={isVisible}>
      <SafeAreaView style={modalStyles.fullScreenContainer}>
      <View style={{
        ...modalStyles.topRowContainer,
        marginBottom: spacingUnit * 2
      }}>
              <Pressable onPress={() => {
                setModalVisible(false)
              }} style={{
                flex: 1
              }}>
              <RegularText color={palette.blue400} style={{
                fontSize: 16
              }}>
                Cancel
              </RegularText>
              </Pressable>
              <View style={{
                flex: 2
              }}>
                <Subheading color={palette.black} style={{
                  fontSize: 20
                }}>
                  Invite collaborators
                </Subheading>
              </View>
              <View style={{
                flex: 1,
              }}>
              <Pressable style={modalStyles.createUpdateButton} onPress={() => {
                setModalVisible(false)
              }}>
                <RegularText color={White} style={{
                  fontSize: 16
                }}>
                  Done
                </RegularText>
              </Pressable>
              </View>
            </View>
            <InviteCollaboratorList isVisible={isVisible} project={project} setModalVisible={setModalVisible} />
      </SafeAreaView>
    </Modal>
  )
}