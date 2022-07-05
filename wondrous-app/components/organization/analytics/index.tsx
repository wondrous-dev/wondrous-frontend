import { useLazyQuery, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { format } from 'date-fns';
import { GET_AUTOCOMPLETE_USERS, GET_COMPLETED_TASKS_BETWEEN_TIME_PERIOD, GET_ORG_USERS } from 'graphql/queries';
import Wrapper from '../wrapper/wrapper';
import palette from 'theme/palette';
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
} from './styles';
import { SafeImage } from 'components/Common/Image';
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
import { OptionDiv, OptionTypography, StyledAutocompletePopper, StyledChip } from 'components/CreateEntity/styles';
import { filterOrgUsers } from 'components/CreateEntity/createEntityModal';
import { PayoutModal } from './PayoutModal';
import { PRIVATE_TASK_TITLE } from 'utils/constants';

export const exportContributorTaskCSV = ({ contributorTaskData, fromTime, toTime, isPod = false }) => {
  let headers = ['username', 'Address/ENS', 'taskTitle', 'taskLink', 'points', 'Amount', 'Token Address/Token Symbol'];

  const rows = [[headers]];
  if (!contributorTaskData) {
    return;
  }
  contributorTaskData.forEach((contributorTask) => {
    const assigneeUsername = contributorTask?.assigneeUsername || '';
    const wallet = contributorTask?.assigneeWallet;
    const tasks = contributorTask?.tasks;
    tasks?.forEach((task) => {
      const link = process.env.NEXT_PUBLIC_PRODUCTION
        ? `https://app.wonderverse.xyz/invite/`
        : 'https://wondrous-app-git-staging-wonderverse.vercel.app/invite/';
      const finalLink = isPod
        ? `${link}pod/${task?.pod?.id}/boards?task=${task?.id}`
        : `${link}organization/${task?.org?.username}/boards?task=${task?.id}`;
      const reward = (task.rewards || [])[0];
      let newRow = [
        assigneeUsername,
        wallet,
        task?.title === PRIVATE_TASK_TITLE ? 'Private Task' : task?.title,
        finalLink,
        task?.points || '',
        reward ? reward?.rewardAmount : '',
        reward ? reward?.symbol : '',
      ];
      rows.push(newRow);
    });
  });
  let csvContent = 'data:text/csv;charset=utf-8,';
  rows.forEach(function (rowArray) {
    let row = rowArray.join(',');
    csvContent += row + '\r\n';
  });
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute(
    'download',
    `wonderverse_contributor_data_${format(new Date(fromTime), 'MM/dd/yyyy')}_to_${format(
      new Date(toTime),
      'MM/dd/yyyy'
    )}.csv`
  );
  document.body.appendChild(link); // Required for FF
  link.click();
};
export const UserRowPictureStyles = {
  width: '30px',
  height: '30px',
  borderRadius: '15px',
  marginRight: '8px',
};

const CaretStyle = {
  marginRight: '12px',
};

export const calculatePoints = (tasks) => {
  let points = 0;
  if (!tasks) {
    return points;
  }
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
              {contributorTask?.assigneeProfilePicture ? (
                <SafeImage src={contributorTask?.assigneeProfilePicture} style={UserRowPictureStyles} />
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
                {calculatePoints(contributorTask?.tasks) === 1 ? 'point' : 'points'}
              </span>
            </TaskCountText>
          </TaskCountWrapper>
        </>
      </ContributorRow>
      {clicked && (
        <TasksWrapper>
          {contributorTask?.tasks?.map((task) => {
            const reward = (task.rewards || [])[0];
            const podName = task?.podName || task?.pod?.name;
            const podColor = task?.podColor || task?.podColor;
            return (
              <TaskRow
                key={task?.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (task?.title !== PRIVATE_TASK_TITLE) {
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
                  {cutString(task.title === PRIVATE_TASK_TITLE ? 'Private Task' : task.title)}
                </TaskTitle>
                <div
                  style={{
                    flex: 1,
                  }}
                />
                <RewardContainer>
                  {/* <Reward>
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
                      {100}
                    </RewardAmount>
                  </Reward> */}
                  {podName && (
                    <PodWrapper
                      style={{
                        marginTop: '0',
                        marginRight: '8px',
                      }}
                    >
                      <PodIcon
                        color={podColor}
                        style={{
                          width: '26px',
                          height: '26px',
                          marginRight: '4px',
                        }}
                      />
                      <PodName>{podName}</PodName>
                    </PodWrapper>
                  )}
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
  const { orgData = {} } = props;
  const { id: orgId } = orgData;
  const [ref, inView] = useInView({});
  const [assignee, setAssignee] = useState(null);
  const [csvModal, setCSVModal] = useState(false);
  const [payoutModal, setPayoutModal] = useState(false);
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
  contributorTaskData = [...contributorTaskData, tmp];
  useEffect(() => {
    if (orgId && fromTime && toTime) {
      getCompletedTasksBetweenPeriods({
        variables: {
          orgId,
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
    <Wrapper orgData={orgData}>
      <PayoutModal
        open={payoutModal}
        handleClose={() => setPayoutModal(false)}
        orgId={orgId}
        fromTime={fromTime}
        toTime={toTime}
        contributorTaskData={contributorTaskData}
      />
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
          onOpen={() => {}}
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
        <div
          style={{
            flex: 1,
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
              isPod: false,
            })
          }
        >
          <ExportCSVButtonText>Export Tasks</ExportCSVButtonText>
        </ExportCSVButton>
        <ExportCSVButton
          style={{
            borderRadius: '8px',
            height: '40px',
            minHeight: '40px',
            marginLeft: '8px',
            border: '1px solid deepskyblue',
          }}
          buttonInnerStyle={{
            borderRadius: '7px',
          }}
          onClick={() => {
            setPayoutModal(true);
          }}
        >
          <ExportCSVButtonText>Pay out</ExportCSVButtonText>
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
