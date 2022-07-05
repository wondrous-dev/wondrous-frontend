import { useLazyQuery, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { format } from 'date-fns';
import { GET_AUTOCOMPLETE_USERS, GET_COMPLETED_TASKS_BETWEEN_TIME_PERIOD, GET_ORG_USERS } from 'graphql/queries';
import { Post } from '../../Common/Post';
import Wrapper from '../wrapper';
import {
  ContributorRow,
  ContributorDiv,
  ContributorRowText,
  HeaderText,
  HeaderWrapper,
  SelectDatePicker,
  StyledTextField,
  TaskCountText,
  TaskCountWrapper,
  TasksWrapper,
  TaskRow,
  ExportCSVButton,
  ExportCSVButtonText,
} from 'components/organization/analytics/styles';
import { SafeImage } from 'components/Common/Image';
import { DefaultProfilePicture, UserProfilePicture } from 'components/profile/modals/styles';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import BottomArrowCaret from 'components/Icons/BottomArrowCaret';
import RightArrowCaret from 'components/Icons/RightArrowCaret';
import TaskViewModal from 'components/Common/TaskViewModal';
import { Reward, RewardAmount, RewardContainer, TaskTitle } from 'components/Table/styles';
import { PodName, PodWrapper } from 'components/Common/Task/styles';
import PodIcon from 'components/Icons/podIcon';
import { cutString, shrinkNumber } from 'utils/helpers';
import TaskStatus from 'components/Icons/TaskStatus';
import { TextField } from '@mui/material';
import {
  CreateModalOverlay,
  OptionDiv,
  OptionTypography,
  StyledAutocompletePopper,
  StyledChip,
} from 'components/CreateEntity/styles';
import palette from 'theme/palette';
import { filterOrgUsers } from 'components/CreateEntity/createEntityModal';
import CSVModal from 'components/organization/analytics/CSVModal';
import { exportContributorTaskCSV } from 'components/organization/analytics';
import { PRIVATE_TASK_TITLE } from 'utils/constants';

const UserRowPictureStyles = {
  width: '30px',
  height: '30px',
  borderRadius: '15px',
  marginRight: '8px',
};

const CaretStyle = {
  marginRight: '12px',
};

const calculatePoints = (tasks) => {
  let points = 0;
  tasks.forEach((task) => {
    if (task?.points) {
      points = points + Number(task?.points);
    }
  });
  return points;
};

const UserRow = ({ contributorTask }) => {
  const [clicked, setClicked] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [taskOpened, setTaskOpened] = useState(null);

  return (
    <ContributorDiv>
      <TaskViewModal
        disableEnforceFocus
        open={openModal}
        shouldFocusAfterRender={false}
        handleClose={() => {
          const style = document.body.getAttribute('style');
          const top = style.match(/(top: -)(.*?)(?=px)/);
          document.body.setAttribute('style', '');
          if (top?.length > 0) {
            window?.scrollTo(0, Number(top[2]));
          }
          setOpenModal(false);
        }}
        taskId={taskOpened}
        isTaskProposal={false}
      />
      <ContributorRow
        style={{
          ...(clicked && {
            marginBottom: '4px',
          }),
        }}
        onClick={() => setClicked(!clicked)}
      >
        <>
          {clicked ? <BottomArrowCaret style={CaretStyle} /> : <RightArrowCaret style={CaretStyle} />}
          {contributorTask?.assigneeId ? (
            <>
              {contributorTask?.profilePicture ? (
                <SafeImage src={contributorTask?.profilePicture} style={UserRowPictureStyles} />
              ) : (
                <DefaultUserImage style={UserRowPictureStyles} />
              )}
              <ContributorRowText>{contributorTask?.assigneeUsername}</ContributorRowText>
            </>
          ) : (
            <ContributorRowText
              style={{
                marginLeft: '4px',
              }}
            >
              No assignee
            </ContributorRowText>
          )}
          <div
            style={{
              flex: 1,
            }}
          />
          <TaskCountWrapper>
            <TaskCountText>
              {contributorTask?.tasks?.length}
              <span
                style={{
                  color: 'rgba(108, 108, 108, 1)',
                  marginLeft: '4px',
                }}
              >
                {contributorTask?.tasks?.length === 1 ? 'task' : 'tasks'}
              </span>
            </TaskCountText>
          </TaskCountWrapper>
          <TaskCountWrapper
            style={{
              background: 'none',
              marginLeft: '12px',
            }}
          >
            <TaskCountText>
              {calculatePoints(contributorTask?.tasks)}
              <span
                style={{
                  color: 'rgba(108, 108, 108, 1)',
                  marginLeft: '4px',
                }}
              >
                {calculatePoints(contributorTask?.tasks) ? 'point' : 'points'}
              </span>
            </TaskCountText>
          </TaskCountWrapper>
        </>
      </ContributorRow>
      {clicked && (
        <TasksWrapper>
          {contributorTask?.tasks?.map((task) => {
            const reward = (task.rewards || [])[0];
            return (
              <TaskRow
                key={task?.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (task.title !== PRIVATE_TASK_TITLE) {
                    setOpenModal(true);
                    setTaskOpened(task?.id);
                  }
                }}
              >
                <TaskTitle
                  style={{
                    marginRight: '24px',
                  }}
                >
                  {cutString(task?.title === PRIVATE_TASK_TITLE ? 'Private Task' : task?.title)}
                </TaskTitle>
                <div
                  style={{
                    flex: 1,
                  }}
                />
                <RewardContainer>
                  {reward && (
                    <Reward>
                      <SafeImage
                        src={'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=018'}
                        style={{
                          width: '16px',
                          height: '16px',
                        }}
                      />
                      <RewardAmount
                        style={{
                          marginLeft: '4px',
                          fontWeight: 'normal',
                        }}
                      >
                        {shrinkNumber(reward?.rewardAmount)}
                      </RewardAmount>
                    </Reward>
                  )}
                </RewardContainer>
                <RewardContainer
                  style={{
                    alignItems: 'center',
                    marginRight: '8px',
                  }}
                >
                  <TaskStatus
                    style={{
                      width: '29px',
                      height: '29px',
                    }}
                    status={task?.status}
                  />
                  <RewardAmount
                    style={{
                      marginLeft: '4px',
                      fontWeight: 'normal',
                    }}
                  >
                    {format(new Date(task?.completedAt), 'MM/dd/yyyy')}
                  </RewardAmount>
                </RewardContainer>
              </TaskRow>
            );
          })}
        </TasksWrapper>
      )}
    </ContributorDiv>
  );
};

const filterUsers = (users) => {
  if (!users) {
    return [];
  }

  return users.map((user) => ({
    profilePicture: user?.profilePicture,
    label: user?.username,
    value: user?.id,
  }));
};
const Analytics = (props) => {
  const { podData = {} } = props;
  const { id: podId, orgId } = podData;
  const [ref, inView] = useInView({});
  const [csvModal, setCSVModal] = useState(false);

  const [assignee, setAssignee] = useState(null);
  const [assigneeString, setAssigneeString] = useState('');
  const [getAutocompleteUsers, { data: autocompleteData }] = useLazyQuery(GET_AUTOCOMPLETE_USERS);
  const { data: orgUsersData } = useQuery(GET_ORG_USERS, {
    variables: {
      orgId,
    },
  });

  const today = new Date();
  const lastTwoWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);
  const [toTime, setToTime] = useState(today);
  const [fromTime, setFromTime] = useState(lastTwoWeek);
  const [getCompletedTasksBetweenPeriods, { data, loading }] = useLazyQuery(GET_COMPLETED_TASKS_BETWEEN_TIME_PERIOD, {
    fetchPolicy: 'network-only',
  });

  const preFilteredcontributorTaskData = data?.getCompletedTasksBetweenPeriods || [];
  const noAssigneeIndex = preFilteredcontributorTaskData?.findIndex((element) => !element?.assigneeId);
  var tmp = preFilteredcontributorTaskData[noAssigneeIndex];
  preFilteredcontributorTaskData[noAssigneeIndex] =
    preFilteredcontributorTaskData[preFilteredcontributorTaskData?.length - 1];
  preFilteredcontributorTaskData[preFilteredcontributorTaskData?.length - 1] = tmp;
  let contributorTaskData = preFilteredcontributorTaskData.slice(0, preFilteredcontributorTaskData?.length - 1);
  contributorTaskData.sort((a, b) => {
    if (a?.tasks?.length > b?.tasks?.length) {
      return -1;
    } else if (a?.tasks?.length < b?.tasks?.length) {
      return 1;
    } else {
      return 0;
    }
  });
  useEffect(() => {
    if (podId && fromTime && toTime) {
      getCompletedTasksBetweenPeriods({
        variables: {
          podId,
          toTime: format(toTime, 'yyyy-MM-dd'),
          fromTime: format(fromTime, 'yyyy-MM-dd'),
          ...(assignee && {
            assigneeId: assignee?.value,
          }),
        },
      });
    }
  }, [orgId, fromTime, toTime, assignee?.value]);

  return (
    <Wrapper>
      <CreateModalOverlay
        open={csvModal}
        onClose={() => setCSVModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <CSVModal
          open={csvModal}
          handleClose={() => setCSVModal(false)}
          fromTime={fromTime}
          toTime={toTime}
          exportContributorTaskCSV={exportContributorTaskCSV}
          contributorTaskData={contributorTaskData}
          isPod={true}
        />
      </CreateModalOverlay>
      <HeaderWrapper>
        <HeaderText>Completed work from</HeaderText>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <SelectDatePicker
            title="Due date"
            inputFormat="MM/dd/yyyy"
            value={fromTime}
            onChange={(value) => setFromTime(value)}
            renderInput={(params) => <StyledTextField {...params} />}
          />
        </LocalizationProvider>
        <HeaderText>to</HeaderText>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <SelectDatePicker
            title="Due date"
            inputFormat="MM/dd/yyyy"
            value={toTime}
            onChange={(value) => setToTime(value)}
            renderInput={(params) => <StyledTextField {...params} />}
          />
        </LocalizationProvider>
        <HeaderText>by</HeaderText>
        <StyledAutocompletePopper
          options={
            assigneeString
              ? filterUsers(autocompleteData?.getAutocompleteUsers)
              : filterOrgUsers(orgUsersData?.getOrgUsers)
          }
          onOpen={() => {
            // if (pod) {
            //   getPodUsers({
            //     variables: {
            //       podId: pod?.id || pod,
            //       limit: 100, // TODO: fix autocomplete
            //     },
            //   });
            // }
          }}
          renderInput={(params) => {
            const InputProps = {
              ...params?.InputProps,
              type: 'autocomplete',
              startAdornment:
                assignee && assigneeString ? (
                  <StyledChip label={assigneeString} onDelete={() => setAssignee(null)} />
                ) : (
                  ''
                ),
            };
            return (
              <TextField
                {...params}
                style={{
                  color: palette.white,
                  fontFamily: 'Space Grotesk',
                  fontSize: '16px',
                  paddingLeft: '4px',
                  width: '200px',
                  background: '#191919',
                  borderRadius: '8px',
                  marginLeft: '8px',
                }}
                placeholder="Enter username..."
                InputLabelProps={{ shrink: false }}
                InputProps={InputProps}
                inputProps={{
                  ...params?.inputProps,
                  style: {
                    opacity: assignee ? '0' : '1',
                  },
                }}
              />
            );
          }}
          value={assignee}
          inputValue={assigneeString}
          onInputChange={(event, newInputValue) => {
            setAssigneeString(newInputValue);
            getAutocompleteUsers({
              variables: {
                username: newInputValue,
              },
            });
          }}
          onChange={(_, __, reason) => {
            if (reason === 'clear') {
              setAssignee(null);
              getCompletedTasksBetweenPeriods({
                variables: {
                  orgId,
                  toTime: format(toTime, 'yyyy-MM-dd'),
                  fromTime: format(fromTime, 'yyyy-MM-dd'),
                },
              });
            }
          }}
          renderOption={(props, option, state) => {
            return (
              <OptionDiv
                onClick={(event) => {
                  setAssignee(option);
                  props?.onClick(event);
                }}
              >
                {option?.profilePicture && (
                  <SafeImage
                    src={option?.profilePicture}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '15px',
                    }}
                  />
                )}
                <OptionTypography>{option?.label}</OptionTypography>
              </OptionDiv>
            );
          }}
        />
        <ExportCSVButton
          style={{
            borderRadius: '8px',
            height: '40px',
            marginLeft: '12px',
            minHeight: '40px',
          }}
          buttonInnerStyle={{
            borderRadius: '7px',
          }}
          onClick={() =>
            exportContributorTaskCSV({
              contributorTaskData,
              fromTime,
              toTime,
              isPod: true,
            })
          }
        >
          <ExportCSVButtonText>Export Tasks</ExportCSVButtonText>
        </ExportCSVButton>
      </HeaderWrapper>
      {contributorTaskData?.length === 0 && (
        <HeaderText
          style={{
            fontWeight: 'normal',
          }}
        >
          Nothing found in this time period.
        </HeaderText>
      )}
      {contributorTaskData?.map((contributorTask, index) => (
        <UserRow key={index} contributorTask={contributorTask} />
      ))}
    </Wrapper>
  );
};

export default Analytics;
