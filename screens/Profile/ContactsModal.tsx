import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Image, Pressable, FlatList, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import * as Contacts from 'expo-contacts'

import { modalStyles } from '../../components/Modal/common'
import { spacingUnit } from '../../utils/common'
import { SearchBar } from '../../components/Header'
import DefaultProfilePicture from '../../assets/images/default-profile-picture.jpg'
import { listStyles, profileStyles } from './style'
import { White, Black, Blue400 } from '../../constants/Colors'
import { Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { SafeImage } from '../../storybook/stories/Image'
import * as SMS from 'expo-sms'
import { TESTFLIGHT_BETA_LINK } from '../../constants/index'
import { useMe } from '../../components/withAuth'
import { useNavigation } from '@react-navigation/core'
import { useMutation } from '@apollo/client'
import { CREATE_INVITE_LINK } from '../../graphql/mutations/userInvite'

const checkAndRequestsPermission = async ({ setPermissions }) => {
    const hasPermissions = await Contacts.getPermissionsAsync()
    if (!hasPermissions) {
      const requestPermissions = await Contacts.requestPermissionsAsync()
      setPermissions(requestPermissions?.granted)
    }
    setPermissions(hasPermissions?.granted)
}

const getContacts = async ({ setContacts }) => {
  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Image, Contacts.Fields.Name, Contacts.Fields.Emails],
  })
  setContacts(data)
}

const ContactItem = ({ item, setModalVisible }) => {
  const user = useMe()
  const phoneNumbers = item.phoneNumbers?.map(number => number.digits)
  const emails = item.emails?.map(email => email.email)
  const [createInviteLink] = useMutation(CREATE_INVITE_LINK, {
    variables: {
      phoneNumber: phoneNumbers && phoneNumbers[0],
      inviteeEmail: emails && emails[0]
    },
    onCompleted: (createInviteLinkData) => {
      const inviteLink = createInviteLinkData?.createInviteLink?.link
      const message = `You've been invited to the Wonder beta by @${user && user.username}! We're here to help your passion projects flourish. Join us at ${inviteLink}!`
      SMS.sendSMSAsync(
        phoneNumbers,
        message
      )
    }
  })
  return (
    <TouchableOpacity onPress={() => {      
      createInviteLink()
    }}>
    <View style={[listStyles.listItem, {
      alignItems: 'center',
      marginBottom: spacingUnit * 2.5
    }]}>
      {
        item.image ?
        <View>
        <SafeImage src={item.image.uri || ''} style={listStyles.listImage} />
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
        }} color={Black}>{item.name}</Subheading>
      </View>
{/* {
        invited
        ?
        <Pressable style={listStyles.followingButton}>
          <Paragraph color={Black}>
            Invited
          </Paragraph>
        </Pressable>
        :
        <Pressable onPress={() => {
          setInvited(true)
          inviteCollaborator()
        }} style={listStyles.followButton}>
          <Paragraph color={White}>
            Invite
          </Paragraph>
        </Pressable>
      } */}

    </View>
</TouchableOpacity>
  )
}

export const ContactsModal = ({ isVisible, setModalVisible }) => {
  const [permissions, setPermissions] = useState(null)
  const [contacts, setContacts] = useState([])
  const [searchString, setSearchString] = useState('')
  const navigation = useNavigation()
  useEffect(() => {
    if (permissions === null && isVisible) {
      checkAndRequestsPermission({ setPermissions })
    } else if (isVisible) {
      getContacts({ setContacts })
    }
  }, [permissions, isVisible])
  let filteredData = contacts
  if (searchString) {
    filteredData = filteredData && filteredData.filter(one => {
      return one && one.name && one.name.toLocaleLowerCase().includes(searchString.toLocaleLowerCase())
    })
  }

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
              <RegularText color={Blue400} style={{
                fontSize: 16
              }}>
                Cancel
              </RegularText>
              </Pressable>
              <View style={{
                flex: 2
              }}>
               
                <Subheading color={Black} style={{
                  fontSize: 20
                }}>
                  Invite friends
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
            <View style={{
              height: spacingUnit * 6
            }}>

            <SearchBar searchString={searchString} setSearchString={setSearchString} placeholder={'Search by username'} />
            </View>
            {
              (!filteredData || filteredData?.length === 0) &&
              <Paragraph style={{
                padding: spacingUnit * 2
              }} onPress={() => navigation.push('Root', {
                screen: 'Search',
                params: {
                  screen: 'Default'
                }
              })}>
                Your list might be empty because you haven't allowed Wonder to sync your contacts. Please go to your phone settings to change this.
              </Paragraph>
            }
            <FlatList
              data={filteredData}
              contentContainerStyle={listStyles.listContainer}
              renderItem={({ item }) => {

                return (
                  <ContactItem
                  item={item}
                  setModalVisible={setModalVisible}
                  />
                )
              }}
            />
      </SafeAreaView>
    </Modal>
  )
}