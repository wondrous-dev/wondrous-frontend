import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Image, Pressable } from 'react-native'
import Modal from 'react-native-modal'
import * as Contacts from 'expo-contacts'

import { modalStyles } from '../../components/Modal/common'
import { spacingUnit } from '../../utils/common'
import { SearchBar } from '../../components/Header'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import DefaultProfilePicture from '../../assets/images/default-profile-picture.jpg'
import { listStyles, profileStyles } from './style'
import { White, Black, Blue400 } from '../../constants/Colors'
import { RegularText, Subheading } from '../../storybook/stories/Text'
import { SafeImage } from '../../storybook/stories/Image'
import * as SMS from 'expo-sms'
import { TESTFLIGHT_BETA_LINK } from '../../utils/constants'

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
    fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Image, Contacts.Fields.Name],
  })
  setContacts(data)
}

const ContactItem = ({ item, setModalVisible }) => {
  const message = `You've been invited to the Wonder beta! We're here to help your passion projects flourish. Join us at ${TESTFLIGHT_BETA_LINK}!`
  return (
    <TouchableOpacity onPress={() => {
      const phoneNumbers = item.phoneNumbers?.map(number => number.digits)
      SMS.sendSMSAsync(
        phoneNumbers,
        message
      )
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
  useEffect(() => {
    if (permissions === null && isVisible) {
      checkAndRequestsPermission({ setPermissions })
    } else {
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