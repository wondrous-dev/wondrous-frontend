import { gql } from '@apollo/client'
import { CommentFragment } from '../fragments/comments'
import { TaskProposalFragment } from '../fragments/task'

export const GET_TASK_PROPOSAL_BY_ID = gql`
  query getTaskProposalById($proposalId: ID!) {
    getTaskProposalById(proposalId: $proposalId) {
      ...TaskProposalFragment
    }
  }
  ${TaskProposalFragment}
`

export const GET_COMMENTS_FOR_TASK_PROPOSAL = gql`
  query getTaskProposalComments($proposalId: ID!) {
    getTaskProposalComments(proposalId: $proposalId) {
      ...CommentFragment
    }
  }
  ${CommentFragment}
`
