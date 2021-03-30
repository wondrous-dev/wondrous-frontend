import { useQuery } from '@apollo/client'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { SafeAreaView, View, StyleSheet } from 'react-native'
import { getDay, differenceInDays } from 'date-fns'

import { Header } from '../../components/Header'
import { White, Black, Red400, Green400 } from '../../constants/Colors'
import { GET_LATEST_USER_REVIEW, GET_REVIEW_STATS } from '../../graphql/queries/review'
import { ButtonText, Paragraph, Subheading } from '../../storybook/stories/Text'
import { spacingUnit } from '../../utils/common'
import GoalIcon from '../../assets/images/review/goal'
import TaskIcon from '../../assets/images/review/task'
import { PrimaryButton } from '../../storybook/stories/Button'
import { useMe } from '../../components/withAuth'

const reviewStyles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacingUnit * 2
  },
  statImage: {
    width: 30,
    height: 30,
    marginRight: spacingUnit * 2
  }
})
const getCorrectStats = (reviewStats) => {
  const {
    differenceInAverageComplete
  } = reviewStats
  if (differenceInAverageComplete === 0) {
    return (
      <View style={reviewStyles.statRow}>
      <View>
        <Paragraph color={Black} style={{
          fontFamily: 'Rubik SemiBold'
        }}>
          +0{` `}
        </Paragraph>
      </View>
      <Paragraph color={Black}>
        same as weekly average
      </Paragraph>
      </View>
    )
  } else if (differenceInAverageComplete < 0) {
    return (
      <View style={reviewStyles.statRow}>
      <View>
        <Paragraph color={Red400} style={{
          fontFamily: 'Rubik SemiBold'
        }}>
          -{differenceInAverageComplete}{` `}
        </Paragraph>
      </View>
      <Paragraph color={Red400}>
        less than weekly average
      </Paragraph>
      </View>
    )
  } else if (differenceInAverageComplete > 0) {
    return (
      <View style={reviewStyles.statRow}>
      <View>
        <Paragraph color={Green400} style={{
          fontFamily: 'Rubik SemiBold',
        }}>
          +{differenceInAverageComplete}{` `}
        </Paragraph>
      </View>
      <Paragraph color={Green400}>
        more than weekly average!
      </Paragraph>
      </View>
    )
  }
}

const checkReviewDay = (day) => {
  if (day === 0 || day === 1 || day === 5 || day === 6) {
    return true
  }
  return false
}

const checkCanCreateReview = (lastestReview) =>{
  if (!lastestReview) {
    return true
  }
  const createdAt = new Date(lastestReview.createdAt)
  const getDayFromReview = getDay(createdAt)
  const diffInDays = Math.abs(differenceInDays(createdAt, new Date()))
  const today = getDay(new Date())
  if (checkReviewDay(today) && (diffInDays > 4 || (diffInDays === 4 && getDayFromReview === 1 && today === 5))) {
    return true
  }
  return false
}

const ReviewWelcome = ({ navigation, route }) => {
  const { data, loading, error } = useQuery(GET_REVIEW_STATS)
  const user = useMe()
  const {
    data: lastestReviewData
  } = useQuery(GET_LATEST_USER_REVIEW, {
    variables: {
      userId: user?.id
    }
  })

  const {
    tab
  } = route.params
  const lastestReview = lastestReviewData?.getLatestReviewFromUser
  const canCreateReview = checkCanCreateReview(lastestReview)
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <Header />
      {
        canCreateReview ?
      <View style={{
        alignItems: 'center',
        marginTop: spacingUnit * 5
      }}>
        <Subheading color={Black}>
          Your week in review
        </Subheading>
        {
          data && data.getReviewStats &&
          <>
            <View style={reviewStyles.statRow}>
              <TaskIcon style={reviewStyles.statImage} />
              <Paragraph color={Black}>
                <Paragraph style={{
                  fontFamily: 'Rubik SemiBold'
                }}>
                {data.getReviewStats.tasksCompleted}
                  </Paragraph> tasks completed
              </Paragraph>
            </View>
            <View style={reviewStyles.statRow}>
              <GoalIcon style={reviewStyles.statImage} />
              <Paragraph color={Black}>
              <Paragraph style={{
                  fontFamily: 'Rubik SemiBold'
                }}>
                {data.getReviewStats.goalsCompleted}
                  </Paragraph> goals completed
              </Paragraph>
            </View>
            {getCorrectStats(data.getReviewStats)}
            <PrimaryButton
              style={{
                alignSelf: 'center',
                marginTop: spacingUnit * 3.5 
              }}
              onPress={() => {
                navigation.push('Root', {
                  screen: tab || 'Profile',
                  params: {
                    screen: 'CreateReview'
                  }
                })
              }}
            >
              <ButtonText color={White}> Continue </ButtonText>
            </PrimaryButton>
          </>
        }
      </View>
      :
      <View style={{
        alignItems: 'center',
        marginTop: spacingUnit * 5,
        paddingLeft: spacingUnit * 2,
        paddingRight: spacingUnit * 2
      }}>
        <Paragraph style={{
          textAlign: 'center'
        }}>
           You can create a review from Friday to Monday, otherwise keep crushing it!
        </Paragraph>
      </View>
      }
    </SafeAreaView>
  )
}

export default ReviewWelcome