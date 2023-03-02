import { ENTITIES_DISPLAY_LABEL_MAP, ENTITIES_TYPES, PRIORITIES } from 'utils/constants';
import StarIcon from 'components/Icons/starIcon';
import FlagIcon from 'components/Icons/flag';
import PriorityIcon from 'components/Icons/PriorityIcon';
import Box from '@mui/material/Box';
import React from 'react';
import { GET_ORG_PODS } from 'graphql/queries';
import CreatePodIcon from 'components/Icons/createPod';
import { PublicEyeIcon } from 'components/Icons/userpass';

const gradient = 'linear-gradient(270deg, #7427FF -11.62%, #FFFFFF 103.12%)';

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
          gradient,
          icon: null,
        },
        {
          id: ENTITIES_TYPES.BOUNTY,
          name: ENTITIES_DISPLAY_LABEL_MAP[ENTITIES_TYPES.BOUNTY],
          gradient,
          icon: <StarIcon />,
        },
        {
          id: ENTITIES_TYPES.MILESTONE,
          name: ENTITIES_DISPLAY_LABEL_MAP[ENTITIES_TYPES.MILESTONE],
          gradient,
          icon: <FlagIcon />,
        },
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
  ],
});
