import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Button } from 'components/Button';
import { StyledBadge } from 'components/Header/styles';
import NotificationsIcon from 'components/Icons/notifications';
import Tooltip from 'components/Tooltip';
import Box from '@mui/material/Box';

export default {
  title: 'Header/Buttons',
  component: Button,
  argTypes: {
    isOpen: {
      control: {
        type: 'boolean',
      },
    },
    hasUnreadNotifications: {
      control: {
        type: 'boolean',
      },
    },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => (
  <Box sx={{ padding: '20px', background: '#1d1d1d' }}>
    <StyledBadge {...args}>
      <Tooltip title="Notifications">
        <NotificationsIcon />
      </Tooltip>
    </StyledBadge>
  </Box>
);
export const NotificationsButton = Template.bind({});

NotificationsButton.args = {
  hasUnreadNotifications: true,
  isOpen: false,
};
