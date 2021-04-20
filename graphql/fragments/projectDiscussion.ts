import { gql } from '@apollo/client'

export const ProjectDiscussionFragment = gql`
  fragment PublicProjectDiscussion on ProjectDiscussion {
    id
    createdAt
    updatedAt
    createdBy
    projectId
    closedAt
    title
    content
    type
    images
    muxPlaybackId
    projectName
    creatorFirstName
    creatorLastName
    creatorProfilePicture
    creatorThumbnail
    creatorUsername
    projectOwnerId
    commentCount
  }
`

export const ProjectDiscussionCommentFragment = gql`
  fragment PublicProjectDiscussionComment on ProjectDiscussionComment {
    id
    actorFirstName
    actorLastName
    actorUsername
    actorProfilePicture
    actorThumbnail
    userId
    createdAt
    itemContent
  }
`