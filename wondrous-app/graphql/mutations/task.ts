import { gql } from '@apollo/client';
import { CommentFragment } from 'graphql/fragments/comments';
import { MediaFragment } from 'graphql/fragments/media';
import {
  BountyFragment,
  MilestoneFragment,
  FullTaskFragment,
  MinimalTaskFragment,
  TaskTemplateFragment,
} from 'graphql/fragments/task';

export const CREATE_TASK = gql`
  mutation createTask($input: TaskInput) {
    createTask(input: $input) {
      ...FullTaskFragment
    }
  }
  ${FullTaskFragment}
`;

export const CREATE_TASK_TEMPLATE = gql`
  mutation createTaskTemplate($input: TaskTemplateInput) {
    createTaskTemplate(input: $input) {
      ...TaskTemplateFragment
    }
  }
  ${TaskTemplateFragment}
`;

export const UPDATE_TASK_TEMPLATE = gql`
  mutation updateTaskTemplate($taskTemplateId: ID!, $input: TaskTemplateInput) {
    updateTaskTemplate(taskTemplateId: $taskTemplateId, input: $input) {
      ...TaskTemplateFragment
    }
  }
  ${TaskTemplateFragment}
`;

export const DELETE_TASK_TEMPLATE = gql`
  mutation deleteTaskTemplate($taskTemplateId: ID!) {
    deleteTaskTemplate(taskTemplateId: $taskTemplateId) {
      success
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation updateTask($taskId: ID!, $input: TaskInput) {
    updateTask(taskId: $taskId, input: $input) {
      ...FullTaskFragment
    }
  }
  ${FullTaskFragment}
`;

export const UPDATE_TASK_SHOW_SUBMISSIONS = gql`
  mutation updateTaskHideSubmissions($taskId: ID!, $hideSubmissions: Boolean!) {
    updateTaskHideSubmissions(taskId: $taskId, hideSubmissions: $hideSubmissions) {
      id
    }
  }
`;

export const DELETE_TASK = gql`
  mutation deleteTask($taskId: ID!) {
    deleteTask(taskId: $taskId) {
      success
    }
  }
`;

export const ATTACH_MEDIA_TO_TASK = gql`
  mutation attachTaskMedia($taskId: ID!, $input: AttachMediaInput) {
    attachTaskMedia(taskId: $taskId, input: $input) {
      id
      media {
        ...MediaFragment
      }
    }
  }
  ${MediaFragment}
`;

export const REMOVE_MEDIA_FROM_TASK = gql`
  mutation removeTaskMedia($taskId: ID!, $slug: String!) {
    removeTaskMedia(taskId: $taskId, slug: $slug) {
      success
    }
  }
`;

export const UPDATE_TASK_STATUS = gql`
  mutation updateTaskStatus($taskId: ID!, $input: updateStatusInput!) {
    updateTaskStatus(taskId: $taskId, input: $input) {
      ...MinimalTaskFragment
    }
  }
  ${MinimalTaskFragment}
`;

export const ARCHIVE_TASK = gql`
  mutation archiveTask($taskId: ID!) {
    archiveTask(taskId: $taskId) {
      ...FullTaskFragment
    }
  }
  ${FullTaskFragment}
`;

export const UNARCHIVE_TASK = gql`
  mutation unarchiveTask($taskId: ID!) {
    unarchiveTask(taskId: $taskId) {
      ...FullTaskFragment
    }
  }
  ${FullTaskFragment}
`;

export const CREATE_TASK_COMMENT = gql`
  mutation createTaskComment($input: TaskCommentInput) {
    createTaskComment(input: $input) {
      ...CommentFragment
    }
  }
  ${CommentFragment}
`;

export const DELETE_TASK_COMMENT = gql`
  mutation deleteTaskComment($taskCommentId: String!) {
    deleteTaskComment(taskCommentId: $taskCommentId) {
      success
    }
  }
`;

export const IMPORT_TASKS = gql`
  mutation importTasks($input: [TaskInput]) {
    importTasks(input: $input) {
      success
    }
  }
`;

export const CREATE_MILESTONE = gql`
  mutation createMilestone($input: TaskInput) {
    createMilestone(input: $input) {
      ...MilestoneFragment
    }
  }
  ${MilestoneFragment}
`;

export const DELETE_MILESTONE = gql`
  mutation deleteMilestone($milestoneId: ID!) {
    deleteMilestone(milestoneId: $milestoneId) {
      success
    }
  }
`;

export const UPDATE_TASK_ASSIGNEE = gql`
  mutation updateTaskAssignee($taskId: ID!, $assigneeId: ID!) {
    updateTaskAssignee(taskId: $taskId, assigneeId: $assigneeId) {
      ...FullTaskFragment
    }
  }
  ${FullTaskFragment}
`;

export const REMOVE_TASK_ASSIGNEE = gql`
  mutation removeTaskAssignee($taskId: ID!) {
    removeTaskAssignee(taskId: $taskId) {
      ...FullTaskFragment
    }
  }
  ${FullTaskFragment}
`;

export const UPDATE_MILESTONE = gql`
  mutation updateMilestone($milestoneId: ID!, $input: TaskInput) {
    updateMilestone(milestoneId: $milestoneId, input: $input) {
      ...MilestoneFragment
    }
  }
  ${MilestoneFragment}
`;

export const UPDATE_TASK_ORDER = gql`
  mutation updateTaskOrder($taskId: ID!, $input: updateTaskOrderInput!) {
    updateTaskOrder(taskId: $taskId, input: $input) {
      success
    }
  }
`;

export const CREATE_BOUNTY = gql`
  mutation createBounty($input: BountyInput) {
    createBounty(input: $input) {
      ...BountyFragment
    }
  }
  ${BountyFragment}
`;

export const UPDATE_BOUNTY = gql`
  mutation updateBounty($bountyId: ID!, $input: BountyInput) {
    updateBounty(bountyId: $bountyId, input: $input) {
      ...BountyFragment
    }
  }
  ${BountyFragment}
`;

export const UPDATE_BOUNTY_STATUS = gql`
  mutation updateBountyStatus($bountyId: ID!, $input: updateStatusInput!) {
    updateBountyStatus(bountyId: $bountyId, input: $input) {
      ...BountyFragment
    }
  }
  ${BountyFragment}
`;

export const COMPLETE_MILESTONE = gql`
  mutation completeMilestone($milestoneId: ID!, $timezone: String) {
    completeMilestone(milestoneId: $milestoneId, timezone: $timezone) {
      ...MilestoneFragment
    }
  }
  ${MilestoneFragment}
`;

export const COMPLETE_BOUNTY = gql`
  mutation completeBounty($bountyId: ID!, $timezone: String) {
    completeBounty(bountyId: $bountyId, timezone: $timezone) {
      ...BountyFragment
    }
  }
  ${BountyFragment}
`;

export const CREATE_TASK_GITHUB_ISSUE = gql`
  mutation createTaskGithubIssue($taskId: ID!, $repoPathname: String!) {
    createTaskGithubIssue(taskId: $taskId, repoPathname: $repoPathname) {
      id
      url
    }
  }
`;

export const TURN_TASK_TO_BOUNTY = gql`
  mutation turnTaskToBounty($taskId: ID!) {
    turnTaskToBounty(taskId: $taskId) {
      ...BountyFragment
    }
  }
  ${BountyFragment}
`;

export const CREATE_TASK_DISCORD_THREAD = gql`
  mutation createTaskDiscordThread($taskId: ID!) {
    createTaskDiscordThread(taskId: $taskId) {
      guildIds

      threadIds
    }
  }
`;

export const UPDATE_TASK_OBSERVERS = gql`
  mutation updateTaskObservers($taskId: ID!, $observerIds: [String]!) {
    updateTaskObservers(taskId: $taskId, observerIds: $observerIds) {
      title # maybe this should be returning simple response instead?
    }
  }
`;

export const DUPLICATE_TASK = gql`
  mutation duplicateTask($taskId: ID!) {
    duplicateTask(taskId: $taskId) {
      title # maybe this should be returning simple response instead?
    }
  }
`;

export const UPDATE_TASK_REVIEWERS = gql`
  mutation updateTaskReviewers($taskId: ID!, $reviewerIds: [String]!) {
    updateTaskReviewers(taskId: $taskId, reviewerIds: $reviewerIds) {
      success
    }
  }
`;

export const MINT_TASK = gql`
  mutation taskMint($taskId: ID!, $title: String, $description: String, $links: [String]) {
    taskMint(taskId: $taskId, title: $title, description: $description, links: $links)
  }
`;

export const COMPLETE_TASK_MINT = gql`
  mutation completeTaskMint($operationId: String!) {
    completeTaskMint(operationId: $operationId) {
      success
    }
  }
`;
