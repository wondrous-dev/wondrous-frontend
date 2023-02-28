import { gql } from '@apollo/client';
import { CommentFragment } from 'graphql/fragments/comments';

export const CREATE_MILESTONE_COMMENT = gql`
  mutation createMilestoneComment($input: MilestoneCommentInput) {
    createMilestoneComment(input: $input) {
      ...CommentFragment
    }
  }
  ${CommentFragment}
`;

export const DELETE_MILESTONE_COMMENT = gql`
  mutation deleteMilestoneComment($milestoneCommentId: String!) {
    deleteMilestoneComment(milestoneCommentId: $milestoneCommentId) {
      success
    }
  }
`;
