import { useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { format } from 'date-fns';
import { GET_AUTOCOMPLETE_USERS, GET_COMPLETED_TASKS_BETWEEN_TIME_PERIOD } from 'graphql/queries';
import { Post } from '../../Common/Post';
import Wrapper from '../wrapper/wrapper';
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
} from './styles';
import { SafeImage } from 'components/Common/Image';
import { DefaultProfilePicture, UserProfilePicture } from 'components/profile/modals/styles';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import BottomArrowCaret from 'components/Icons/BottomArrowCaret';
import RightArrowCaret from 'components/Icons/RightArrowCaret';
import { TaskViewModal } from 'components/Common/Task/modal';
import { Reward, RewardAmount, RewardContainer, TaskTitle } from 'components/Table/styles';
import { PodName, PodWrapper } from 'components/Common/Task/styles';
import PodIcon from 'components/Icons/podIcon';
import { cutString, shrinkNumber } from 'utils/helpers';
import TaskStatus from 'components/Icons/TaskStatus';
import { TextField } from '@material-ui/core';
import { OptionDiv, OptionTypography, StyledAutocompletePopper, StyledChip } from 'components/CreateEntity/styles';
import { White } from 'theme/colors';
import { filterOrgUsers } from 'components/CreateEntity/createEntityModal';

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
            const podName = task?.podName || task?.pod?.name;
            const podColor = task?.podColor || task?.podColor;
            return (
              <TaskRow
                key={task?.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenModal(true);
                  setTaskOpened(task?.id);
                }}
              >
                {podName && (
                  <PodWrapper
                    style={{
                      marginTop: '0',
                      marginRight: '16px',
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
                <TaskTitle
                  style={{
                    marginRight: '24px',
                  }}
                >
                  {cutString(task.title)}
                </TaskTitle>
                <div
                  style={{
                    flex: 1,
                  }}
                />
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
                <RewardContainer>
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
                      {100}
                    </RewardAmount>
                  </Reward>
                  {/* {reward && (
                    <Reward>
                      <SafeImage
                        src={'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=018'}
                        style={{
                          width: '16px',
                          height: '16px',
                        }}
                      />
                      <RewardAmount>{shrinkNumber(reward?.rewardAmount)}</RewardAmount>
                    </Reward>
                  )} */}
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
  const [assigneeString, setAssigneeString] = useState('');
  const [getAutocompleteUsers, { data: autocompleteData }] = useLazyQuery(GET_AUTOCOMPLETE_USERS);
  const today = new Date();
  const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
  const [toTime, setToTime] = useState(today);
  const [fromTime, setFromTime] = useState(lastWeek);
  const [getCompletedTasksBetweenPeriods, { data, loading }] = useLazyQuery(GET_COMPLETED_TASKS_BETWEEN_TIME_PERIOD);
  const contributorTaskData = data?.getCompletedTasksBetweenPeriods;
  useEffect(() => {
    if (orgId && fromTime && toTime) {
      getCompletedTasksBetweenPeriods({
        variables: {
          orgId,
          toTime: format(toTime, 'yyyy-MM-dd'),
          fromTime: format(fromTime, 'yyyy-MM-dd'),
        },
      });
    }
  }, [orgId, fromTime, toTime]);

  return (
    <Wrapper orgData={orgData}>
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
          options={filterUsers(autocompleteData?.getAutocompleteUsers)}
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
                  color: White,
                  fontFamily: 'Space Grotesk',
                  fontSize: '1px',
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
