import { gql } from '@apollo/client';
import { CollabsFragment } from 'graphql/fragments/collabs';
import { TaskCardFragment, TaskProposalCardFragment } from 'graphql/fragments/task';

export const GET_ORG_PROJECT_PAGE_TASKS = gql`
  query getOrgProjectPageTasks($input: OrgProjectPageQueryInput) {
    getOrgProjectPageTasks(input: $input) {
      ...TaskCardFragment
    }
  }
  ${TaskCardFragment}
`;

export const GET_ORG_PROJECT_PAGE_MILESTONES = gql`
  query getOrgProjectPageMilestones($input: OrgProjectPageQueryInput) {
    getOrgProjectPageMilestones(input: $input) {
      ...TaskCardFragment
    }
  }
  ${TaskCardFragment}
`;

export const GET_ORG_PROJECT_PAGE_BOUNTIES = gql`
  query getOrgProjectPageBounties($input: OrgProjectPageQueryInput) {
    getOrgProjectPageBounties(input: $input) {
      ...TaskCardFragment
    }
  }
  ${TaskCardFragment}
`;

export const GET_ORG_PROJECT_PAGE_PROPOSALS = gql`
  query getOrgProjectPageProposals($input: OrgProjectPageQueryInput) {
    getOrgProjectPageProposals(input: $input) {
      ...TaskProposalCardFragment
    }
  }
  ${TaskProposalCardFragment}
`;

export const GET_ORG_PROJECT_PAGE_ORG_COLLABS = gql`
  query getOrgProjectPageOrgCollabs($input: OrgProjectPageQueryInput) {
    getOrgProjectPageOrgCollabs(input: $input) {
      ...CollabsFragment
    }
  }
  ${CollabsFragment}
`;
