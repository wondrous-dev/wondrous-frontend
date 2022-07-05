import React, { useState } from 'react';
import { InputAdornment } from '@mui/material';
import last from 'lodash/last';
import CircularProgress from '@mui/material/CircularProgress';

import { Autocomplete as DefaultAutocomplete, Input, LoadMore, Option, SearchIconWrapped } from './styles';
import TaskIcon from '../Icons/TaskTypes/task';
import MilestoneIcon from '../Icons/TaskTypes/milestone';
import BountyIcon from '../Icons/TaskTypes/bounty';
import { SafeImage } from '../Common/Image';
import { UserIconSmall } from '../Icons/Search/types';

import { TaskFragment } from 'types/task';
import { TASK_TYPE, BOUNTY_TYPE, MILESTONE_TYPE } from 'utils/constants';
import { delQuery } from 'utils';
import { useRouter } from 'next/router';
import TaskViewModal from 'components/Common/TaskViewModal';
import { ViewType } from 'types/common';

const TaskTypeIcons = {
  [TASK_TYPE]: <TaskIcon />,
  [MILESTONE_TYPE]: <MilestoneIcon />,
  [BOUNTY_TYPE]: <BountyIcon />,
};

type Props = {
  onSearch: (searchString: string) => Promise<{ users: Array<any>; tasks: TaskFragment[]; proposals: TaskFragment[] }>;
  isExpandable?: boolean;
  autocompleteComponent?: React.Component;
};

let timeout;

export default function SearchTasks({ onSearch, isExpandable, autocompleteComponent }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [inputValue, setInputValue] = useState(router.query.search);
  const [options, setOptions] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
    setIsLoading(true);

    timeout = setTimeout(async () => {
      // Reset if field is empty
      if (!searchString) {
        setOptions([]);
        setHasMore(false);
      } else {
        const { users = [], proposals, tasks } = await onSearch(searchString);

        const hasMore = [...tasks, ...proposals].length > LIMIT;
        const tasksWithProposals = [...tasks, ...proposals].slice(0, LIMIT);

        setOptions([...tasksWithProposals, ...users]);
        setHasMore(hasMore);
      }

      setIsLoading(false);
    }, 200);
  };

  function handleTaskClick(task) {
    const urlParams: any = new URLSearchParams(window.location.search);
    urlParams.append(task.__typename === 'TaskProposalCard' ? 'taskProposal' : 'task', task?.id);
    router.replace(`${delQuery(router.asPath)}?${urlParams.toString()}`);

    setSelectedTask(task);
  }

  function handleShowMore() {
    setOpen(false);

    router.push({
      pathname: location.pathname,
      query: {
        search: inputValue,
        view: 'list',
      },
    });
  }

  const Autocomplete = autocompleteComponent || DefaultAutocomplete;
  const autocompleteWidth = isExpandable ? (isExpanded ? '100%' : '17%') : '100%';

  const handleBlur = (e) => setIsExpanded(false);
  const handleFocus = () => setIsExpanded(true);
  return (
    <>
      <TaskViewModal
        open={!!selectedTask}
        handleClose={() => {
          setSelectedTask(null);
          router.replace(`${delQuery(router.asPath)}?view=${router.query.view ?? ViewType.Grid}`);
        }}
        isTaskProposal={selectedTask?.__typename === 'TaskProposalCard'}
        taskId={selectedTask?.id}
      />

      <Autocomplete
        open={open}
        onOpen={() => setOpen(true)}
        onBlur={handleBlur}
        onFocus={handleFocus}
        isExpanded={isExpanded}
        onClose={() => setOpen(false)}
        onInputChange={(event, searchString) => {
          handleInputChange(event, searchString);
          if (searchString === 'undefined') {
            setInputValue('');
          } else {
            setInputValue(searchString || '');
          }
        }}
        style={{ width: autocompleteWidth }}
        disableClearable
        freeSolo={!inputValue || isLoading}
        getOptionLabel={(takOrUser) => takOrUser.username || takOrUser.title || inputValue}
        noOptionsText="no results found"
        options={options}
        isLoading={isLoading}
        filterOptions={(x) => x}
        renderOption={(props, taskOrUser) => {
          let content = [];

          if (taskOrUser.username) {
            content.push(
              <Option
                key={taskOrUser.username}
                onClick={() => {
                  router.push({
                    pathname: location.pathname,
                    query: { userId: taskOrUser.id, view: router.query.view ?? ViewType.Grid },
                  });
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
        renderInput={(params) => {
          return (
            <Input
              {...params}
              placeholder={`${isExpanded || !isExpandable ? 'Search tasks or people...' : 'Search'}`}
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
    </>
  );
}
