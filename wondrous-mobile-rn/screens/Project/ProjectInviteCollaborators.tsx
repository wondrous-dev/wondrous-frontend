import React, { useState } from 'react'
import { SafeAreaView, FlatList, View, Image, StyleSheet, Dimensions, Platform, TextInput, TouchableOpacity, Pressable } from 'react-native'
import { Blue500, White } from '../../constants/Colors'
import { Header } from '../../components/Header'
import { Subheading, RegularText, ButtonText, ErrorText, Paragraph } from '../../storybook/stories/Text'
import { spacingUnit } from '../../utils/common'
import { InviteCollaboratorList } from '../Profile/InviteCollaboratorModal'
import { ContactsList } from '../Profile/ContactsModal'
import { StatusItem } from '../Profile/common'
import { useMe, withAuth } from '../../components/withAuth'
import { useMutation, useQuery } from '@apollo/client'

const styles = StyleSheet.create({
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacingUnit * 2,
    marginTop: spacingUnit * 3,
    paddingLeft: spacingUnit * 2,
    paddingRight: spacingUnit * 2
  }
})
const ProjectInviteCollaborators = ({
  navigation,
  route
}) => {
  const user = useMe()
  const [status, setStatus] = useState('external')
  const project = route?.params?.project
  const inviteInternal = status === 'internal'
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <Header title='Invite Collaborators' rightButton={{
        color: Blue500,
        text: 'Finish',
        onPress: async() => {
          if (!user?.usageProgress?.signupCompleted) {
            navigation.navigate('Root', {
              screen: 'Profile',
              params: {
                screen: 'UserProfile'
              }
            })
          } else {
            navigation.navigate('Root', {
              screen: 'Profile',
              params: {
                screen: 'ProjectProfile',
                params: {
                  projectId: project?.id,
                  noGoingBack: true
                }
              }
            })
          }
        }
      }}/>
      <View style={styles.pillContainer}>
      <StatusItem setStatus={setStatus} statusValue='external' statusLabel='Through text' statusTrue={status === 'external'} />
      <StatusItem setStatus={setStatus} statusValue='internal' statusLabel='Through Wonder' statusTrue={status === 'internal'} />

      </View>
      {
        inviteInternal ?
        <InviteCollaboratorList project={project} isVisible={inviteInternal} setModalVisible={() => {}} />
        :
        <ContactsList isVisible={!(inviteInternal)} setModalVisible={() => {}} />
      }
    </SafeAreaView>
  )
}

export default withAuth(ProjectInviteCollaborators)