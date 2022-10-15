import React, { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import DropdownSelect from 'components/Common/DropdownSelect';
import palette from '../../theme/palette';

export default {
  title: 'Surfaces/Dropdown Select',
  component: DropdownSelect,
  parameters: {
    docs: {
      description: {
        component: `The Dropdown Select is a pattern that you can apply to other patterns to implement a search functionality or multiple selection in lists.
`,
      },
    },
  },
  argTypes: {
    title: {
      description: 'DropdownSelect title',
      type: { name: 'string', required: true },
      control: {
        type: 'text',
      },
    },
    className: {
      type: 'string',
      description: 'Element CSS class name',
    },
    labelText: { type: 'string', description: 'Helper text for label.' },
    labelIcon: { type: 'string', description: 'Helper icon for label.' },
    options: {
      control: 'object',
      description: 'Select components are used for collecting user provided information from a list of options.',
    },
    MenuProps: {
      type: 'string',
      description: 'Object Props applied to the Menu element.',
    },
    IconComponent: {
      type: 'string',
      description: 'libraries provide us with hundreds of icons',
    },
    disabled: {
      defaultValue: false,
      description: 'If `true`, the component is disabled.',
      control: {
        type: 'boolean',
      },
    },
    name: {
      type: 'string',
      description: 'specifies a name for an HTML element',
    },
    value: {
      type: 'string',
      description: 'Used to set or get the value for the input field, selected, textarea.',
    },
    setValue: {
      type: 'string',
      description:
        'This function allows you to dynamically set the value of a registered field and have the options to validate and update the form state',
    },
    formSelectStyle: {
      type: 'string',
      description: 'Styles for select form.',
    },
    titleStyle: {
      type: 'string',
      description: 'Styles for title.',
    },
    onChange: {
      action: 'onChange',
      description: 'Detects when the value of an input element changes.',
    },
    innerStyle: {
      type: 'string',
      description: 'Styles for inner.',
    },
    hideLabel: {
      type: 'string',
      description: 'Hide label.',
    },
    labelStyle: {
      type: 'string',
      description: 'Styles for label.',
    },
  },
} as ComponentMeta<typeof DropdownSelect>;

const Template: ComponentStory<typeof DropdownSelect> = () => {
  const views = [
    { label: 'Month View', value: 'month' },
    { label: 'Week View', value: 'week' },
  ];
  const [view, setView] = useState(views[0].value);

  return (
    <DropdownSelect
      options={views}
      innerStyle={{
        background: palette.grey87,
        maxWidth: '150px',
        padding: 0,
        margin: 0,
        fontSize: '15px',
        color: palette.white,
      }}
      value={view}
      setValue={setView}
      formSelectStyle={{
        height: 'auto',
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            maxHeight: '250px',
            width: '100%',
            maxWidth: 150,
            background: 'linear-gradient(180deg, #1E1E1E 0%, #141414 109.19%)',
            padding: '15px',
            '*::-webkit-scrollbar': {
              width: 100,
            },
          },
        },
      }}
    />
  );
};
export const Dropdown = Template.bind({});
