import React, { useRef, useState } from 'react'
import { SafeAreaView, View, StyleSheet, Pressable, Dimensions, FlatList } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useQuery, useMutation } from '@apollo/client'

import { Paragraph, Subheading } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import { ProfileTabParamList } from '../../types'
import { withAuth, useMe } from '../../components/withAuth'
import { Header } from '../../components/Header'
import { Grey400, White, Black, Grey500, Blue500 } from '../../constants/Colors'
import { spacingUnit, getLocale } from '../../utils/common'
import AddIcon from '../../assets/images/add-dark-button.svg'
import { SvgImage } from '../../storybook/stories/Image'
import AskIcon from '../../assets/images/ask/standalone'
import { FullScreenAskModal } from '../../components/Modal/AskModal'
import { CREATE_ASK } from '../../graphql/mutations'
import { GET_ASKS_FROM_PROJECT } from '../../graphql/queries'
import { Card } from '../../storybook/stories/Card'
import { updateUsageProgress } from '../../utils/apollo'

const setupAskStyles = StyleSheet.create({
  setupAskContainer: {
    alignItems: 'center',
    paddingRight: spacingUnit * 2,
    paddingLeft: spacingUnit * 2,
    marginTop: spacingUnit * 3
  }
})

function SetupAskScreen({
  route,
  navigation
}: StackScreenProps<ProfileTabParamList, 'SetupAsk'>) {
  const {
    projectId
  } = route.params
  const user = useMe()
  const { data: askData, loading, error: askDataError } = useQuery(GET_ASKS_FROM_PROJECT, {
    variables: {
      projectId
    }
  })
  const [createAsk, { data: createAskData, loading: createAskLoading, error: createAskError }] = useMutation(CREATE_ASK, {
    update(cache, { data }) {
      cache.modify({
          fields: {
              getAsksFromProject(existingAsks=[]) {
                return [
                  data.createAsk,
                  ...existingAsks
                ]
              },
              users() {
                if (user) {
                  return updateUsageProgress({ user, newKey: 'askCreated' })
                }
              }
          }
      })
    }
  })

  const [modalVisible, setModalVisible] = useState(false)
  const askArray = askData && askData.getAsksFromProject
  const itemRefs = useRef(new Map())

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <Header rightButton={askArray && askArray.length > 0 && {
        color: Blue500,
        text: 'Continue',
        onPress: () => {
          navigation.navigate('Root', {
            screen: 'Profile',
            params: {
              screen: 'StreakIntro',
              params: {
                projectId
              }
            }
          })
        }
      }} />
      <FullScreenAskModal firstTime={true} setModalVisible={setModalVisible} isVisible={modalVisible} projectId={projectId} askMutation={createAsk} />
      <View style={{
        paddingLeft: spacingUnit * 2,
        paddingRight: spacingUnit * 2,
        marginTop: spacingUnit * 3,
      }}>
          {/* <CardList /> */}
          <FlatList
            data={askArray}
            ListHeaderComponent={() => (
              <View style={{
                alignItems: 'center'
              }}>
              <AskIcon style={{
                width: spacingUnit * 6,
                height: spacingUnit * 6
              }} />
              <Subheading color={Black} style={{
                marginTop: spacingUnit * 2
              }}>
                Add asks
              </Subheading>
              <Paragraph color={Grey500} style={{
                textAlign: 'center',
                paddingLeft: spacingUnit * 1.25,
                paddingRight: spacingUnit * 1.25,
                marginTop: spacingUnit
              }}>
                What do you need help with from your followers and the Wonder community?
              </Paragraph>
              <Pressable onPress={() => setModalVisible(true)}>
                <SvgImage width={spacingUnit * 8} height={spacingUnit * 8} srcElement={AddIcon} style={{
                  marginTop: spacingUnit * 3
                }} />
              </Pressable>
              </View>
            )}
            renderItem={({ item }) => <Card type='ask' navigation={navigation} route={route} iconSize={spacingUnit * 3} icon={AskIcon} profilePicture={user && (user.thumbnailPicture || user.profilePicture)} item={item} swipeEnabled={false} itemRefs={itemRefs && itemRefs.current} key={item && item.id} />}
            style={{
              marginBottom: spacingUnit * 3
            }}
          >

          </FlatList>
        </View>
    </SafeAreaView>
  )
}

export default withAuth(SetupAskScreen)