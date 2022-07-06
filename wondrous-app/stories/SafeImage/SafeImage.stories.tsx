import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ApolloProvider } from '@apollo/client';

import { SafeImage as SafeImageComponent } from 'components/Common/Image';
import apollo from 'services/apollo';

export default {
  title: 'Data Display/Image/SafeImage',
  component: SafeImageComponent,
  parameters: {
    docs: {
      description: {
        component:
          'SafeImage is designed to load image from google cloud store.** Does not work currently in the Storybook due to the CORS **',
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

const Template: ComponentStory<typeof SafeImageComponent> = (args) => (
  <ApolloProvider client={apollo}>
    <SafeImageComponent {...args} />
  </ApolloProvider>
);

export const SafeImage = Template.bind({});
SafeImage.args = {
  src: 'thumbnail/2YV3vwIQub4DPA.jpg',
};
