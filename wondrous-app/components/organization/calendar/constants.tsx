import React from 'react';
import Box from '@mui/material/Box';

import {
  ENTITIES_DISPLAY_LABEL_MAP,
  ENTITIES_TYPES,
  PRIORITIES,
  STATUS_CLOSED,
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_TODO,
} from 'utils/constants';
import StarIcon from 'components/Icons/starIcon';
import FlagIcon from 'components/Icons/flag';
import PriorityIcon from 'components/Icons/PriorityIcon';
import { GET_ORG_LABELS, GET_ORG_PODS } from 'graphql/queries';
import CreatePodIcon from 'components/Icons/createPod';
import { PublicEyeIcon } from 'components/Icons/userpass';
import TagsIcon from 'components/Icons/tagsIcon';
import TaskStatus from 'components/Icons/TaskStatus';
import { StatusDefaultIcon } from 'components/Icons/statusIcons';
import { Rejected } from 'components/Icons';
import ProposalIcon from 'components/Icons/proposalIcon';
import GrantIcon from 'components/Icons/GrantIcon';

const firstGradient = 'linear-gradient(270deg, #7427FF -11.62%, #FFFFFF 103.12%)';
const secondGradient = 'linear-gradient(270deg, #7427FF -11.62%, #F93701 103.12%)';

export const CALENDAR_FILTER_SCHEMA = ({ orgId }) => ({
  filters: [
    {
      multiChoice: true,
      label: 'Task types',
      name: 'taskTypes',
      items: [
        {
          id: ENTITIES_TYPES.TASK,
          name: ENTITIES_DISPLAY_LABEL_MAP[ENTITIES_TYPES.TASK],
          gradient: firstGradient,
          icon: null,
        },
        {
          id: ENTITIES_TYPES.BOUNTY,
          name: ENTITIES_DISPLAY_LABEL_MAP[ENTITIES_TYPES.BOUNTY],
          gradient: firstGradient,
          icon: <StarIcon />,
        },
        {
          id: ENTITIES_TYPES.MILESTONE,
          name: ENTITIES_DISPLAY_LABEL_MAP[ENTITIES_TYPES.MILESTONE],
          gradient: firstGradient,
          icon: <FlagIcon />,
        },
        {
          id: ENTITIES_TYPES.PROPOSAL,
          name: ENTITIES_DISPLAY_LABEL_MAP[ENTITIES_TYPES.PROPOSAL],
          gradient: firstGradient,
          icon: <ProposalIcon />,
        },
        {
          id: ENTITIES_TYPES.GRANT,
          name: ENTITIES_DISPLAY_LABEL_MAP[ENTITIES_TYPES.GRANT],
          gradient: firstGradient,
          icon: <GrantIcon />,
        },
      ],
    },
    {
      name: 'statuses',
      label: 'Status',
      icon: ({ style, ...rest }) => <StatusDefaultIcon style={{ ...style, padding: '3px' }} {...rest} />,
      multiChoice: true,
      items: [
        {
          id: TASK_STATUS_TODO,
          name: 'To-Do / Open',
          icon: <TaskStatus status={TASK_STATUS_TODO} />,
          gradient: secondGradient,
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
          gradient: firstGradient,
          pillIcon: (props) => <TaskStatus status={TASK_STATUS_DONE} {...props} />,
        },
        {
          id: TASK_STATUS_ARCHIVED,
          name: 'Archived',
          icon: <TaskStatus status={TASK_STATUS_ARCHIVED} />,
          gradient: firstGradient,
          pillIcon: (props) => <TaskStatus status={TASK_STATUS_ARCHIVED} {...props} />,
        },
        // TODO: For an Proposals
        // {
        //   id: STATUS_CLOSED,
        //   name: 'Rejected',
        //   label: 'Rejected',
        //   icon: <Rejected />,
        //   gradient: firstGradient,
        //   pillIcon: Rejected,
        // },
      ],
    },
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
    // {
    //   name: 'labelId',
    //   label: 'Tags',
    //   items: [],
    //   icon: ({ style, ...rest }) => <TagsIcon {...rest} style={{ ...style, padding: '5px' }} viewBox="0 0 14 12" />,
    //   query: GET_ORG_LABELS,
    //   variables: { orgId },
    //   mutate: (items) =>
    //     items.map((tag) => ({
    //       ...tag,
    //       gradient: `linear-gradient(270deg, #7427FF -11.62%, ${tag?.color} 103.12%)`,
    //       pillIcon: (props) => <TagsIcon viewBox="0 0 18 12" {...props} />,
    //     })),
    // },
    {
      name: 'priorities',
      label: 'Priority',
      icon: ({ style, ...rest }) => <PriorityIcon {...rest} />,
      multiChoice: true,
      items: PRIORITIES.map((priority) => ({
        id: priority.value,
        color: priority.textColor,
        name: <Box sx={{ color: priority.textColor, fontWeight: 500 }}>{priority.label}</Box>,
        icon: priority.icon,
        pillIcon: () => <PriorityIcon viewBox="0 0 18 13" />,
      })),
    },
    {
      name: 'privacyLevel',
      label: 'Privacy level',
      icon: ({ style, ...rest }) => <PublicEyeIcon {...rest} style={{ ...style, padding: '4px' }} />,
      items: [
        {
          id: 'public',
          name: 'Public',
          gradient: secondGradient,
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
  ],
});
