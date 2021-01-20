import { gql } from '@apollo/client'

import { PublicGoalFragment } from '../fragments/goal'

export const CREATE_GOAL = gql`
  mutation CreateGoal($input: GoalInput) {
    createGoal(input: $input) {
      ...PublicGoal
    }
  }
  ${PublicGoalFragment}
`

export const UPDATE_GOAL = gql`
  mutation UpdateGoal($goalId: ID!, $input: GoalInput) {
    updateGoal(goalId: $goalId, input: $input) {
      ...PublicGoal
    }
  }
  ${PublicGoalFragment}
`
