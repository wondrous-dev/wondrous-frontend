import React, { useState } from 'react';
import { InputAdornment } from '@material-ui/core';
import throttle from 'lodash/throttle';
import last from 'lodash/last';

import SearchIcon from '../Icons/search';
import { Autocomplete, Input, LoadMore, Option } from './styles';
import TaskIcon from '../Icons/TaskTypes/task';
import MilestoneIcon from '../Icons/TaskTypes/milestone';
import BountyIcon from '../Icons/TaskTypes/bounty';

import { TaskFragment } from '../../types/task';
import { TASK_TYPE, BOUNTY_TYPE, MILESTONE_TYPE } from '../../utils/constants';
import { delQuery } from '../../utils';
import { useRouter } from 'next/router';

const TaskTypeIcons = {
  [TASK_TYPE]: <TaskIcon />,
  [MILESTONE_TYPE]: <MilestoneIcon />,
  [BOUNTY_TYPE]: <BountyIcon />,
};

type Props = {
  onSearch: (searchString: string) => Promise<TaskFragment[]>;
};

export default function SearchTasks({ onSearch }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const LIMIT = 5;

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  // React.useEffect(() => {
  //   if (options.length > LIMIT) {
  //     setHasMore(true);
  //   }
  // }, [options]);

  const handleInputChange = throttle(async (event, searchString) => {
    const searchResult = await onSearch(searchString);

    setOptions(searchResult);
    setHasMore(searchResult.length > 4);
  }, 200);

  function handleTaskClick(task) {
    setInputValue('');
    setOpen(false);
    router.replace(`${delQuery(router.asPath)}?task=${task?.id}&view=${router.query.view || 'grid'}`);
  }

  function handleShowMore() {
    setOpen(false);
    router.replace(`${delQuery(router.asPath)}?search=${inputValue}&view=list`);
  }

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      inputValue={inputValue}
      onInputChange={(event, searchString) => {
        setInputValue(searchString);
        handleInputChange(event, searchString);
      }}
      freeSolo
      getOptionLabel={(option) => option.title}
      options={options}
      filterOptions={(x) => x}
      renderOption={(props, task) => {
        let content = [
          <Option key={task.title} onClick={() => handleTaskClick(task)}>
            {TaskTypeIcons[task.type]}
            {task.title}
          </Option>,
        ];

        if (hasMore && last(options) === task) {
          content.push(
            <Option onClick={() => handleShowMore()}>
              <LoadMore>Show more results</LoadMore>
            </Option>
          );
        }

        return content;
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
