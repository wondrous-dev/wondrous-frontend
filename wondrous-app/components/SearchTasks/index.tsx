import React, { useState } from 'react';
import { InputAdornment } from '@material-ui/core';
import last from 'lodash/last';

import SearchIcon from '../Icons/search';
import { Autocomplete, Input, LoadMore, Option } from './styles';
import TaskIcon from '../Icons/TaskTypes/task';
import MilestoneIcon from '../Icons/TaskTypes/milestone';
import BountyIcon from '../Icons/TaskTypes/bounty';
import { SafeImage } from '../Common/Image';
import { UserIconSmall } from '../Icons/Search/types';

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
  onSearch: (searchString: string) => Promise<{ users: Array<any>; tasks: TaskFragment[]; proposals: TaskFragment[] }>;
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
      const { users = [], proposals, tasks } = await onSearch(searchString);
      debugger;
      const hasMore = [...tasks, ...proposals].length > LIMIT;
      const tasksWithProposals = [...tasks, ...proposals].slice(0, LIMIT);

      setOptions([...tasksWithProposals, ...users]);
      setHasMore(hasMore);
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
      renderOption={(props, taskOrUser) => {
        let content = [];

        if (taskOrUser.username) {
          content.push(
            <Option
              key={taskOrUser.username}
              onClick={() => {
                router.push(`/profile/${taskOrUser.username}/about`);
              }}
            >
              {taskOrUser.profilePicture ? (
                <SafeImage
                  src={taskOrUser?.profilePicture}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                  }}
                />
              ) : (
                <UserIconSmall />
              )}
              {taskOrUser.username}
            </Option>
          );
        } else {
          content.push(
            <Option key={taskOrUser.title} onClick={() => handleTaskClick(taskOrUser)}>
              {TaskTypeIcons[taskOrUser.type]}
              {taskOrUser.title}
            </Option>
          );
        }

        if (hasMore && last(options) === taskOrUser) {
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
