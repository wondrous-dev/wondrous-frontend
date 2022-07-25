import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { SafeImage as SafeImageComponent } from 'components/Common/Image';
import { GET_PREVIEW_FILE } from 'graphql/queries';

export default {
  title: 'Data Display/Image/SafeImage',
  component: SafeImageComponent,
  parameters: {
    docs: {
      description: {
        component:
          'SafeImage is designed to load image from google cloud store.',
      },
    },
  },
  argTypes: {
    src: {
      type: { name: 'string', required: true },
      description: 'Src indicates the path to the image being displayed.',
    },
    style: {
      description: 'Inline styles',
      control: 'object',
    },
    defaultImage: {
      type: 'string',
      description: 'URL to the default image in case if `src` is not defined or null',
    },
    setImage: {
      action: 'setImage',
      description: 'Action called when preview file is loaded',
    },
    className: {
      type: 'string',
      description: 'Element CSS class name',
    },
  },
} as ComponentMeta<typeof SafeImageComponent>;

const Template: ComponentStory<typeof SafeImageComponent> = (args) => <SafeImageComponent {...args} />;

export const SafeImage = Template.bind({});
SafeImage.args = {
  src: 'image.jpg',
};

SafeImage.parameters = {
  apolloClient: {
    // do not put MockedProvider here, you can, but its preferred to do it in preview.js
    mocks: [
      {
        request: {
          query: GET_PREVIEW_FILE,
          variables: {
            path: SafeImage.args.src,
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
