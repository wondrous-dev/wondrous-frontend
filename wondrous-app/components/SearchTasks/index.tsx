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
import { SafeImage } from '../Common/Image';
import { UserIconSmall } from '../Icons/Search/types';

const TaskTypeIcons = {
  [TASK_TYPE]: <TaskIcon />,
  [MILESTONE_TYPE]: <MilestoneIcon />,
  [BOUNTY_TYPE]: <BountyIcon />,
};

type Props = {
  onSearch: (
    searchString: string
  ) => Promise<{ tasks: TaskFragment[]; users: Array<{ username: string; bio: string }> }>;
};

let timeout;

export default function SearchTasks({ onSearch }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const LIMIT = 8;

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
      const { users, tasks } = await onSearch(searchString);
      setOptions([...users.slice(0, 5), ...tasks.slice(0, 5)]);
      setHasMore(users.length + tasks.length > LIMIT);

      console.log([...users.slice(0, 5), ...tasks.slice(0, 5)], '---------');
    }, 200);
  };

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
