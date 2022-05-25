import {
  BOUNTY_TYPE,
  MILESTONE_TYPE,
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_REQUESTED,
  TASK_STATUS_TODO,
  TASK_TYPE,
  COLUMNS_CONFIGURATION,
  STATUS_OPEN,
  STATUS_APPROVED,
  STATUS_CHANGE_REQUESTED,
  ENTITIES_TYPES,
} from 'utils/constants';
import { Archived, InReview, Requested } from 'components/Icons/sections';
import { Proposal } from 'components/Icons';
import TaskStatus from 'components/Icons/TaskStatus';
import React from 'react';
import { cloneDeep } from 'lodash';
import { BountyIcon, MilestoneIcon, TaskIcon } from 'components/Icons/Search/types';
import { delQuery } from 'utils';
import { GET_ORG_PODS } from 'graphql/queries/org';
import CreatePodIcon from 'components/Icons/createPod';

const TO_DO = (withSection: boolean = true) => {
  let config = { status: TASK_STATUS_TODO, tasks: [] };
  if (withSection) {
    config = {
      ...config,
      ...{
        section: {
          title: 'Proposals',
          icon: Requested,
          id: '337d2b80-65fd-48ca-bb17-3c0155162a62',
          filter: {
            taskType: TASK_STATUS_REQUESTED,
          },
          expandable: true,
          action: {
            text: 'Proposal',
          },
          tasks: [],
        },
      },
    };
  }
  return config;
};

const IN_PROGRESS = (withSection: boolean = true) => {
  let config = { status: TASK_STATUS_IN_PROGRESS, tasks: [] };
  if (withSection) {
    config = {
      ...config,
      ...{
        section: {
          title: 'In Review',
          icon: InReview,
          id: '337d2b80-65fd-48ca-bb17-3c0155162a62',
          filter: {
            taskType: TASK_STATUS_IN_REVIEW,
          },
          expandable: true,
          action: {
            text: 'Review',
          },
          tasks: [],
        },
      },
    };
  }
  return config;
};

const IN_REVIEW = () => ({
  status: TASK_STATUS_IN_REVIEW,
  tasks: [],
});

const DONE = (withSection: boolean = true) => {
  let config = {
    status: TASK_STATUS_DONE,
    tasks: [],
  };
  if (withSection) {
    config = {
      ...config,
      ...{
        section: {
          title: 'Archived',
          icon: Archived,
          id: '337d2b80-65fd-48ca-bb17-3c0155162a62',
          filter: {
            taskType: TASK_STATUS_ARCHIVED,
          },
          expandable: true,
          action: {
            text: 'Restore',
          },
          tasks: [],
        },
      },
    };
  }
  return config;
};

const PROPOSAL_OPEN = {
  title: 'Open',
  tasks: [],
  status: STATUS_OPEN,
};

const PROPOSAL_APPROVED = {
  title: 'Approved',
  tasks: [],
  status: STATUS_APPROVED,
};

const PROPOSAL_REJECTED = {
  title: 'Rejected',
  tasks: [],
  status: STATUS_CHANGE_REQUESTED,
};

const SHARED_FILTER_STATUSES_DATA = {
  name: 'statuses',
  label: 'Status',
  multiChoice: true,
};

export const ENTITIES_TYPES_FILTER_STATUSES = (orgData) => {
  return {
    [ENTITIES_TYPES.TASK]: {
      filters: [
        {
          ...SHARED_FILTER_STATUSES_DATA,
          items: [
            {
              id: TASK_STATUS_TODO,
              name: 'To-Do',
              icon: <TaskStatus status={TASK_STATUS_TODO} />,
              gradient: 'linear-gradient(270deg, #7427FF -11.62%, #F93701 103.12%)',
            },
            {
              id: TASK_STATUS_IN_PROGRESS,
              name: 'In-progress',
              icon: <TaskStatus status={TASK_STATUS_IN_PROGRESS} />,
              gradient: 'linear-gradient(270deg, #7427FF -11.62%, #FAD000 103.12%)',
            },
            {
              id: TASK_STATUS_IN_REVIEW,
              name: 'In-review',
              icon: <TaskStatus status={TASK_STATUS_IN_REVIEW} />,
              gradient: 'linear-gradient(180deg, #FFFFFF 0%, #00BAFF 100%)',
            },
            {
              id: TASK_STATUS_DONE,
              name: 'Completed',
              icon: <TaskStatus status={TASK_STATUS_DONE} />,
              gradient: 'linear-gradient(270deg, #7427FF -11.62%, #06FFA5 103.12%)',
            },
            {
              id: TASK_STATUS_ARCHIVED,
              name: 'Archived',
              icon: <TaskStatus status={TASK_STATUS_ARCHIVED} />,
              gradient: 'linear-gradient(169.47deg, rgba(75, 75, 75, 0.5) 7.84%, rgba(35, 35, 35, 0.5) 108.71%)',
            },
          ],
        },
        {
          name: 'podIds',
          label: 'Pods',
          items: [],
          query: GET_ORG_PODS,
          variables: { orgId: orgData?.id },
          icon: <CreatePodIcon />,
        },
        {
          name: 'tags',
          label: 'Tags',
          //WIP
          items: [],
        },
        {
          name: 'dates',
          label: 'Dates',
          items: [
            {
              id: TASK_STATUS_TODO,
              name: 'Overdue',
              icon: <TaskStatus status={TASK_STATUS_TODO} />,
              gradient: 'linear-gradient(270deg, #7427FF -11.62%, #F93701 103.12%)',
            },
            {
              id: TASK_STATUS_IN_PROGRESS,
              name: 'Due this week',
              icon: <TaskStatus status={TASK_STATUS_IN_PROGRESS} />,
              gradient: 'linear-gradient(270deg, #7427FF -11.62%, #FAD000 103.12%)',
            },
            {
              id: TASK_STATUS_IN_REVIEW,
              name: 'Due next week',
              icon: <TaskStatus status={TASK_STATUS_IN_REVIEW} />,
              gradient: 'linear-gradient(180deg, #FFFFFF 0%, #00BAFF 100%)',
            },
          ],
        },
        {
          name: 'privacy',
          label: 'Privacy level',
          items: [
            {
              id: 'public',
              name: 'Public',
              gradient: 'linear-gradient(270deg, #7427FF -11.62%, #F93701 103.12%)',
            },
            {
              id: 'private',
              name: 'Private',
              gradient: 'linear-gradient(270deg, #7427FF -11.62%, #FAD000 103.12%)',
            },
          ],
        },
      ],
    },
    [ENTITIES_TYPES.MILESTONE]: {
      ...SHARED_FILTER_STATUSES_DATA,
      items: [
        {
          id: TASK_STATUS_TODO,
          name: 'Open milestones',
          icon: <TaskStatus status={TASK_STATUS_TODO} />,
          gradient: 'linear-gradient(270deg, #7427FF -11.62%, #F93701 103.12%)',
        },
        {
          id: TASK_STATUS_DONE,
          name: 'Completed milestones',
          icon: <TaskStatus status={TASK_STATUS_DONE} />,
          gradient: 'linear-gradient(270deg, #7427FF -11.62%, #F93701 103.12%)',
        },
        {
          id: TASK_STATUS_ARCHIVED,
          name: 'Archived milestones',
          icon: <TaskStatus status={TASK_STATUS_ARCHIVED} />,
          gradient: 'linear-gradient(270deg, #7427FF -11.62%, #F93701 103.12%)',
        },
      ],
    },
    [ENTITIES_TYPES.BOUNTY]: {
      ...SHARED_FILTER_STATUSES_DATA,
      items: [
        {
          id: TASK_STATUS_TODO,
          name: 'Open bounties',
          icon: <TaskStatus status={TASK_STATUS_TODO} />,
          gradient: 'linear-gradient(270deg, #7427FF -11.62%, #F93701 103.12%)',
        },
        {
          id: TASK_STATUS_DONE,
          name: 'Completed bounties',
          icon: <TaskStatus status={TASK_STATUS_DONE} />,
          gradient: 'linear-gradient(270deg, #7427FF -11.62%, #F93701 103.12%)',
        },
        {
          id: TASK_STATUS_ARCHIVED,
          name: 'Archived bounties',
          icon: <TaskStatus status={TASK_STATUS_ARCHIVED} />,
          gradient: 'linear-gradient(270deg, #7427FF -11.62%, #F93701 103.12%)',
        },
      ],
    },
    [ENTITIES_TYPES.PROPOSAL]: {
      ...SHARED_FILTER_STATUSES_DATA,
      items: [
        {
          id: TASK_STATUS_TODO,
          name: 'Open proposals',
          icon: <TaskStatus status={TASK_STATUS_TODO} />,
          gradient: 'linear-gradient(270deg, #7427FF -11.62%, #F93701 103.12%)',
        },
        {
          id: TASK_STATUS_DONE,
          name: 'Resolved proposals',
          icon: <TaskStatus status={TASK_STATUS_DONE} />,
          gradient: 'linear-gradient(270deg, #7427FF -11.62%, #F93701 103.12%)',
        },
      ],
    },
  };
};

export const FILTER_STATUSES = {
  ...SHARED_FILTER_STATUSES_DATA,
  items: [
    // Back-end doesn't support statuses below
    // {
    //   id: TASK_STATUS_REQUESTED,
    //   name: 'Membership requests',
    //   icon: <TaskStatus status={TASK_STATUS_REQUESTED} />,
    //   count: 0,
    // },
    {
      id: TASK_STATUS_REQUESTED,
      name: 'Proposals',
      icon: <Proposal />,
    },
    {
      id: TASK_STATUS_TODO,
      name: 'To-Do',
      icon: <TaskStatus status={TASK_STATUS_TODO} />,
    },
    {
      id: TASK_STATUS_IN_PROGRESS,
      name: 'In-progress',
      icon: <TaskStatus status={TASK_STATUS_IN_PROGRESS} />,
    },
    {
      id: TASK_STATUS_IN_REVIEW,
      name: 'In-review',
      icon: <TaskStatus status={TASK_STATUS_IN_REVIEW} />,
    },
    {
      id: TASK_STATUS_DONE,
      name: 'Completed',
      icon: <TaskStatus status={TASK_STATUS_DONE} />,
    },
    // Back-end doesn't support statuses below
    // {
    //   id: TASK_STATUS_AWAITING_PAYMENT,
    //   name: 'Awaiting payment',
    //   icon: <TaskStatus status={TASK_STATUS_AWAITING_PAYMENT} />,
    // },
    // {
    //   id: TASK_STATUS_PAID,
    //   name: 'Completed and paid',
    //   icon: <TaskStatus status={TASK_STATUS_PAID} />,
    // },
    // {
    //   id: TASK_STATUS_ARCHIVED,
    //   name: 'Archived',
    //   icon: <TaskStatus status={TASK_STATUS_ARCHIVED} />,
    // },
  ],
};

export const FILTER_STATUSES_ADMIN = {
  name: 'statuses',
  label: 'Status',
  items: [
    {
      id: TASK_STATUS_REQUESTED,
      name: 'Proposals',
      icon: <Proposal />,
    },
    {
      id: TASK_STATUS_IN_REVIEW,
      name: 'In-review',
      icon: <TaskStatus status={TASK_STATUS_IN_REVIEW} />,
    },
  ],
};

const generateColumns = (withSection: boolean, type: string) => {
  let todoColumn = TO_DO(withSection);
  let inProgressColumn = IN_PROGRESS(withSection);
  let doneColumn = DONE(withSection);
  let inReviewColumn = IN_REVIEW();
  if (type === COLUMNS_CONFIGURATION.ASSIGNEE) {
    return [todoColumn, inProgressColumn, doneColumn];
  } else return [todoColumn, inProgressColumn, inReviewColumn, doneColumn];
};

export const COLUMNS = generateColumns(true, COLUMNS_CONFIGURATION.ASSIGNEE);

export const ORG_POD_COLUMNS = generateColumns(false, COLUMNS_CONFIGURATION.ORG);

export const ORG_POD_PROPOSAL_COLUMNS = [PROPOSAL_OPEN, PROPOSAL_APPROVED, PROPOSAL_REJECTED];

export const LIMIT = 10;

export const populateTaskColumns = (tasks, columns) => {
  if (!columns) {
    return [];
  }

  const newColumns = columns.map((column) => {
    column.tasks = [];

    return (
      tasks &&
      tasks.reduce((column, task) => {
        if (column.status === task.status) {
          column.tasks = [...column.tasks, task];
        } else if (task?.status === TASK_STATUS_ARCHIVED && column.section?.filter?.taskType === TASK_STATUS_ARCHIVED) {
          column.section.tasks = [...column.section.tasks, task];
        }

        return column;
      }, column)
    );
  });
  return newColumns;
};

export const populateProposalColumns = (proposals, columns) => {
  if (!columns) {
    return [];
  }

  const proposalsMap = {
    [STATUS_OPEN]: [],
    [STATUS_APPROVED]: [],
    // changes requested
    [STATUS_CHANGE_REQUESTED]: [],
  };
  //temporary flag until we add a flag on BE?
  proposals?.forEach((proposal) => {
    if (proposal.approvedAt) proposalsMap[STATUS_APPROVED].push({ ...proposal, isProposal: true });
    if (!proposal.approvedAt && !proposal.changeRequestedAt)
      proposalsMap[STATUS_OPEN].push({ ...proposal, isProposal: true });
    if (proposal.changeRequestedAt && !proposal.approvedAt)
      proposalsMap[STATUS_CHANGE_REQUESTED].push({ ...proposal, isProposal: true });
  });
  return columns.map((column) => {
    return {
      ...column,
      tasks: [...column.tasks, ...proposalsMap[column.status]],
    };
  });
};

export const addToTaskColumns = (newResults, columns) => {
  if (!columns) return [];

  const newColumns = columns.map((column) => {
    return newResults.reduce((column, task) => {
      if (column.status === task.status) {
        column.tasks = [...column.tasks, task];
      }
      return column;
    }, column);
  });
  return newColumns;
};

export const splitColsByType = (columns) => {
  let totalCount = 0;

  const createColumnsByType = (type) => {
    const cols: any = cloneDeep(columns);

    cols.tasksCount = 0;

    cols.forEach((col) => {
      col.tasks = col.tasks.filter((task) => {
        if ((task.type || TASK_TYPE) === type) {
          totalCount++;
          cols.tasksCount++;
          return true;
        }

        return false;
      });
      if (col.section) {
        col.section.tasks = col.section.tasks.filter((task) => {
          if ((task.type || TASK_TYPE) === type) {
            totalCount++;
            cols.tasksCount++;
            return true;
          }

          return false;
        });
      }
    });

    return cols;
  };

  const splitCols = {
    [TASK_TYPE]: {
      name: 'task',
      showAll: false,
      columns: createColumnsByType(TASK_TYPE),
      icon: <TaskIcon />,
    },
    [BOUNTY_TYPE]: {
      name: 'bounties',
      showAll: false,
      columns: createColumnsByType(BOUNTY_TYPE),
      icon: <BountyIcon />,
    },
    [MILESTONE_TYPE]: {
      name: 'milestone',
      showAll: false,
      columns: createColumnsByType(MILESTONE_TYPE),
      icon: <MilestoneIcon />,
    },
  };

  return { splitCols, totalCount };
};
