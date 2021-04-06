import React, { useRef, useState } from 'react'
import { SafeAreaView, View, StyleSheet, Pressable, FlatList } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useQuery, useMutation } from '@apollo/client'

import { Paragraph, Subheading } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import { ProfileTabParamList } from '../../types'
import { withAuth, useMe } from '../../components/withAuth'
import { Header } from '../../components/Header'
import { Grey400, White, Black, Grey500, Blue500 } from '../../constants/Colors'
import { spacingUnit } from '../../utils/common'
import AddIcon from '../../assets/images/add-dark-button.svg'
import { SvgImage } from '../../storybook/stories/Image'
import GoalIcon from '../../assets/images/goal/standalone'
import { FullScreenGoalModal } from '../../components/Modal/GoalModal'
import { CREATE_GOAL } from '../../graphql/mutations'
import { GET_GOALS_FROM_PROJECT, GET_USER_STREAK } from '../../graphql/queries'
import { CardList } from '../../storybook/stories/CardList'
import { Card } from '../../storybook/stories/Card'
import { WHOAMI } from '../../graphql/queries'
import { updateUsageProgress } from '../../utils/apollo'

const setupGoalStyles = StyleSheet.create({
  setupGoalContainer: {
    alignItems: 'center',
    paddingRight: spacingUnit * 2,
    paddingLeft: spacingUnit * 2,
    marginTop: spacingUnit * 3
  }
})


function SetupGoalScreen({
  route,
  navigation
}: StackScreenProps<ProfileTabParamList, 'SetupGoal'>) {
  const {
    projectId
  } = route.params
  const user = useMe()
  const { data: goalData, loading, error } = useQuery(GET_GOALS_FROM_PROJECT, {
    variables: {
      projectId
    }
  })

  const [createGoal] = useMutation(CREATE_GOAL, {
    refetchQueries: [
      { query: GET_USER_STREAK, variables: {
        userId: user && user.id
      } }
    ],
    update(cache, { data }) {
      cache.modify({
          fields: {
              getGoalsFromProject(existingGoals=[]) {
                const goalArray = goalData && goalData.getGoalsFromProject
                return [
                  data.createGoal,
                  ...goalArray
                ]
              },
              users() {
                const newUser = updateUsageProgress({ user, newKey: 'goalCreated' })
                return newUser
              }
          }
      })
    }
  })
  const [modalVisible, setModalVisible] = useState(false)
  const goalArray = goalData && goalData.getGoalsFromProject
  const itemRefs = useRef(new Map())
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <Header rightButton={goalArray && goalArray.length > 0 && {
        color: Blue500,
        text: 'Continue',
        onPress: () => {
          navigation.push('Root', {
            screen: 'Profile',
            params: {
              screen: 'SetupTask',
              params: {
                projectId
              }
            }
          })
        }
      }} />
      <FullScreenGoalModal firstTime={true} setModalVisible={setModalVisible} isVisible={modalVisible} setup={true} projectId={projectId} goalMutation={createGoal} />
          {/* <CardList /> */}
          <View style={setupGoalStyles.setupGoalContainer}>
          <FlatList
            data={goalArray}
            ListHeaderComponent={() => (
            <View style={{
              alignItems: 'center'
            }}>
                <GoalIcon style={{
                  width: spacingUnit * 8,
                  height: spacingUnit * 8
                }} />
                <Subheading color={Black} style={{
                  marginTop: spacingUnit * 2
                }}>
                  Add goals
                </Subheading>
                <Paragraph color={Grey500} style={{
                  textAlign: 'center',
                  paddingLeft: spacingUnit * 1.25,
                  paddingRight: spacingUnit * 1.25,
                  marginTop: spacingUnit
                }}>
                  Goals are measurable wins you want to achieve with this project
                </Paragraph>
                <Pressable onPress={() => setModalVisible(true)}>
                  <SvgImage width={spacingUnit * 8} height={spacingUnit * 8} srcElement={AddIcon} style={{
                    marginTop: spacingUnit * 3
                  }} />
                </Pressable>
            </View>
            )}
            ListFooterComponent={<View style={{ marginBottom: spacingUnit * 3 }} />}
            renderItem={({ item }) => {
              return (
                <Card navigation={navigation} route={route}  type='goal' icon={GoalIcon} iconSize={4 * spacingUnit} profilePicture={user && (user.thumbnailPicture || user.profilePicture)} item={item} swipeEnabled={false} itemRefs={itemRefs && itemRefs.current} key={item && item.id} />
              )
            }}
          >

          </FlatList>
          </View>
    </SafeAreaView>
  )
}

export default withAuth(SetupGoalScreen)