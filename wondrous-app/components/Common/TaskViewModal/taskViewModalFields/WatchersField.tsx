import React, { useMemo, useState } from 'react';
import { useMutation } from '@apollo/client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

import { useMe } from 'components/Auth/withAuth';
import { Button } from 'components/Button';
import { SmallAvatar } from 'components/Common/AvatarList';
import { TaskSectionLabel } from 'components/Common/TaskViewModal/helpers';
import { TaskSectionDisplayDiv } from 'components/Common/TaskViewModal/styles';
import CloseIcon from 'components/Icons/closeModal';
import Tooltip from 'components/Tooltip';
import { UPDATE_TASK_OBSERVERS } from 'graphql/mutations';
import useAlerts from 'hooks/useAlerts';
import palette from 'theme/palette';
import { TaskInterface } from 'types/task';

type WatchersFieldProps = {
  fetchedTask: TaskInterface;
};

function WatchersField({ fetchedTask }: WatchersFieldProps) {
  const currentUser = useMe();
  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertAnchorOrigin } = useAlerts();

  const [observers, setObservers] = useState(fetchedTask.observers || []);
  const [updateTaskObservers] = useMutation(UPDATE_TASK_OBSERVERS);

  const isObserving = useMemo(
    () => observers.some((observer) => observer.id === currentUser?.id),
    [observers, currentUser?.id]
  );

  const handleWatch = () => {
    const newObservers = [...observers, currentUser];
    const observerIds = newObservers.map((observer) => observer.id);
    setObservers(newObservers);

    updateTaskObservers({
      variables: {
        observerIds,
        taskId: fetchedTask?.id,
      },
      onCompleted: () => {
        setSnackbarAlertOpen(true);
        setSnackbarAlertMessage('You are now watching this task and will be notified of any updates!');
        setSnackbarAlertAnchorOrigin({
          vertical: 'bottom',
          horizontal: 'center',
        });
      },
    });
  };

  const handleUnwatch = () => {
    const newObservers = observers.filter((observer) => observer.id !== currentUser.id);
    const observerIds = newObservers.map((observer) => observer.id);
    setObservers(newObservers);

    updateTaskObservers({
      variables: {
        observerIds,
        taskId: fetchedTask?.id,
      },
      onCompleted: () => {
        setSnackbarAlertOpen(true);
        setSnackbarAlertMessage('You are no longer watching this task.');
        setSnackbarAlertAnchorOrigin({
          vertical: 'bottom',
          horizontal: 'center',
        });
      },
    });
  };

  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Observer</TaskSectionLabel>
      <Grid container alignItems="center" gap={`${observers.length ? 8 : 0}px`}>
        <Grid container alignItems="center" width="auto">
          {observers.slice(0, 6).map((user, index) => {
            // To show current user at the end of the list
            if (user.id === currentUser?.id || index > (isObserving ? 4 : 5)) {
              return null;
            }

            return (
              <Tooltip key={user.username} title={user.username} placement="top">
                <Box ml="-6px" overflow="hidden">
                  <SmallAvatar
                    imageWidth={22}
                    imageHeight={22}
                    key={user.id}
                    initials={user.username.substring(0, 2).toUpperCase()}
                    avatar={{ url: user.profilePicture }}
                    style={{ borderRadius: '50%', border: `2px solid ${palette.grey910}`, cursor: 'default' }}
                    border="none"
                  />
                </Box>
              </Tooltip>
            );
          })}

          {isObserving ? (
            <>
              <SmallAvatar
                imageWidth={22}
                imageHeight={22}
                initials={currentUser.username.substring(0, 2).toUpperCase()}
                avatar={{ url: currentUser.profilePicture }}
                style={{ borderRadius: '50%', border: `2px solid ${palette.grey99}`, cursor: 'default' }}
                border="none"
              />
              <Box
                sx={{
                  marginLeft: '-26px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  width: '48px',
                  height: '26px',
                  background: palette.grey99,
                  borderRadius: '224px',
                }}
              >
                <Tooltip title="Stop Watching" placement="top">
                  <IconButton
                    onClick={handleUnwatch}
                    sx={{
                      padding: '2px',
                      marginRight: '5px',
                      '&:hover': { background: palette.grey75 },
                    }}
                  >
                    <CloseIcon width="10px" height="10px" />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          ) : null}
        </Grid>

        {isObserving ? (
          <Box sx={{ color: palette.grey250 }}>{`${observers.length} watching`}</Box>
        ) : (
          <Button
            buttonTheme={{
              paddingX: 14,
              fontSize: '14px',
              fontWeight: 500,
            }}
            borderRadius={166}
            height={26}
            onClick={handleWatch}
          >
            Watch this task
          </Button>
        )}
      </Grid>
    </TaskSectionDisplayDiv>
  );
}

export default WatchersField;
