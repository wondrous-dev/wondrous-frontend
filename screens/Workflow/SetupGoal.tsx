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
import { spacingUnit } from '../../utils/common'
import AddIcon from '../../assets/images/add-dark-button.svg'
import { SvgImage } from '../../storybook/stories/Image'
import GoalIcon from '../../assets/images/goal/standalone'
import { FullScreenGoalModal } from '../../components/Modal/GoalModal'
import { CREATE_GOAL } from '../../graphql/mutations'
import { GET_GOALS_FROM_PROJECT } from '../../graphql/queries'
import { CardList } from '../../storybook/stories/CardList'
import { Card } from '../../storybook/stories/Card'
// import { FlatList } from 'react-native-gesture-handler'

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
    update(cache, { data }) {
      cache.modify({
          fields: {
              getGoalsFromProject(existingGoals=[]) {
                return [
                  ...existingGoals,
                  data.createGoal
                ]
              },
              users() {
                if (user) {
                  const newUsageProgress = user.usageProgress ? {
                    ...user.usageProgress,
                    goalCreated: true
                  } : {
                    goalCreated: true
                  }
                  return [{
                    ...user,
                    usageProgress: newUsageProgress
                  }]
                }
              }
          }
      })
    }
  })
  const [modalVisible, setModalVisible] = useState(false)
  const goalArray = goalData && goalData.getGoalsFromProject
  const itemRefs = useRef(new Map())
  // console.log('user', user, goalArray)
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <Header rightButton={goalArray && goalArray.length > 0 && {
        color: Blue500,
        text: 'Continue',
        onPress: () => {
          navigation.navigate('Root', {
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
      <View style={setupGoalStyles.setupGoalContainer}>
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
        <View>
          {/* <CardList /> */}
          <FlatList
            data={goalArray}
            style={{
              marginBottom: spacingUnit * 60
            }}
            ListFooterComponent={<View style={{marginBottom: 90, flex: 1}} />}
            renderItem={({ item }) => <Card navigation={navigation}  type='goal' icon={GoalIcon} iconSize={4 * spacingUnit} profilePicture={user && user.profilePicture} item={item} swipeEnabled={false} width={Dimensions.get('window').width} itemRefs={itemRefs && itemRefs.current} key={item && item.name} />}
          >

          </FlatList>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default withAuth(SetupGoalScreen)