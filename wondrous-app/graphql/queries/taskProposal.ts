import { gql } from '@apollo/client'
import { TaskProposalFragment } from '../fragments/task'

export const GET_TASK_PROPOSAL_BY_ID = gql`
  query getTaskProposalById($proposalId: ID!) {
    getTaskProposalById(proposalId: $proposalId) {
      ...TaskProposalFragment
    }
  }
  ${TaskProposalFragment}
`
