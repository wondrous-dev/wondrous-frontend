import { Badge, InputAdornment } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import last from 'lodash/last';
import React, { useRef, useState } from 'react';

import TaskViewModal from 'components/Common/TaskViewModal';
import { useRouter } from 'next/router';
import { useHotkeys } from 'react-hotkeys-hook';
import { ViewType } from 'types/common';
import { TaskInterface } from 'types/task';
import { delQuery } from 'utils';
import { BOUNTY_TYPE, MILESTONE_TYPE, TASK_TYPE } from 'utils/constants';
import { useExploreGr15TasksAndBounties, useHotkey, useUserBoard } from 'utils/hooks';
import { HOTKEYS } from 'utils/hotkeyHelper';
import { SafeImage } from '../Common/Image';
import { UserIconSmall } from '../Icons/Search/types';
import BountyIcon from '../Icons/TaskTypes/bounty';
import MilestoneIcon from '../Icons/TaskTypes/milestone';
import TaskIcon from '../Icons/TaskTypes/task';
import { Autocomplete as DefaultAutocomplete, Input, LoadMore, Option, SearchIconWrapped } from './styles';

const TaskTypeIcons = {
  [TASK_TYPE]: <TaskIcon />,
  [MILESTONE_TYPE]: <MilestoneIcon />,
  [BOUNTY_TYPE]: <BountyIcon />,
};

type Props = {
  onSearch: (
    searchString: string
  ) => Promise<{ users: Array<any>; tasks: TaskInterface[]; proposals: TaskInterface[] }>;
  isExpandable?: boolean;
  autocompleteComponent?: React.Component;
};

let timeout;

export default function SearchTasks({ onSearch, isExpandable, autocompleteComponent }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState(router.query.search);
  const [options, setOptions] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const board = useUserBoard() || {};
  const autocompleteRef = useRef<HTMLInputElement>();
  const exploreGr15TasksAndBounties = useExploreGr15TasksAndBounties();
  useHotkeys(
    HOTKEYS.LOCAL_SEARCH,
    () => {
      setIsExpanded(!isExpanded);
      autocompleteRef.current.focus();
      setInputValue('');
    },
    [isExpanded]
  );
  const showBadge = useHotkey();

  const { searchLabel = 'Search tasks or people...' } = board;
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

        const hasMore = [...(tasks || []), ...(proposals || [])].length > LIMIT;
        const tasksWithProposals = [...(tasks || []), ...(proposals || [])].slice(0, LIMIT);

        setOptions([...tasksWithProposals, ...users]);
        setHasMore(hasMore);
      }

      setIsLoading(false);
    }, 200);
  };

  function handleTaskClick(task) {
    const taskType = task.__typename === 'TaskProposalCard' ? 'proposal' : 'task';
    const query = {
      ...router.query,
      [taskType]: task?.id,
    };

    router.push({ query }, undefined, { scroll: false, shallow: true });
  }

  function handleShowMore() {
    setOpen(false);

    router.push({
      pathname: location.pathname,
      query: {
        search: inputValue,
        view: 'list',
      },
    }, undefined, {
      scroll: false,
      shallow: true,
    });
  }

  const Autocomplete = autocompleteComponent || DefaultAutocomplete;
  const autocompleteWidth = isExpandable ? (isExpanded ? '100%' : '30%') : '100%';

  const handleBlur = (e) => setIsExpanded(false);
  const handleFocus = () => setIsExpanded(true);
  if (exploreGr15TasksAndBounties) return null;
  return (
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
        const content = [];

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
                  useNextImage={false}
                  src={taskOrUser?.profilePicture}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                  }}
                  alt="Profile picture"
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
          sx={{ height: '40px' }}
          {...params}
          inputRef={autocompleteRef}
          placeholder={`${isExpanded || !isExpandable ? searchLabel : 'Search'}`}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Badge badgeContent={HOTKEYS.LOCAL_SEARCH} color="primary" invisible={!showBadge}>
                  <SearchIconWrapped />
                </Badge>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {isLoading ? <CircularProgress color="secondary" size={20} sx={{ marginRight: '12px' }} /> : null}
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}
