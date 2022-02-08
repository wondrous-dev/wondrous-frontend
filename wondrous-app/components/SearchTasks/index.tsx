import React, { useState } from 'react';
import { InputAdornment } from '@material-ui/core';
import styled from 'styled-components';

import SearchIcon from '../Icons/search';
import { Autocomplete, Input } from './styles';
import { DAOIcon } from '../Icons/dao';
import { HighlightBlue } from '../../theme/colors';

const Option = styled.li`
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 12px;

  svg {
    width: 18px;
    height: 18px;
    margin-right: 12px;
  }
`;

const LoadMore = styled.a`
  margin-top: 10px;
  cursor: pointer;
  color: ${HighlightBlue};
`;

const tasks = [
  { title: 'Create data scrape' },
  { title: 'Create data scrape2' },
  { title: 'Create data scrape3' },
  { title: 'Show more results', moreResults: true },
];

export default function SearchTasks() {
  const [open, setOpen] = useState(true);
  const [options, setOptions] = useState(tasks);
  const [hasMore, setHasMore] = useState(true);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={(event, newValue) => {
        // setOptions(newValue ? [newValue, ...options] : options);
        // setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        console.log(newInputValue);
        setOptions([...tasks]);
      }}
      freeSolo
      isOptionEqualToValue={(option, value) => option.title === value.title}
      getOptionLabel={(option) => option.title}
      options={options}
      loading={loading}
      filterOptions={(x) => x}
      renderOption={(props, option) => {
        console.log(props, option);

        if (option.moreResults) {
          return (
            <Option>
              <LoadMore>Show more results</LoadMore>
            </Option>
          );
        }

        return (
          <Option>
            <DAOIcon />
            {option.title}
          </Option>
        );
      }}
      renderInput={(params) => (
        <Input
          {...params}
          placeholder="Search people or pods..."
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}
