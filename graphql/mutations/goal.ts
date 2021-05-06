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

export const DELETE_GOAL = gql`
  mutation DeleteGoal($goalId: ID!) {
    deleteGoal(goalId: $goalId) {
      success
    }
  }
`

export const COMPLETE_GOAL = gql`
  mutation CompleteGoal($goalId: ID!) {
    completeGoal(goalId: $goalId) {
      ...PublicGoal
    }
  }
  ${PublicGoalFragment}
`

export const NUDGE_GOAL = gql`
  mutation NudgeGoal($goalId: String!) {
    nudgeGoal(goalId: $goalId) {
      success
    }
  }
`