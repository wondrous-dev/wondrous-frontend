import { gql } from '@apollo/client';
import { MilestoneFragment } from 'graphql/fragments/task';

export const GET_MILESTONE_BY_ID = gql`
  query getMilestoneById($milestoneId: ID!) {
    getMilestoneById(milestoneId: $milestoneId) {
      ...MilestoneFragment
    }
  }
  ${MilestoneFragment}
`;
