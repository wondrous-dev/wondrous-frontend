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
} from '../../utils/constants';
import { cutString, groupBy, parseUserPermissionContext, shrinkNumber } from '../../utils/helpers';
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
import { TaskViewModal } from '../Common/Task/modal';
import { delQuery } from '../../utils';
import { useRouter } from 'next/router';
import * as Constants from '../../utils/constants';
import { CreateModalOverlay } from '../CreateEntity/styles';
import EditLayoutBaseModal from '../CreateEntity/editEntityModal';
import { ArchiveTaskModal } from '../Common/ArchiveTaskModal';
import { useApolloClient, useLazyQuery, useMutation } from '@apollo/client';
import { UPDATE_TASK_STATUS } from '../../graphql/mutations';
import {
  GET_ORG_TASK_BOARD_TASKS,
  GET_TASK_BY_ID,
  GET_TASK_REVIEWERS,
  GET_TASK_SUBMISSIONS_FOR_TASK,
} from '../../graphql/queries';
import { SnackbarAlertContext } from '../Common/SnackbarAlert';
import { ArchivedTaskUndo } from '../Common/Task/styles';
import { OrgBoardContext } from '../../utils/contexts';
import { useColumns, useOrgBoard, usePodBoard, useUserBoard } from '../../utils/hooks';
import { LoadMore } from '../Common/KanbanBoard/styles';
import { SafeImage } from '../Common/Image';
import { useMe } from '../Auth/withAuth';
import { USDCoin } from '../Icons/USDCoin';
import Ethereum from '../Icons/ethereum';
import { Compensation } from '../Common/Compensation';
import { Matic } from '../Icons/matic';
import { renderMentionString } from '../../utils/common';
import TaskStatus from '../Icons/TaskStatus';

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
  const user = useMe();
  const board = orgBoard || podBoard || userBoard;
  const boardColumns = useColumns();
  const userPermissionsContext =
    orgBoard?.userPermissionsContext || podBoard?.userPermissionsContext || userBoard?.userPermissionsContext;
  let tasksCount = 0;

  useEffect(() => {
    if (inView && hasMore) {
      onLoadMore();
    }
  }, [inView, hasMore, onLoadMore]);

  return (
    <StyledTableContainer>
      <StyledTable>
        <StyledTableHead>
          <StyledTableRow>
            <StyledTableCell align="center" width="25%">
              DAO
            </StyledTableCell>
            <StyledTableCell align="center" width="25%">
              User
            </StyledTableCell>
            <StyledTableCell align="center" width="25%">
              Message
            </StyledTableCell>
            {isAdmin && (
              <StyledTableCell align="center" width="25%">
                Decision
              </StyledTableCell>
            )}
            <StyledTableCell width="54px"></StyledTableCell>
          </StyledTableRow>
        </StyledTableHead>
        <StyledTableBody>
          {userBoard?.joinOrgRequests?.map((request, index) => {
            return (
              <StyledTableRow key={request.id}>
                <StyledTableCell align="center">
                  {request.orgProfilePicture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <SafeImage
                      src={request?.orgProfilePicture}
                      style={{
                        width: '17px',
                        height: '17px',
                        borderRadius: '17px',
                      }}
                    />
                  ) : null}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Link passHref={true} href={`/profile/${request?.userUsername}/about`}>
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
                          }}
                          src={request?.userProfilePicture}
                        />
                      )}

                      <Initials>{request?.userUsername}</Initials>
                    </div>
                  </Link>
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
                    <DropDownButtonDecision userId={request?.userId} orgId={request?.orgId} />
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
