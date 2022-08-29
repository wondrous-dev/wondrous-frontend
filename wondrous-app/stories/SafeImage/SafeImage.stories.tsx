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
        component: 'SafeImage is designed to load image from google cloud store.',
      },
    },
  },
} as ComponentMeta<typeof SafeImageComponent>;

const Template: ComponentStory<typeof SafeImageComponent> = (args) => <SafeImageComponent {...args} />;

export const SafeImage = Template.bind({});
SafeImage.args = {
  src: 'image.jpg',
  useNextImage: false,
  width: 29,
  height: 29,
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
