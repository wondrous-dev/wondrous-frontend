import React, { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import styled from 'styled-components';

import DropdownSelectComponent from 'components/Common/DropdownSelect/dropdownSelect';
import EthereumIcon from 'components/Icons/ethereum';
import ArrowDropDownIcon from 'components/Icons/arrowDropDown';
import { filterRoles } from 'components/Settings/Members/helpers';

const chainOptions = [
  {
    label: 'Ethereum',
    value: 'ethereum',
  },
  {
    label: 'Polygon',
    value: 'polygon',
  },
  {
    label: 'Optimism',
    value: 'optimism',
  },
  {
    label: 'Harmony',
    value: 'harmony',
  },
  {
    label: 'Boba',
    value: 'boba',
  },
  {
    label: 'Arbitrum One',
    value: 'arbitrum',
  },
  {
    label: 'BSC',
    value: 'bsc',
  },
];

export default {
  title: 'Surfaces/DropdownSelect',
  component: DropdownSelectComponent,
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
} as ComponentMeta<typeof DropdownSelectComponent>;

const Template: ComponentStory<typeof DropdownSelectComponent> = (props) => {
  const [value, setValue] = useState(null);

  // return (
  //   <DropdownSelect
  //     {...props}
  //     title="DAO"
  //     value={value}
  //     setValue={() => null}
  //     labelText="Choose DAO"
  //     labelIcon={<CreateDaoIcon />}
  //     options={[]}
  //     name="dao"
  //   />
  // );

  const MenuProps = {
    disableScrollLock: true,
    PaperProps: {
      style: {
        borderRadius: '6px',
        border: '1px solid #6A6A6A',
        maxHeight: '250px',
        background: 'linear-gradient(180deg, #1E1E1E 0%, #141414 109.19%)',
        padding: '0 7px',
      },
    },
  };

  const RolesDropdown = styled(DropdownSelectComponent)`
  .MuiInputBase-formControl {
    background: #1e1e1e;
  }
`;

  return (
    <div className="father">
      <RolesDropdown
        {...props}
        value={value}
        setValue={setValue}
        title="Role"
        titleStyle={{
          marginBottom: '-8px',
        }}
        MenuProps={MenuProps}
        IconComponent={() => <ArrowDropDownIcon style={{ height: '7px', right: '15px' }} fill="#CCBBFF" />}
        // value={inviteeRole}
        // setValue={setInviteeRole}
        labelText="Choose Role"
        // options={filterRoles(roleList, null, userIsOwner)}
        style={{
          background: 'red',
        }}
        formSelectStyle={{
          width: 'auto',
          flex: 1,
          maxWidth: 'none',
        }}
      />
    </div>
  );
};
export const DropdownSelect = Template.bind({});

DropdownSelect.args = {
  // labelText: 'Choose a payment method',
  // title: 'Dao',
  // labelIcon: <EthereumIcon />,
  options: chainOptions,
  // onChange: (e) => {},
};
