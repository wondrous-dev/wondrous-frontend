import React, { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import AutocompleteComponent from '@mui/material/Autocomplete';
import { Input, SearchIconWrapped } from 'components/SearchTasks/styles';
import { InputAdornment } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export default {
  title: 'Inputs/Autocomplete',
  component: AutocompleteComponent,
  parameters: {
    docs: {
      description: {
        component: `The Dropdown Select is a pattern that you can apply to other patterns to implement a search functionality or multiple selection in lists.`,
      },
    },
  },
  // argTypes: {
  //   open: {
  //     control: 'object',
  //   },
  //   onOpen: {
  //     action: 'setOpen',
  //   },
  //   onBlur: {
  //     action: 'handleBlur',
  //   },
  //   onFocus: {
  //     action: 'handleFocus',
  //   },
  //   onClose: {
  //     action: 'setOpen',
  //   },
  //   onInputChange: {
  //     control: 'boolean',
  //   },
  //   style: {
  //     type: 'string',
  //   },
  //   freeSolo: {
  //     type: 'string',
  //   },
  //   getOptionLabel: {
  //     control: 'boolean',
  //   },
  // },
} as ComponentMeta<typeof AutocompleteComponent>;

const Template: ComponentStory<typeof AutocompleteComponent> = (props) => {
  const [options] = useState([
    { label: 'Task #1', id: 1 },
    { label: 'Task #2', id: 2 },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AutocompleteComponent
      {...props}
      options={options}
      disableClearable
      noOptionsText="No results found"
      onInputChange={(event, searchString) => {
        setIsLoading(true);
      }}
      renderInput={(params) => {
        return (
          <Input
            sx={{ height: '40px' }}
            {...params}
            placeholder="Search"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIconWrapped />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {isLoading ? <CircularProgress color="secondary" size={20} sx={{ marginRight: '12px' }} /> : null}
                </InputAdornment>
              ),
            }}
          />
        );
      }}
    />
  );
};

export const Autocomplete = Template.bind({});
