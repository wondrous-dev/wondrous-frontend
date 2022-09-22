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
  ENTITIES_TYPES,
  TASK_DATE_OVERDUE,
  TASK_DATE_DUE_THIS_WEEK,
  TASK_DATE_DUE_NEXT_WEEK,
  STATUS_CLOSED,
  PERMISSIONS,
  SORT_BY,
  STATUS_WAITING_FOR_REVIEW,
  STATUS_REJECTED,
  STATUS_CHANGE_REQUESTED,
  PRIORITIES,
} from 'utils/constants';
import { Archived, InReview, Requested } from 'components/Icons/sections';
import { StatusDefaultIcon, InReviewIcon } from 'components/Icons/statusIcons';
import { Proposal, Approved, Rejected } from 'components/Icons';
import TaskStatus from 'components/Icons/TaskStatus';
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { BountyIcon, MilestoneIcon, TaskIcon } from 'components/Icons/Search/types';
import { delQuery } from 'utils';
import { GET_ORG_PODS } from 'graphql/queries/org';
import CreatePodIcon from 'components/Icons/createPod';
import { GET_ORG_LABELS, GET_USER_PODS } from 'graphql/queries';
import TagsIcon from 'components/Icons/tagsIcon';
import CalendarIcon from 'components/Icons/calendar';
import { PublicEyeIcon } from 'components/Icons/userpass';
import FlagIcon from 'components/Icons/flag';
import StarIcon from 'components/Icons/starIcon';
import { DAOIcon } from 'components/Icons/dao';
import { OrgProfilePicture } from 'components/Common/ProfilePictureHelpers';
import palette from 'theme/palette';
import { parseUserPermissionContext } from 'utils/helpers';
import { SubmissionItemStatusChangesRequestedIcon } from 'components/Common/TaskSubmission/styles';
import PriorityIcon from 'components/Icons/PriorityIcon';
import { Box } from '@mui/material';
import UrgentIcon from 'components/Icons/UrgentIcon';
import HighIcon from 'components/Icons/HighIcon';
import MediumIcon from 'components/Icons/MediumIcon';
import LowIcon from 'components/Icons/LowIcon';
import { HighPriorityStyle, LowPriorityStyle, MediumPriorityStyle, UrgentPriorityStyle } from 'services/styles';

const generateTodoColumn = (withSection: boolean = true) => {
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

const generateInProgressColumn = (withSection: boolean = true) => {
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

const generateInReviewColumn = () => ({
  status: TASK_STATUS_IN_REVIEW,
  tasks: [],
});

const generateDoneColumn = (withSection: boolean = true) => {
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
  status: STATUS_CLOSED,
};

const SHARED_FILTER_STATUSES_DATA = {
  name: 'statuses',
  label: 'Status',
  icon: ({ style, ...rest }) => <StatusDefaultIcon style={{ ...style, padding: '3px' }} {...rest} />,
  multiChoice: true,
};

const addPodFilter = (orgId) => [
  {
    name: 'podIds',
    label: 'Pods',
    items: [],
    query: GET_ORG_PODS,
    variables: { orgId },
    icon: CreatePodIcon,
    multiChoice: true,
    mutate: (items) =>
      items.map((pod) => ({
        ...pod,
        gradient: `linear-gradient(270deg, #7427FF -11.62%, ${pod?.color || 'white'} 103.12%)`,
        icon: (
          <CreatePodIcon
            style={{
              width: '26px',
              height: '26px',
              marginRight: '8px',
              background: pod?.color,
              borderRadius: '100%',
            }}
          />
        ),
        pillIcon: CreatePodIcon,
      })),
  },
];

const BOUNTY_STATUS_FILTERS = {
  ...SHARED_FILTER_STATUSES_DATA,
  items: [
    {
      id: TASK_STATUS_TODO,
      name: 'Open bounties',
      label: 'Open',
      icon: (
        <StarIcon
          style={{
            width: '25px',
            height: '25px',
            border: '1px solid #7A7A7A',
            borderRadius: '100%',
            padding: '5px',
          }}
        />
      ),
      gradient: 'linear-gradient(270deg, #7427FF -11.62%, #F93701 103.12%)',
      pillIcon: StarIcon,
    },
    {
      id: TASK_STATUS_DONE,
      name: 'Completed bounties',
      label: 'Completed',
      icon: (
        <StarIcon
          stroke="url(#completed)"
          style={{
            width: '25px',
            height: '25px',
            border: '1px solid #7A7A7A',
            borderRadius: '100%',
            padding: '5px',
          }}
        />
      ),
      gradient: 'linear-gradient(270deg, #7427FF -11.62%, #06FFA5 103.12%)',
      pillIcon: (props) => <StarIcon stroke="url(#completed)" {...props} />,
    },
    {
      id: TASK_STATUS_ARCHIVED,
      name: 'Archived bounties',
      label: 'Archived',
      icon: (
        <StarIcon
          stroke="#7A7A7A"
          style={{
            width: '25px',
            height: '25px',
            border: '1px solid #7A7A7A',
            borderRadius: '100%',
            padding: '5px',
          }}
        />
      ),
      gradient: 'linear-gradient(270deg, #7427FF -11.62%, #FFFFFF 103.12%)',
      pillIcon: (props) => <StarIcon stroke="#7A7A7A" {...props} />,
    },
  ],
};

const TASK_TYPE_STATUS_FILTERS = {
  ...SHARED_FILTER_STATUSES_DATA,
  items: [
    {
      id: TASK_STATUS_TODO,
      name: 'To-Do',
      icon: <TaskStatus status={TASK_STATUS_TODO} />,
      gradient: 'linear-gradient(270deg, #7427FF -11.62%, #F93701 103.12%)',
      pillIcon: (props) => <TaskStatus status={TASK_STATUS_TODO} {...props} />,
    },
    {
      id: TASK_STATUS_IN_PROGRESS,
      name: 'In-progress',
      icon: <TaskStatus status={TASK_STATUS_IN_PROGRESS} />,
      gradient: 'linear-gradient(270deg, #7427FF -11.62%, #FFD653 103.12%)',
      pillIcon: (props) => <TaskStatus status={TASK_STATUS_IN_PROGRESS} {...props} />,
    },
    {
      id: TASK_STATUS_IN_REVIEW,
      name: 'In-review',
      icon: <TaskStatus status={TASK_STATUS_IN_REVIEW} />,
      gradient: 'linear-gradient(270deg, #7427FF -11.62%, #00BAFF 103.12%)',
      pillIcon: (props) => <TaskStatus status={TASK_STATUS_IN_REVIEW} {...props} />,
    },
    {
      id: TASK_STATUS_DONE,
      name: 'Completed',
      icon: <TaskStatus status={TASK_STATUS_DONE} />,
      gradient: 'linear-gradient(270deg, #7427FF -11.62%, #06FFA5 103.12%)',
      pillIcon: (props) => <TaskStatus status={TASK_STATUS_DONE} {...props} />,
    },
    {
      id: TASK_STATUS_ARCHIVED,
      name: 'Archived',
      icon: <TaskStatus status={TASK_STATUS_ARCHIVED} />,
      gradient: 'linear-gradient(270deg, #7427FF -11.62%, #FFFFFF 103.12%)',
      pillIcon: (props) => <TaskStatus status={TASK_STATUS_ARCHIVED} {...props} />,
    },
  ],
};

const MILESTONE_TYPE_STATUS_FILTERS = {
  ...SHARED_FILTER_STATUSES_DATA,
  items: [
    {
      id: TASK_STATUS_TODO,
      name: 'Open milestones',
      label: 'Open',
      icon: (
        <FlagIcon
          stroke="url(#open0)"
          secondStroke="url(#open1)"
          style={{
            width: '25px',
            height: '25px',
            border: '1px solid #7A7A7A',
            borderRadius: '100%',
            padding: '5px',
          }}
        />
      ),
      gradient: 'linear-gradient(270deg, #7427FF -11.62%, #F93701 103.12%)',
      pillIcon: ({ style, ...rest }) => (
        <FlagIcon stroke="url(#open0)" secondStroke="url(#open1)" style={{ ...style, padding: '3px' }} {...rest} />
      ),
    },
    {
      id: TASK_STATUS_DONE,
      name: 'Completed milestones',
      label: 'Completed',
      icon: (
        <FlagIcon
          stroke="url(#completed0)"
          secondStroke="url(#completed1)"
          style={{
            width: '25px',
            height: '25px',
            border: '1px solid #7A7A7A',
            borderRadius: '100%',
            padding: '5px',
          }}
        />
      ),
      gradient: 'linear-gradient(270deg, #7427FF -11.62%, #06FFA5 103.12%)',
      pillIcon: ({ style, ...rest }) => (
        <FlagIcon
          stroke="url(#completed0)"
          secondStroke="url(#completed1)"
          style={{ ...style, padding: '3px' }}
          {...rest}
        />
      ),
    },
    {
      id: TASK_STATUS_ARCHIVED,
      name: 'Archived milestones',
      label: 'Archived',
      icon: (
        <FlagIcon
          stroke="#7A7A7A"
          style={{
            width: '25px',
            height: '25px',
            border: '1px solid #7A7A7A',
            borderRadius: '100%',
            padding: '5px',
          }}
        />
      ),
      gradient: 'linear-gradient(270deg, #7427FF -11.62%, #FFFFFF 103.12%)',
      pillIcon: ({ style, ...rest }) => <FlagIcon stroke="#7A7A7A" style={{ ...style, padding: '3px' }} {...rest} />,
    },
  ],
};

const PROPOSAL_TYPE_STATUS_FILTERS = {
  name: 'statuses',
  label: 'Status',
  icon: ({ style, ...rest }) => <StatusDefaultIcon style={{ ...style, padding: '3px' }} {...rest} />,
  multiChoice: true,
  items: [
    {
      id: STATUS_OPEN,
      name: 'Open proposals',
      label: 'Open',
      icon: <Proposal />,
      gradient: 'linear-gradient(270deg, #7427FF -11.62%, #F93701 103.12%)',
      pillIcon: Proposal,
    },
    {
      id: STATUS_APPROVED,
      name: 'Approved proposals',
      label: 'Approved',
      icon: <Approved />,
      gradient: 'linear-gradient(270deg, #7427FF -11.62%, #06FFA5 103.12%)',
      pillIcon: Approved,
    },
    {
      id: STATUS_CLOSED,
      name: 'Rejected proposals',
      label: 'Rejected',
      icon: <Rejected />,
      gradient: 'linear-gradient(270deg, #7427FF -11.62%, #FFFFFF 103.12%)',
      pillIcon: Rejected,
    },
  ],
};

const SUBMISSION_TYPE_STATUS_FILTERS = {
  ...SHARED_FILTER_STATUSES_DATA,
  label: 'Submission status',
  items: [
    {
      id: STATUS_WAITING_FOR_REVIEW,
      name: 'Waiting for review',
      label: 'Waiting for review',
      icon: <InReviewIcon />,
      gradient: ' -webkit-linear-gradient(#ffffff, #00baff)',
    },
    {
      id: STATUS_CHANGE_REQUESTED,
      name: 'Changes requested',
      label: 'Changes requested',
      icon: <SubmissionItemStatusChangesRequestedIcon />,
      gradient: '-webkit-linear-gradient(#ffffff, #ffd653)',
    },
    {
      id: STATUS_APPROVED,
      name: 'Approved',
      label: 'Approved',
      icon: <Approved />,
      gradient: 'linear-gradient(270deg, #7427FF -11.62%, #06FFA5 103.12%)',
    },
    {
      id: STATUS_REJECTED,
      name: 'Rejected',
      label: 'Rejected',
      icon: <Rejected />,
      gradient: 'linear-gradient(270deg, #7427FF -11.62%, #FFFFFF 103.12%)',
    },
  ],
};
export const ENTITY_TO_STATUS_MAP = {
  [ENTITIES_TYPES.TASK]: TASK_TYPE_STATUS_FILTERS,
  [ENTITIES_TYPES.BOUNTY]: BOUNTY_STATUS_FILTERS,
  [ENTITIES_TYPES.MILESTONE]: MILESTONE_TYPE_STATUS_FILTERS,
  [ENTITIES_TYPES.PROPOSAL]: PROPOSAL_TYPE_STATUS_FILTERS,
  [ENTITIES_TYPES.SUBMISSION]: SUBMISSION_TYPE_STATUS_FILTERS,
};

export const DEFAULT_ENTITY_STATUS_FILTER = {
  [ENTITIES_TYPES.TASK]: [],
  [ENTITIES_TYPES.BOUNTY]: [TASK_STATUS_TODO],
  [ENTITIES_TYPES.MILESTONE]: [TASK_STATUS_TODO],
  [ENTITIES_TYPES.PROPOSAL]: [],
};

export const PRIORITY_FILTERS = {
  name: 'priority',
  label: 'Priority',
  icon: ({ style, ...rest }) => <PriorityIcon {...rest} />,
  multiChoice: true,
  items: PRIORITIES.map((priority) => ({
    id: priority.value,
    // TODO: DO I need color here?
    color: priority.textColor,
    name: <Box sx={{ color: priority.textColor, fontWeight: 500 }}>{priority.label}</Box>,
    icon: priority.icon,
    pillIcon: () => <PriorityIcon viewBox="0 0 18 13" />,
  })),
};

export const ENTITIES_TYPES_FILTER_STATUSES = ({ orgId, enablePodFilter = false }) => {
  const SHARED_FILTERS = [
    ...(enablePodFilter ? addPodFilter(orgId) : []),
    {
      name: 'labelId',
      label: 'Tags',
      items: [],
      icon: ({ style, ...rest }) => <TagsIcon {...rest} style={{ ...style, padding: '5px' }} viewBox="0 0 14 12" />,
      query: GET_ORG_LABELS,
      variables: { orgId },
      mutate: (items) =>
        items.map((tag) => ({
          ...tag,
          gradient: `linear-gradient(270deg, #7427FF -11.62%, ${tag?.color} 103.12%)`,
          pillIcon: (props) => <TagsIcon viewBox="0 0 18 12" {...props} />,
        })),
    },
    PRIORITY_FILTERS,
    {
      name: 'date',
      label: 'Dates',
      icon: ({ style, ...rest }) => <CalendarIcon {...rest} style={{ ...style, padding: '5px' }} />,
      items: [
        {
          id: TASK_DATE_OVERDUE,
          name: 'Overdue',
          icon: <CalendarIcon style={{ padding: '3px' }} stroke="#F93701" />,
          pillIcon: (props) => <CalendarIcon viewBox="0 0 18 14" {...props} />,
          gradient: 'linear-gradient(270deg, #7427FF -11.62%, #F93701 103.12%)',
        },
        {
          id: TASK_DATE_DUE_THIS_WEEK,
          name: 'Due this week',
          icon: <CalendarIcon style={{ padding: '3px' }} stroke="#FFD653" />,
          gradient: 'linear-gradient(270deg, #7427FF -11.62%, #FAD000 103.12%)',
          pillIcon: (props) => <CalendarIcon viewBox="0 0 18 14" {...props} />,
        },
        {
          id: TASK_DATE_DUE_NEXT_WEEK,
          name: 'Due next week',
          icon: <CalendarIcon style={{ padding: '3px' }} stroke="#00BAFF" />,
          gradient: 'linear-gradient(270deg, #7427FF -11.62%, #00BAFF 103.12%)',
          pillIcon: (props) => <CalendarIcon viewBox="0 0 18 14" {...props} />,
        },
      ],
    },
    {
      name: 'privacyLevel',
      label: 'Privacy level',
      icon: ({ style, ...rest }) => <PublicEyeIcon {...rest} style={{ ...style, padding: '4px' }} />,
      items: [
        {
          id: 'public',
          name: 'Public',
          gradient: 'linear-gradient(270deg, #7427FF -11.62%, #F93701 103.12%)',
          pillIcon: (props) => <PublicEyeIcon viewBox="0 0 18 13" {...props} />,
        },
        {
          id: 'private',
          name: 'All',
          gradient: 'linear-gradient(270deg, #7427FF -11.62%, #FAD000 103.12%)',
          pillIcon: (props) => <PublicEyeIcon viewBox="0 0 18 13" {...props} />,
        },
      ],
    },
  ];

  return {
    [ENTITIES_TYPES.TASK]: {
      filters: [TASK_TYPE_STATUS_FILTERS, ...SHARED_FILTERS],
    },
    [ENTITIES_TYPES.MILESTONE]: {
      filters: [MILESTONE_TYPE_STATUS_FILTERS, ...SHARED_FILTERS],
    },
    [ENTITIES_TYPES.BOUNTY]: {
      filters: [BOUNTY_STATUS_FILTERS, ...SHARED_FILTERS],
    },
    [ENTITIES_TYPES.PROPOSAL]: {
      filters: [
        PROPOSAL_TYPE_STATUS_FILTERS,
        ...(enablePodFilter ? addPodFilter(orgId) : []),
        {
          name: 'labelId',
          label: 'Tags',
          items: [],
          icon: ({ style, ...rest }) => <TagsIcon {...rest} style={{ ...style, padding: '5px' }} viewBox="0 0 14 12" />,
          query: GET_ORG_LABELS,
          variables: { orgId },
          disabled: true,
          mutate: (items) =>
            items.map((tag) => ({
              ...tag,
              gradient: `linear-gradient(270deg, #7427FF -11.62%, ${tag?.color} 103.12%)`,
              pillIcon: TagsIcon,
            })),
        },
        PRIORITY_FILTERS,
        {
          name: 'date',
          label: 'Dates',
          disabled: true,
          icon: ({ style, ...rest }) => <CalendarIcon {...rest} style={{ ...style, padding: '5px' }} />,
          items: [
            {
              id: TASK_DATE_OVERDUE,
              name: 'Overdue',
              icon: () => <CalendarIcon style={{ padding: '3px' }} stroke="#F93701" />,
              pillIcon: (props) => <CalendarIcon viewBox="0 0 18 14" {...props} />,
              gradient: 'linear-gradient(270deg, #7427FF -11.62%, #F93701 103.12%)',
            },
            {
              id: TASK_DATE_DUE_THIS_WEEK,
              name: 'Due this week',
              icon: () => <CalendarIcon style={{ padding: '3px' }} stroke="#FFD653" />,
              gradient: 'linear-gradient(270deg, #7427FF -11.62%, #FAD000 103.12%)',
              pillIcon: (props) => <CalendarIcon viewBox="0 0 18 14" {...props} />,
            },
            {
              id: TASK_DATE_DUE_NEXT_WEEK,
              name: 'Due next week',
              icon: () => <CalendarIcon style={{ padding: '3px' }} stroke="#00BAFF" />,
              gradient: 'linear-gradient(270deg, #7427FF -11.62%, #00BAFF 103.12%)',
              pillIcon: (props) => <CalendarIcon viewBox="0 0 18 14" {...props} />,
            },
          ],
        },
      ],
    },
  };
};

export const FILTER_STATUSES = {
  ...SHARED_FILTER_STATUSES_DATA,
  items: [
    {
      id: TASK_STATUS_REQUESTED,
      name: 'Proposals',
      icon: <Proposal />,
      gradient: 'linear-gradient(270deg, #7427FF -11.62%, #FFFFFF 103.12%)',
    },
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
      gradient: 'linear-gradient(270deg, #7427FF -11.62%, #FFD653 103.12%)',
    },
    {
      id: TASK_STATUS_IN_REVIEW,
      name: 'In-review',
      icon: <TaskStatus status={TASK_STATUS_IN_REVIEW} />,
      gradient: 'linear-gradient(270deg, #7427FF -11.62%, #00BAFF 103.12%)',
    },
    {
      id: TASK_STATUS_DONE,
      name: 'Completed',
      icon: <TaskStatus status={TASK_STATUS_DONE} />,
      gradient: 'linear-gradient(270deg, #7427FF -11.62%, #06FFA5 103.12%)',
    },
  ],
};

export const generateUserDashboardFilters = ({ userId, orgs = [], type = ENTITIES_TYPES.TASK }) => [
  ENTITY_TO_STATUS_MAP[type],
  {
    name: 'orgId',
    label: 'Orgs',
    items: orgs.map((org) => ({
      ...org,
      icon: <OrgProfilePicture profilePicture={org?.profilePicture} />,
      pillIcon: (props) => <OrgProfilePicture profilePicture={org?.profilePicture} />,
    })),
    icon: ({ style, ...rest }) => (
      <DAOIcon
        encircled={false}
        stroke={palette.blue20}
        style={{ ...style, width: '28px', height: '28px' }}
        {...rest}
      />
    ),
    multiChoice: false,
  },
  {
    name: 'podIds',
    label: 'Pods',
    items: orgs,
    query: GET_USER_PODS,
    variables: { userId },
    icon: CreatePodIcon,
    multiChoice: true,
    mutate: (items) =>
      items.map((pod) => ({
        ...pod,
        gradient: `linear-gradient(270deg, #7427FF -11.62%, ${pod?.color || 'white'} 103.12%)`,
        icon: (
          <CreatePodIcon
            style={{
              width: '26px',
              height: '26px',
              marginRight: '8px',
              background: pod?.color,
              borderRadius: '100%',
            }}
          />
        ),
        pillIcon: CreatePodIcon,
      })),
  },
  PRIORITY_FILTERS,
  {
    name: 'date',
    label: 'Dates',
    icon: ({ style, ...rest }) => <CalendarIcon {...rest} style={{ ...style, padding: '5px' }} />,
    items: [
      {
        id: TASK_DATE_OVERDUE,
        name: 'Overdue',
        icon: <CalendarIcon style={{ padding: '3px' }} stroke="#F93701" />,
        pillIcon: (props) => <CalendarIcon viewBox="0 0 18 14" {...props} />,
        gradient: 'linear-gradient(270deg, #7427FF -11.62%, #F93701 103.12%)',
      },
      {
        id: TASK_DATE_DUE_THIS_WEEK,
        name: 'Due this week',
        icon: <CalendarIcon style={{ padding: '3px' }} stroke="#FFD653" />,
        gradient: 'linear-gradient(270deg, #7427FF -11.62%, #FAD000 103.12%)',
        pillIcon: (props) => <CalendarIcon viewBox="0 0 18 14" {...props} />,
      },
      {
        id: TASK_DATE_DUE_NEXT_WEEK,
        name: 'Due next week',
        icon: <CalendarIcon style={{ padding: '3px' }} stroke="#00BAFF" />,
        gradient: 'linear-gradient(270deg, #7427FF -11.62%, #00BAFF 103.12%)',
        pillIcon: (props) => <CalendarIcon viewBox="0 0 18 14" {...props} />,
      },
    ],
  },
  {
    name: 'privacyLevel',
    label: 'Privacy level',
    icon: ({ style, ...rest }) => <PublicEyeIcon {...rest} style={{ ...style, padding: '4px' }} />,
    items: [
      {
        id: 'public',
        name: 'Public',
        gradient: 'linear-gradient(270deg, #7427FF -11.62%, #F93701 103.12%)',
        pillIcon: (props) => <PublicEyeIcon viewBox="0 0 18 13" {...props} />,
      },
      {
        id: 'private',
        name: 'All',
        gradient: 'linear-gradient(270deg, #7427FF -11.62%, #FAD000 103.12%)',
        pillIcon: (props) => <PublicEyeIcon viewBox="0 0 18 13" {...props} />,
      },
    ],
  },
];

export const generateAdminDashboardFilters = ({ userId, orgs = [], permissionContext = null }) => [
  {
    name: 'orgId',
    label: 'Orgs',
    items: orgs.map((org) => ({
      ...org,
      icon: <OrgProfilePicture profilePicture={org?.profilePicture} />,
      pillIcon: (props) => <OrgProfilePicture profilePicture={org?.profilePicture} />,
    })),
    icon: ({ style, ...rest }) => (
      <DAOIcon
        encircled={false}
        stroke={palette.blue20}
        style={{ ...style, width: '28px', height: '28px' }}
        {...rest}
      />
    ),
    multiChoice: false,
  },
  {
    name: 'podIds',
    label: 'Pods',
    items: orgs,
    query: GET_USER_PODS,
    variables: { userId },
    icon: CreatePodIcon,
    multiChoice: true,
    mutate: (items) =>
      items.reduce((filtered, pod) => {
        const permissions = parseUserPermissionContext({ userPermissionsContext: permissionContext, podId: pod?.id });
        if (
          permissions.includes(PERMISSIONS.FULL_ACCESS) ||
          permissions.includes(PERMISSIONS.CREATE_TASK) ||
          permissions.includes(PERMISSIONS.MANAGE_MEMBER)
        ) {
          filtered.push({
            ...pod,
            gradient: `linear-gradient(270deg, #7427FF -11.62%, ${pod?.color || 'white'} 103.12%)`,
            icon: (
              <CreatePodIcon
                style={{
                  width: '26px',
                  height: '26px',
                  marginRight: '8px',
                  background: pod?.color,
                  borderRadius: '100%',
                }}
              />
            ),
            pillIcon: CreatePodIcon,
          });
        }
        return filtered;
      }, []),
  },
  {
    name: 'sortOrder',
    label: 'Sort by',
    icon: ({ style, ...rest }) => <CalendarIcon {...rest} style={{ ...style, padding: '5px' }} />,
    items: [
      {
        id: SORT_BY.DESC,
        name: 'Latest first',
        icon: <CalendarIcon style={{ padding: '3px' }} stroke="#FFD653" />,
        gradient: 'linear-gradient(270deg, #7427FF -11.62%, #FAD000 103.12%)',
        pillIcon: (props) => <CalendarIcon viewBox="0 0 18 14" {...props} />,
      },
      {
        id: SORT_BY.ASC,
        name: 'Oldest first',
        icon: <CalendarIcon style={{ padding: '3px' }} stroke="#00BAFF" />,
        gradient: 'linear-gradient(270deg, #7427FF -11.62%, #00BAFF 103.12%)',
        pillIcon: (props) => <CalendarIcon viewBox="0 0 18 14" {...props} />,
      },
    ],
  },
];
export const FILTER_STATUSES_ADMIN = {
  name: 'statuses',
  label: 'Status',
  items: [
    {
      id: [TASK_STATUS_REQUESTED],
      name: 'Proposals',
      icon: <Proposal />,
    },
    {
      id: [TASK_STATUS_IN_REVIEW],
      name: 'In-review',
      icon: <TaskStatus status={TASK_STATUS_IN_REVIEW} />,
    },
  ],
};

const generateColumns = (withSection: boolean, type: string) => {
  const todoColumn = generateTodoColumn(withSection);
  const inProgressColumn = generateInProgressColumn(withSection);
  const doneColumn = generateDoneColumn(withSection);
  const inReviewColumn = generateInReviewColumn();
  if (type === COLUMNS_CONFIGURATION.ASSIGNEE) {
    return [todoColumn, inProgressColumn, doneColumn];
  }
  return [todoColumn, inProgressColumn, inReviewColumn, doneColumn];
};

export const COLUMNS = generateColumns(true, COLUMNS_CONFIGURATION.ASSIGNEE);

export const USER_COLUMNS = [
  generateTodoColumn(false),
  generateInProgressColumn(false),
  generateInReviewColumn(),
  generateDoneColumn(false),
];

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
    [STATUS_CLOSED]: [],
  };
  // temporary flag until we add a flag on BE?
  proposals?.forEach((proposal) => {
    if (proposal.approvedAt) proposalsMap[STATUS_APPROVED].push({ ...proposal, isProposal: true });
    if (!proposal.approvedAt && !proposal.closedAt) proposalsMap[STATUS_OPEN].push({ ...proposal, isProposal: true });
    if (proposal.closedAt && !proposal.approvedAt) proposalsMap[STATUS_CLOSED].push({ ...proposal, isProposal: true });
  });
  return columns.map((column) => ({
    ...column,
    tasks: [...column.tasks, ...proposalsMap[column.status]],
  }));
};

export const addToTaskColumns = (newResults, columns) => {
  if (!columns) return [];

  const newColumns = columns.map((column) =>
    newResults.reduce((column, task) => {
      if (column.status === task.status) {
        column.tasks = [...column.tasks, task];
      }
      return column;
    }, column)
  );
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
