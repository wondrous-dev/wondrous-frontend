import React, { useState } from 'react';
import { InputAdornment } from '@material-ui/core';
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

let timeout;

export default function SearchTasks({ onSearch }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(router.query.search);
  const [options, setOptions] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const LIMIT = 5;

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  // if use throttle from the lodash library, it sends request every function call
  // and doesn't matter if you use async/await or .then
  const handleInputChange = (event, searchString) => {
    clearTimeout(timeout);

    timeout = setTimeout(async () => {
      const tasks = await onSearch(searchString);
      setOptions(tasks.slice(LIMIT));
      setHasMore(tasks.length > LIMIT);
    }, 200);
  };

  function handleTaskClick(task) {
    const isProposal = task.__typename === 'TaskProposalCard';
    setInputValue('');
    setOpen(false);
    router.replace(
      `${delQuery(router.asPath)}?task${isProposal ? 'Proposal' : ''}=${task?.id}&view=${router.query.view || 'grid'}`
    );
  }

  function handleShowMore() {
    setOpen(false);
    router.replace(`${delQuery(router.asPath)}?search=${inputValue}&view=list`);
  }

  return (
    <Autocomplete
      open={true}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      inputValue={inputValue}
      onInputChange={(event, searchString) => {
        handleInputChange(event, searchString);
        setInputValue(searchString);
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
