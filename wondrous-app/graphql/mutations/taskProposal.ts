import { gql } from '@apollo/client';
import { CommentFragment } from '../fragments/comments';
import { MediaFragment } from '../fragments/media';
import { TaskProposalFragment } from '../fragments/task';

export const CREATE_TASK_PROPOSAL = gql`
  mutation createTaskProposal($input: TaskProposalInput) {
    createTaskProposal(input: $input) {
      ...TaskProposalFragment
    }
  }
  ${TaskProposalFragment}
`;

export const UPDATE_TASK_PROPOSAL = gql`
  mutation updateTaskProposal($proposalId: ID!, $input: TaskProposalInput) {
    updateTaskProposal(proposalId: $proposalId, input: $input) {
      ...TaskProposalFragment
    }
  }
  ${TaskProposalFragment}
`;

export const DELETE_TASK_PROPOSAL = gql`
  mutation deleteTaskProposal($proposalId: ID!) {
    deleteTaskProposal(proposalId: $proposalId) {
      success
    }
  }
`;

export const UPDATE_TASK_PROPOSAL_ASSIGNEE = gql`
  mutation updateTaskAssignee($proposalId: ID!, $assigneeId: ID!) {
    updateTaskProposalAssignee(proposalId: $proposalId, assigneeId: $assigneeId) {
      ...TaskProposalFragment
    }
  }
  ${TaskProposalFragment}
`;

export const CLOSE_TASK_PROPOSAL = gql`
  mutation closeTaskProposal($proposalId: ID!) {
    closeTaskProposal(proposalId: $proposalId) {
      success
    }
  }
`;

export const APPROVE_TASK_PROPOSAL = gql`
  mutation approveProposal($proposalId: ID!) {
    approveTaskProposal(proposalId: $proposalId) {
      ...TaskProposalFragment
    }
  }
  ${TaskProposalFragment}
`;

export const REQUEST_CHANGE_TASK_PROPOSAL = gql`
  mutation requestChangeTaskProposal($proposalId: ID!) {
    requestChangeTaskProposal(proposalId: $proposalId) {
      success
    }
  }
`;

export const ATTACH_MEDIA_TO_TASK_PROPOSAL = gql`
  mutation attachTaskProposalMedia($proposalId: ID!, $input: AttachMediaInput!) {
    attachTaskProposalMedia(proposalId: $proposalId, input: $input) {
      id
      media {
        ...MediaFragment
      }
    }
  }
  ${MediaFragment}
`;

export const REMOVE_MEDIA_FROM_TASK_PROPOSAL = gql`
  mutation removeTaskProposalMedia($proposalId: ID!, $slug: String!) {
    removeTaskProposalMedia(proposalId: $proposalId, slug: $slug) {
      success
    }
  }
`;

export const CREATE_TASK_PROPOSAL_COMMENT = gql`
  mutation createTaskProposalComment($input: ProposalCommentInput) {
    createTaskProposalComment(input: $input) {
      ...CommentFragment
    }
  }
  ${CommentFragment}
`;

export const DELETE_TASK_PROPOSAL_COMMENT = gql`
  mutation deleteTaskProposalComment($proposalCommentId: String!) {
    deleteTaskProposalComment(proposalCommentId: $proposalCommentId) {
      success
    }
  }
`;
export const VOTE_FOR_PROPOSAL = gql`
  mutation voteForProposal($taskProposalId: ID!, $choice: String!) {
    voteForProposal(taskProposalId: $taskProposalId, choice: $choice) {
      success
    }
  }
`;

export const REMOVE_TASK_PROPOSAL_VOTE = gql`
  mutation removeProposalVote($taskProposalId: ID!) {
    removeProposalVote(taskProposalId: $taskProposalId) {
      success
    }
  }
`;
