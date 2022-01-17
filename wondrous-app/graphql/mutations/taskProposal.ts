import { gql } from '@apollo/client'
import { TaskProposalFragment } from '../fragments/task'

export const CREATE_TASK_PROPOSAL = gql`
  mutation createTaskProposal($input: TaskProposalInput) {
    createTaskProposal(input: $input) {
      ...TaskProposalFragment
    }
  }
  ${TaskProposalFragment}
`

export const UPDATE_TASK_PROPOSAL = gql`
  mutation updateTaskProposal($taskProposalId: ID!, $input: TaskProposalInput) {
    updateTaskProposal(taskProposalId: $taskProposalId, input: $input) {
      ...TaskProposalFragment
    }
  }
  ${TaskProposalFragment}
`

export const DELETE_TASK_PROPOSAL = gql`
  mutation deleteProposal($taskId: String!) {
    deleteTaskProposal(taskId: $taskId) {
      success
    }
  }
`

export const APPROVE_TASK_PROPOSAL = gql`
  mutation approveProposal($proposalId: ID!) {
    approveTaskProposal(proposalId: $proposalId) {
      success
    }
  }
`

export const REQUEST_CHANGE_TASK_PROPOSAL = gql`
  mutation requestChangeTaskProposal($proposalId: ID!) {
    requestChangeTaskProposal(proposalId: $proposalId) {
      success
    }
  }
`
