import React, { useState } from 'react';
import { InputAdornment } from '@material-ui/core';

import SearchIcon from '../Icons/search';
import { Autocomplete, Input, LoadMore, Option } from './styles';
import { DAOIcon } from '../Icons/dao';
import { useLazyQuery } from '@apollo/client';
import { GET_ORG_TASK_BOARD_TASKS, SEARCH_TASKS_FOR_ORG_BOARD_VIEW } from '../../graphql/queries';
import { dedupeColumns } from '../../utils';
import { populateTaskColumns } from '../../pages/organization/[username]/boards';
import { useRouter } from 'next/router';

const tasks = [
  { title: 'Create data scrape' },
  { title: 'Create data scrape2' },
  { title: 'Create data scrape3' },
  { title: 'Show more results', moreResults: true },
];

export default function SearchTasks() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState(tasks);
  const [hasMore, setHasMore] = useState(true);
  const loading = open && options.length === 0;
  const { username, orgId } = router.query;

  const [searchOrgTasks, { fetchMore, variables: searchOrgTasksVariables }] = useLazyQuery(
    SEARCH_TASKS_FOR_ORG_BOARD_VIEW,
    {
      onCompleted: (data) => {
        console.log(data);
      },
      fetchPolicy: 'cache-and-network',
    }
  );

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
        // console.log(newInputValue);
        // setOptions([...tasks]);
        searchOrgTasks({
          variables: {
            // orgId: '0xwonderverse',
            limit: 10,
            offset: 0,
            orgId: '47594141467541505',
            searchString: newInputValue,
          },
        });
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
