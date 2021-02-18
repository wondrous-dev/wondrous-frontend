import { useQuery } from '@apollo/client'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { SafeAreaView, View, StyleSheet } from 'react-native'
import { Header } from '../../components/Header'
import { White, Black, Red400, Green400 } from '../../constants/Colors'
import { GET_REVIEW_STATS } from '../../graphql/queries/review'
import { ButtonText, Paragraph, Subheading } from '../../storybook/stories/Text'
import { spacingUnit } from '../../utils/common'
import GoalIcon from '../../assets/images/review/goal'
import TaskIcon from '../../assets/images/review/task'
import { PrimaryButton } from '../../storybook/stories/Button'

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

const ReviewWelcome = ({ navigation, route }) => {
  const { data, loading, error } = useQuery(GET_REVIEW_STATS)
  const {
    tab
  } = route.params
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <Header />
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
                navigation.navigate('Root', {
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
    </SafeAreaView>
  )
}

export default ReviewWelcome