import { gql } from '@apollo/client';
import { CommentFragment } from 'graphql/fragments/comments';
import { MilestoneFragment } from 'graphql/fragments/task';

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

export const ARCHIVE_MILESTONE = gql`
  mutation archiveMilestone($milestoneId: ID!) {
    archiveMilestone(milestoneId: $milestoneId) {
      ...MilestoneFragment
    }
  }
  ${MilestoneFragment}
`;

export const UPDATE_MILESTONE_STATUS = gql`
  mutation updateMilestoneStatus($milestoneId: ID!, $input: updateStatusInput!) {
    updateMilestoneStatus(milestoneId: $milestoneId, input: $input) {
      ...MilestoneFragment
    }
  }
  ${MilestoneFragment}
`;

export const UPDATE_MILESTONE_OBSERVERS = gql`
  mutation updateMilestoneObservers($milestoneId: ID!, $observerIds: [String]!) {
    updateMilestoneObservers(milestoneId: $milestoneId, observerIds: $observerIds) {
      success
    }
  }
`;

export const REMOVE_MILESTONE_MEDIA = gql`
  mutation removeMilestoneMedia($milestoneId: ID!, $slug: String!) {
    removeMilestoneMedia(milestoneId: $milestoneId, slug: $slug) {
      success
    }
  }
`;

export const ATTACH_MILESTONE_MEDIA = gql`
  mutation attachMilestoneMedia($milestoneId: ID!, $input: AttachMediaInput) {
    attachMilestoneMedia(milestoneId: $milestoneId, input: $input) {
      ...MilestoneFragment
    }
  }
  ${MilestoneFragment}
`;

export const CREATE_MILESTONE_DISCORD_THREAD = gql`
  mutation createMilestoneDiscordThread($milestoneId: ID!) {
    createMilestoneDiscordThread(milestoneId: $milestoneId) {
      guildId
      threadId
    }
  }
`;

export const DUPLICATE_MILESTONE = gql`
  mutation duplicateMilestone($milestoneId: String!) {
    ...MilestoneFragment
  }
  ${MilestoneFragment}
`;

export const UNARCHIVE_MILESTONE = gql`
  mutation unarchiveMilestone($milestoneId: ID!) {
    unarchiveMilestone(milestoneId: $milestoneId) {
      ...MilestoneFragment
    }
  }
  ${MilestoneFragment}
`;
