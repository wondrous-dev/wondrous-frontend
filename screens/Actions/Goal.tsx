import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, ScrollView } from 'react-native'
import { useLazyQuery, useMutation } from '@apollo/client'

import { withAuth, useMe } from '../../components/withAuth'
import { Header } from '../../components/Header'
import { Grey800, Purple, Red400, White, Yellow300, Blue400, Grey450, Black } from '../../constants/Colors'
import { FullScreenGoalModal } from '../../components/Modal/GoalModal'
import { pageStyles, sortPriority } from './common'
import { UPDATE_GOAL } from '../../graphql/mutations'
import { ErrorText, Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import PriorityFlame from '../../assets/images/modal/priority'
import { capitalizeFirstLetter, renderMentionString, spacingUnit } from '../../utils/common'
import { Tag } from '../../components/Tag'
import { formatDueDate, redDate } from '../../utils/date'
import { GET_GOAL_BY_ID } from '../../graphql/queries'
import { MyCarousel } from '../../storybook/stories/Carousel'
import { LinkIcon } from '../../assets/images/link'

const GoalPage = ({ navigation, route }) => {
  const user = useMe()
  const {
    goal: initialGoal,
    goalId
  } = route.params
  const [goal, setGoal] = useState(initialGoal)
  const ownedByUser = (goal && goal.ownerId) === (user && user.id)
  const [modalVisible, setModalVisible] = useState(false)
  const [getGoal, {
    data,
    loading,
    error
  }] = useLazyQuery(GET_GOAL_BY_ID)
  const [updateGoal] = useMutation(UPDATE_GOAL, {
    update: (cache) => {
      cache.modify({
        fields: {
          getGoalsFromProject(existingGoals=[]) {
            // console.log('existingGoals', existingGoals)
            return existingGoals
          }
        }
      })
    }
  })

  useEffect(() => {
    if (!goal) {
      getGoal({
        variables: {
          goalId
        }
      })
    }
    if (data) {
      setGoal(data.getGoalById)
    }
  }, [data])


  if (!goal) {
    return (
      <View>
        {/* <ErrorText>
          No goal found
        </ErrorText> */}
      </View>
    )
  }
  const images = goal.additionalData && goal.additionalData.images
  const asks = goal.additionalData && goal.additionalData.relatedAskIds
  const tasks = goal.additionalData && goal.additionalData.relatedTaskIds
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <FullScreenGoalModal setModalVisible={setModalVisible} isVisible={modalVisible} setup={true} goal={goal} goalMutation={updateGoal} />
      <Header rightButton={ownedByUser && {
        style: {
          borderWidth: 1,
          borderColor: Grey800
        },
        textColor: Grey800,
        text: 'Edit Profile',
        onPress: () => {
          setModalVisible(true)
        }
      }}/>
      <ScrollView style={pageStyles.container}>
        <Text style={pageStyles.title}>
          {renderMentionString({ content: goal.name, navigation })}
        </Text>
        <View style={pageStyles.infoContainer}>
          {
              goal.priority &&
              <View style={[pageStyles.priorityContainer, {
                backgroundColor: sortPriority(goal.priority)
              }]}>
              <PriorityFlame color={White} style={{
                // marginLeft: spacingUnit,
                marginRight: spacingUnit
              }} />
              <RegularText color={White}>
                {capitalizeFirstLetter(goal.priority)} Priority
              </RegularText>
              </View>
            }
            {
              goal.project &&
              <Tag color={Purple} style={{
                marginRight: spacingUnit  
              }}>
                <RegularText color={White}>
                  {goal.project && goal.project.name}
                </RegularText>
              </Tag>
            }
            { goal.dueDate &&
                <RegularText color={redDate(goal.dueDate) ? Red400 : Grey450}>
                Due {formatDueDate(new Date(goal.dueDate))}
              </RegularText>
            }
        </View>
        {
          goal.description &&
          <View>
            <Text style={pageStyles.paragraph}>
              {renderMentionString({content: goal.description, navigation })}
            </Text>
          </View>
        }
        {
          goal.additionalData && goal.additionalData.link &&
          <View style={pageStyles.linkContainer}>
            <LinkIcon color={Grey800} style={{
              marginRight: spacingUnit
            }} />
            <Paragraph color={Blue400} style={pageStyles.link}>
              {goal.additionalData.link}
            </Paragraph>
          </View>
        }
        <View style={pageStyles.imageContainer}>
        {
          images &&
          <MyCarousel data={images} images={true} passiveDotColor={Grey800} activeDotColor={Blue400}/>
        }
        </View>
        <View style={pageStyles.subContainer}>
        {
          asks &&
          <>
          <Paragraph color={Black} style={{
            fontSize: 18
          }}>
            {asks.length}
          </Paragraph>
          <Paragraph color={Black}>
            asks
          </Paragraph>
          </>
        }
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default withAuth(GoalPage)