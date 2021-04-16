import { gql } from '@apollo/client'

import { ProjectDiscussionFragment, ProjectDiscussionCommentFragment } from '../fragments/projectDiscussion'

export const CREATE_PROJECT_DISCUSSION = gql`
  mutation CreateProjectDiscussion($input: ProjectDiscussionInput) {
    createProjectDiscussion(input: $input) {
      ...PublicProjectDiscussion
    }
  }
  ${ProjectDiscussionFragment}
`

export const UPDATE_PROJECT_DISCUSSION = gql`
  mutation UpdateProjectDiscussion($projectDiscussionId: ID!, $input: ProjectDiscussionInput) {
    updateProjectDiscussion(projectDiscussionId: $projectDiscussionId, input: $input) {
      ...PublicProjectDiscussion
    }
  }
  ${ProjectDiscussionFragment}
`

export const CLOSE_PROJECT_DISCUSSION = gql`
  mutation CloseProjectDiscussion($projectDiscussionId: ID!) {
    closeProjectDiscussion(projectDiscussionId: $projectDiscussionId) {
      success
    }
  }
`

export const CREATE_PROJECT_DISCUSSION_COMMENT = gql`
  mutation CreateProjectDiscussionComment($input: ProjectDiscussionCommentInput) {
    createProjectDiscussionComment(input: $input) {
      ...PublicProjectDiscussionComment
    }
  }
  ${ProjectDiscussionCommentFragment}
`