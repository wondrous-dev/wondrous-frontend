import { gql } from '@apollo/client';

export const CommentFragment = gql`
  fragment CommentFragment on Comment {
    id
    createdAt
    timestamp
    content
    parentCommentId
    actorFirstName
    actorLastName
    actorUsername
    userId
    actorProfilePicture
    reactionCount
    taskId
    proposalId
    submissionId
    additionalData {
      type
    }
  }
`;
