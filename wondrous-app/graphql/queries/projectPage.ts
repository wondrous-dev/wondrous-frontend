import { gql } from '@apollo/client';
import { CollabsFragment } from 'graphql/fragments/collabs';
import { HomePageTaskCardFragment, TaskProposalCardFragment } from 'graphql/fragments/task';

export const GET_ORG_HOME_TASK_OBJECTS = gql`
  query getOrgHomeTaskObjects($input: OrgHomePageQueryInput) {
    getOrgHomeTaskObjects(input: $input) {
      tasks {
        ...HomePageTaskCardFragment
      }
      bounties {
        ...HomePageTaskCardFragment
      }
      milestones {
        ...HomePageTaskCardFragment
      }
    }
  }
  ${HomePageTaskCardFragment}
`;

export const GET_POD_HOME_TASK_OBJECTS = gql`
  query getPodHomeTaskObjects($input: PodHomePageQueryInput) {
    getPodHomeTaskObjects(input: $input) {
      tasks {
        ...HomePageTaskCardFragment
      }
      bounties {
        ...HomePageTaskCardFragment
      }
      milestones {
        ...HomePageTaskCardFragment
      }
    }
  }
  ${HomePageTaskCardFragment}
`;

export const GET_ORG_HOME_PROPOSALS = gql`
  query getOrgHomeProposals($input: OrgHomePageQueryInput) {
    getOrgHomeProposals(input: $input) {
      ...TaskProposalCardFragment
    }
  }
  ${TaskProposalCardFragment}
`;

export const GET_POD_HOME_PROPOSALS = gql`
  query getPodHomeProposals($input: PodHomePageQueryInput) {
    getPodHomeProposals(input: $input) {
      ...TaskProposalCardFragment
    }
  }
  ${TaskProposalCardFragment}
`;

export const GET_ORG_HOME_COLLABS = gql`
  query getOrgHomeCollabs($input: OrgHomePageQueryInput) {
    getOrgHomeCollabs(input: $input) {
      ...CollabsFragment
    }
  }
  ${CollabsFragment}
`;
