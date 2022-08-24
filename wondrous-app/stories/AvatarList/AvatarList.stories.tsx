import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { AvatarList as AvatarListComp } from 'components/Common/AvatarList';
import { GET_PREVIEW_FILE } from 'graphql/queries';

const userList = [
  {
    avatar: {
      url: 'user1.jpg',
    },
    id: 'user1',
    initials: 'User One',
  },
  {
    avatar: {
      url: 'user2.jpg',
    },
    id: 'user2',
    initials: 'User Two',
  },
];

export default {
  title: 'Data Display/AvatarList',
  component: AvatarListComp,
  argTypes: {
    users: {
      control: 'object',
      description: 'User list',
    },
    id: {
      type: 'string',
      description: 'Is an identifier in the list of arguments that are included in the formulas.',
    },
    align: {
      control: 'string',
      description: 'value for the justify-content',
    },
  },
} as ComponentMeta<typeof AvatarListComp>;

const Template: ComponentStory<typeof AvatarListComp> = (props) => <AvatarListComp {...props} />;
export const AvatarList = Template.bind({});

AvatarList.args = {
  users: userList,
  align: 'center',
};

AvatarList.parameters = {
  apolloClient: {
    mocks: [
      {
        request: {
          query: GET_PREVIEW_FILE,
          variables: {
            path: userList[0].avatar.url,
          },
        },
        result: {
          data: {
            getPreviewFile: {
              url: 'http://localhost:6006/images/boards/avatar.png',
            },
          },
        },
      },
      {
        request: {
          query: GET_PREVIEW_FILE,
          variables: {
            path: userList[1].avatar.url,
          },
        },
        result: {
          data: {
            getPreviewFile: {
              url: 'http://localhost:6006/images/boards/avatar.png',
            },
          },
        },
      },
    ],
  },
};
