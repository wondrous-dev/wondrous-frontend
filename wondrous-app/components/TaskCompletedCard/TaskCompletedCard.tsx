import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';

import { delQuery } from 'utils';
import { Grey57 } from 'theme/colors';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { ENTITIES_TYPES, PRIVACY_LEVEL } from 'utils/constants';
import { useLocation } from 'utils/useLocation';

import { SafeImage } from 'components/Common/Image';
import PodIcon from 'components/Icons/podIcon';
import { TaskCommentIcon } from 'components/Icons/taskComment';
import ProfileCompensation from 'components/Common/ProfileCompensation';
import { ToggleBoardPrivacyIcon } from 'components/Common/PrivateBoardIcon';
import { TaskCreatedBy } from 'components/Common/TaskCreatedBy';
import { SubtaskLightIcon } from 'components/Icons/subtask';
import Tooltip from 'components/Tooltip';
import MilestoneIcon from 'components/Icons/milestoneField.svg';
import { TASK_ICONS } from 'components/Common/Task/card';
import { AvatarList } from 'components/Common/AvatarList';
import { BoardsCardMedia, BoardsCardFooter } from 'components/Common/Boards/styles';

import styles from './styles';

import {
  TaskHeader,
  TaskContent,
  TaskTitle,
  TaskAction,
  TaskActionAmount,
  PodWrapper,
  PodName,
  TaskHeaderIconWrapper,
  SubtaskCountWrapper,
  SubtaskCount,
} from 'components/Common/Task/styles';

const TaskCompletedCard = ({ item }) => {
  const task = item;
  const {
    actions = {},
    rewards = null,
    id,
    media,
    status,
    title = '',
    assigneeId = null,
    assigneeUsername = null,
    assigneeProfilePicture = null,
    users = [],
    type,
    createdBy,
    commentCount,
  } = task;
  const location = useLocation();
  const [userList, setUserList] = useState([]);

  let TaskIcon = TASK_ICONS[status];
  const totalSubtask = task?.totalSubtaskCount;
  const coverMedia = task?.media?.find((media) => media.type === 'image');

  useEffect(() => {
    // One assigned person.
    if (assigneeUsername) {
      // clean
      setUserList([
        {
          id: assigneeId,
          name: assigneeUsername,
          initials: assigneeUsername[0].toUpperCase(),
          avatar: {
            url: assigneeProfilePicture,
            isOwnerOfPod: false,
            color: null,
          },
        },
      ]);
    } else {
      setUserList(users);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assigneeUsername]);

  const goToPod = (podId) => {
    // Filter or go to Pod Page
    router.push(`/pod/${podId}/boards`, undefined, {
      shallow: true,
    });
  };

  const router = useRouter();
  const { data: userPermissionsContextData } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });


  const isMilestone = type === ENTITIES_TYPES.MILESTONE;
  const isSubtask = task?.parentTaskId !== null;
  const taskType = task?.isProposal ? 'taskProposal' : 'task';

  return (
    <Box sx={styles.root}>
      <TaskHeader>
        <TaskHeaderIconWrapper>
          <SafeImage
            src={task?.orgProfilePicture}
            style={{
              width: 29,
              height: 28,
              borderRadius: 4,
              marginRight: 8,
            }}
          />
          {isMilestone && <MilestoneIcon />}
          <AvatarList users={userList} id={'task-' + task?.id} />
        </TaskHeaderIconWrapper>
        {task?.privacyLevel === PRIVACY_LEVEL.public && (
          <ToggleBoardPrivacyIcon
            style={{
              width: task?.assigneeId ? 40 : 'auto',
              marginRight: 0
            }}
            isPrivate={task?.privacyLevel !== PRIVACY_LEVEL.public}
            tooltipTitle={task?.privacyLevel !== PRIVACY_LEVEL.public ? 'Private' : 'Public'}
          />
        )}

        <div
          style={{
            flex: 1,
          }}
        />
        {rewards && rewards?.length > 0 && (
          <ProfileCompensation
            style={{
              flexGrow: '0',
              marginLeft: '8px',
              alignSelf: 'center',
            }}
            rewards={rewards}
            taskIcon={<TaskIcon />}
          />
        )}
      </TaskHeader>
      <TaskCreatedBy type={type} router={router} createdBy={createdBy} />

      <TaskContent>
        <TaskTitle>{task.title}</TaskTitle>

        {coverMedia ? (
          <BoardsCardMedia>
            <SafeImage
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
              src={coverMedia.slug}
            />
          </BoardsCardMedia>
        ) : null}
      </TaskContent>
      <BoardsCardFooter style={{ paddingBottom: '0' }}>
        {task?.podName && (
          <PodWrapper
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToPod(task?.podId);
            }}
            style={{
              marginTop: '0',
            }}
          >
            <PodIcon
              color={task?.podColor}
              style={{
                width: '26px',
                height: '26px',
                marginRight: '8px',
              }}
            />
            <PodName
              style={{
                whiteSpace: 'nowrap',
                maxWidth: '155px',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              {task?.podName}
            </PodName>
          </PodWrapper>
        )}
        {isSubtask && (
          <Tooltip title="Subtask" placement="top">
            <div>
              <SubtaskLightIcon stroke="white" />
            </div>
          </Tooltip>
        )}

        <div
          style={{
            flex: 1,
          }}
        />
        {commentCount > 0 && (
          <Tooltip title="View comments" placement="top">
            <TaskAction
              key={'task-comment-' + id}
              style={{
                marginRight: !isSubtask && !isMilestone && totalSubtask > 0 ? '0' : '18px',
              }}
            >
              <TaskCommentIcon />
              <TaskActionAmount>{commentCount}</TaskActionAmount>
            </TaskAction>
          </Tooltip>
        )}
        {!isSubtask && !isMilestone && totalSubtask > 0 && (
          <Tooltip title="Subtasks" placement="top">
            <SubtaskCountWrapper
              style={{
                marginRight: '12px',
                paddingLeft: '0',
              }}
            >
              <SubtaskLightIcon fill="none" stroke={Grey57} />
              <SubtaskCount>{totalSubtask}</SubtaskCount>
            </SubtaskCountWrapper>
          </Tooltip>
        )}
      </BoardsCardFooter>
    </Box>
  );
};

export default TaskCompletedCard;
