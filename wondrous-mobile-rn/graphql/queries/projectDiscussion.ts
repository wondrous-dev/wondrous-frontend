import { gql } from '@apollo/client'

import { ProjectDiscussionFragment, ProjectDiscussionCommentFragment } from '../fragments/projectDiscussion'

export const GET_PROJECT_DISCUSSION = gql`
  query GetProjectDiscussion($projectDiscussionId: ID!) {
    getProjectDiscussion(projectDiscussionId: $projectDiscussionId) {
      ...PublicProjectDiscussion
    }
  }
  ${ProjectDiscussionFragment}
`

export const GET_PROJECT_DISCUSSIONS = gql`
  query GetProjectDisucssions($projectId: ID!, $limit: Int, $offset: Int, $state: String) {
    getProjectDiscussions(projectId: $projectId, limit: $limit, offset: $offset, state: $state) {
      ...PublicProjectDiscussion
    }
  }
  ${ProjectDiscussionFragment}
`

export const GET_PROJECT_DISCUSSION_COMMENTS = gql`
  query GetProjectDiscussionComments($projectDiscussionId: ID!, $limit: Int, $offset: Int) {
    getProjectDiscussionComments(projectDiscussionId: $projectDiscussionId, limit: $limit, offset: $offset) {
      ...PublicProjectDiscussionComment
    }
  }
  ${ProjectDiscussionCommentFragment}
`

export const GET_PROJECT_DISCUSSION_FROM_COMMENT = gql`
  query GetProjectDiscussionFromComment($projectDiscussionCommentId: ID!) {
    getProjectDiscussionFromComment(projectDiscussionCommentId: $projectDiscussionCommentId) {
      ...PublicProjectDiscussion
    }
  }
  ${ProjectDiscussionFragment}
`