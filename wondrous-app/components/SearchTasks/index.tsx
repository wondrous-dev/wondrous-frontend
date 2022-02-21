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
import {TaskViewModal} from "../Common/Task/modal";
import * as Constants from "../../utils/constants";

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
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
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
      const hasMore = [...tasks, ...proposals].length > LIMIT;
      const tasksWithProposals = [...tasks, ...proposals].slice(0, LIMIT);

      setOptions([...tasksWithProposals, ...users]);
      setHasMore(hasMore);
    }, 200);
  };

  function handleTaskClick(task) {
    // const isProposal = task.__typename === 'TaskProposalCard';
    // setInputValue('');
    // setOpen(false);
    //
    // router.replace({
    //   pathname: location.pathname,
    //   query: {
    //     [`task${isProposal ? 'Proposal' : ''}`]: task.id,
    //     view: router.query.view,
    //   },
    // }, undefined, { shallow: true });

    const urlParams: any = new URLSearchParams(window.location.search);
    urlParams.append(task.__typename === 'TaskProposalCard' ? 'taskProposal' : 'task', task?.id);
    history.pushState({}, '', `${delQuery(router.asPath)}?${urlParams.toString()}`);

    setSelectedTask(task);
    // setSelectedTaskType(taskType);
    // setPreviewModalOpen(true);
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

  return (
    <>
      <TaskViewModal
          open={!!selectedTask}
          handleClose={() => {
            setSelectedTask(null);

            const urlParams: any = new URLSearchParams(window.location.search);
            urlParams.delete('task');
            urlParams.delete('taskProposal');
            history.pushState({}, '', `${delQuery(router.asPath)}?${urlParams.toString()}`);
          }}
          task={selectedTask}
      />

      <Autocomplete
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        // inputValue={inputValue}
        onInputChange={(event, searchString) => {
          handleInputChange(event, searchString);
          setInputValue(searchString);
        }}
        freeSolo
        getOptionLabel={(takOrUser) => takOrUser.username || takOrUser.title}
        options={options}
        filterOptions={(x) => x}
        renderOption={(props, taskOrUser) => {
          let content = [];

          if (taskOrUser.username) {
            content.push(
              <Option
                key={taskOrUser.username}
                onClick={() => {
                  router.push({ pathname: location.pathname, query: { userId: taskOrUser.id } });
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
    </>
  );
}
