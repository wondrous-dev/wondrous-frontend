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
