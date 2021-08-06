import { gql } from '@apollo/client'

import { PublicProjectFragment } from '../fragments/project'

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: ProjectUpdateInput, $firstTime: Boolean) {
    createProject(input: $input, firstTime: $firstTime) {
      ...PublicProject
    }
  }
  ${PublicProjectFragment}
`
export const UPDATE_PROJECT = gql`
  mutation UpdateProject($projectId: ID, $input: ProjectUpdateInput, $firstTime: Boolean) {
    updateProject(projectId: $projectId, input: $input, firstTime: $firstTime) {
      ...PublicProject
    }
  }
  ${PublicProjectFragment}
`
export const FOLLOW_PROJECT = gql`
  mutation FollowProject($projectId: ID!) {
    followProject(projectId: $projectId) {
      success
    }
  }
`

export const APPROVE_FOLLOW_REQUEST = gql`
  mutation ApproveFollowRequest($projectId: ID!, $userId: ID!) {
    approveProjectFollowRequest(projectId: $projectId, userId: $userId) {
      success
    }
  }
`

export const REMOVE_FOLLOW_REQUEST = gql`
  mutation RemoveFollowRequest($projectId: ID!, $userId: ID!) {
    removeProjectFollowRequest(projectId: $projectId, userId: $userId) {
      success
    }
  }
`

export const UNFOLLOW_PROJECT = gql`
  mutation UnfollowProject($projectId: ID!) {
    unfollowProject(projectId: $projectId) {
      success
    }
  }
`

export const CREATE_PROJECT_TAGS = gql`
  mutation CreateProjectTags($projectId: ID, $input: ProjectTagsInput, $firstTime: Boolean) {
    createProjectTags(projectId: $projectId, input: $input, firstTime: $firstTime) {
      ...PublicProject
    }
  }
  ${PublicProjectFragment}
`

export const INVITE_COLLABORATOR = gql`
  mutation InviteCollaboratorToProject($input: ProjectInviteInput) {
    inviteCollaboratorToProject(input: $input) {
      success
    }
  }
`

export const ACCEPT_PROJECT_INVITE = gql`
  mutation AcceptProjectInvite($projectInviteId: ID) {
    acceptProjectInvite(projectInviteId: $projectInviteId) {
      success
    }
  }
`

export const REJECT_PROJECT_INVITE = gql`
  mutation RejectProjectInvite($projectInviteId: ID) {
    rejectProjectInvite(projectInviteId: $projectInviteId) {
      success
    }
  }
`