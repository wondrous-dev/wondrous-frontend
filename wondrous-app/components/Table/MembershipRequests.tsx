import React, { useContext, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

import {
  COLUMN_TITLE_ARCHIVED,
  ENTITIES_TYPES,
  PERMISSIONS,
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_AWAITING_PAYMENT,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_REQUESTED,
  TASK_STATUS_TODO,
} from 'utils/constants';
import { cutString, groupBy, parseUserPermissionContext, shrinkNumber } from 'utils/helpers';
import { AvatarList } from '../Common/AvatarList';
import { DropDown, DropDownItem } from '../Common/dropdown';
import { DropDownButtonDecision } from '../DropDownDecision/DropDownButton/MembershipRequest';
import { DoneWithBorder, InProgressWithBorder, TodoWithBorder, WonderCoin } from '../Icons';
import ImageIcon from '../Icons/image';
import AudioIcon from '../Icons/MediaTypesIcons/audio';
import PlayIcon from '../Icons/play';
import { RewardRed } from '../Icons/reward';
import { TaskMenuIcon } from '../Icons/taskMenu';
import {
  Box,
  DeliverableContainer,
  DeliverableItem,
  DeliverablesIconContainer,
  Initials,
  MoreOptions,
  Reward,
  RewardAmount,
  RewardContainer,
  StyledLinkIcon,
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
  TaskDescription,
  TaskTitle,
} from './styles';
import TaskViewModal from 'components/Common/TaskViewModal';
import { delQuery } from 'utils';
import { useRouter } from 'next/router';
import * as Constants from 'utils/constants';
import { SnackbarAlertContext } from '../Common/SnackbarAlert';
import { ArchivedTaskUndo } from '../Common/Task/styles';
import { OrgBoardContext } from 'utils/contexts';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { LoadMore } from '../Common/KanbanBoard/styles';
import { SafeImage } from '../Common/Image';
import { useMe } from '../Auth/withAuth';
import SmartLink from 'components/Common/SmartLink';

const DELIVERABLES_ICONS = {
  audio: <AudioIcon />,
  image: <ImageIcon />,
  link: <StyledLinkIcon />,
  video: <PlayIcon />,
};

const STATUS_BY_TYPENAME = {
  TaskSubmissionCard: TASK_STATUS_IN_REVIEW,
  TaskProposalCard: TASK_STATUS_REQUESTED,
};

let windowOffset = 0;
export const MembershipRequestTable = (props) => {
  const { onLoadMore, hasMore, allTasks, limit, isAdmin } = props;
  const router = useRouter();

  const [ref, inView] = useInView({});
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const orgBoardContext = useContext(OrgBoardContext);
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();

  useEffect(() => {
    if (inView && hasMore) {
      onLoadMore();
    }
  }, [inView, hasMore, onLoadMore]);
  let requests = [];
  if (userBoard?.joinOrgRequests) {
    requests = [...requests, ...userBoard?.joinOrgRequests];
  }
  if (userBoard?.joinPodRequests) {
    requests = [...requests, ...userBoard.joinPodRequests];
  }
  requests = requests.sort((a, b) => b.createdAt - a.createdAt);
  return (
    <StyledTableContainer>
      <StyledTable>
        <StyledTableHead>
          <StyledTableRow>
            <StyledTableCell align="center" width="20%">
              DAO
            </StyledTableCell>
            <StyledTableCell align="center" width="20%">
              Pod
            </StyledTableCell>
            <StyledTableCell align="center" width="20%">
              User
            </StyledTableCell>
            <StyledTableCell align="center" width="20%">
              Message
            </StyledTableCell>
            {isAdmin && (
              <StyledTableCell align="center" width="20%">
                Decision
              </StyledTableCell>
            )}
            <StyledTableCell width="54px"></StyledTableCell>
          </StyledTableRow>
        </StyledTableHead>
        <StyledTableBody>
          {requests?.map((request, index) => {
            return (
              <StyledTableRow key={request.id}>
                <StyledTableCell align="center">
                  {(request.orgProfilePicture || request.orgUsername) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <div
                      style={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <SafeImage
                        src={request?.orgProfilePicture}
                        style={{
                          width: '17px',
                          height: '17px',
                          borderRadius: '17px',
                          marginRight: '4px',
                        }}
                      />
                      <Link passHref={true} href={`/organization/${request?.orgUsername}/boards`}>
                        <a target="_blank" rel="noopener noreferrer">
                          <TaskDescription
                            style={{
                              textDecoration: 'underline',
                              cursor: 'pointer',
                            }}
                          >
                            {request?.orgUsername}
                          </TaskDescription>
                        </a>
                      </Link>
                    </div>
                  )}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {request?.podName ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <Link passHref={true} href={`/pod/${request?.podId}/boards`}>
                      <a target="_blank" rel="noopener noreferrer">
                        <TaskDescription
                          style={{
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                        >
                          {request?.podName}
                        </TaskDescription>
                      </a>
                    </Link>
                  ) : null}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <SmartLink href={`/profile/${request?.userUsername}/about`} asLink>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {request?.userProfilePicture && (
                        <SafeImage
                          style={{
                            width: '17px',
                            height: '17px',
                            borderRadius: '17px',
                            marginRight: '8px',
                          }}
                          src={request?.userProfilePicture}
                        />
                      )}

                      <Initials>{request?.userUsername}</Initials>
                    </div>
                  </SmartLink>
                </StyledTableCell>
                <StyledTableCell className="clickable">
                  <TaskDescription
                    style={{
                      maxWidth: '600px',
                    }}
                  >
                    {request?.message}
                  </TaskDescription>
                </StyledTableCell>
                {/*<StyledTableCell>*/}
                {/*  <DeliverableContainer>*/}
                {/*    {Object.entries(groupBy(task?.media || [], 'type')).map(([key, value]: [string, any], index) => {*/}
                {/*      return (*/}
                {/*        <DeliverableItem key={index}>*/}
                {/*          <DeliverablesIconContainer>{DELIVERABLES_ICONS[key]}</DeliverablesIconContainer>*/}
                {/*          {value?.length}*/}
                {/*        </DeliverableItem>*/}
                {/*      );*/}
                {/*    })}*/}
                {/*  </DeliverableContainer>*/}
                {/*</StyledTableCell>*/}
                {isAdmin && (
                  <StyledTableCell align="center">
                    {/* TODO: change the design for disabled button */}
                    <DropDownButtonDecision userId={request?.userId} orgId={request?.orgId} podId={request?.podId} />
                  </StyledTableCell>
                )}
                {/* <StyledTableCell align="center">
                    <MoreOptions disabled={!canManageTask}>
                      <DropDown DropdownHandler={TaskMenuIcon} fill="#1F1F1F">
                        <DropDownItem
                          key={'task-menu-edit-' + task.id}
                          onClick={() => editTask(task, status)}
                          color="#C4C4C4"
                          fontSize="13px"
                          fontWeight="normal"
                          textAlign="left"
                        >
                          Edit {dropdownItemLabel}
                        </DropDownItem>
                        <DropDownItem
                          key={'task-menu-report-' + task.id}
                          onClick={() => {
                            setSelectedTask(task);
                            setArchiveModalOpen(true);
                            setSelectedTaskType(dropdownItemLabel);
                          }}
                          color="#C4C4C4"
                          fontSize="13px"
                          fontWeight="normal"
                          textAlign="left"
                        >
                          Archive {dropdownItemLabel}
                        </DropDownItem>
                      </DropDown>
                    </MoreOptions>
                  </StyledTableCell> */}
              </StyledTableRow>
            );
          })}
        </StyledTableBody>
      </StyledTable>

      <LoadMore ref={ref} hasMore={hasMore} />
    </StyledTableContainer>
  );
};
