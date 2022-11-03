import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

import { useUserBoard } from 'utils/hooks';
import SmartLink from 'components/Common/SmartLink';
import { DropDownButtonDecision } from 'components/DropDownDecision/DropDownButton/MembershipRequest';
import { LoadMore } from 'components/Common/KanbanBoard/styles';
import { SafeImage } from 'components/Common/Image';

import {
  Initials,
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
  TaskDescription,
} from './styles';

export default function MembershipRequestTable(props) {
  const { onLoadMore, hasMore, isAdmin } = props;

  const [ref, inView] = useInView({});
  const userBoard = useUserBoard();

  useEffect(() => {
    if (inView && hasMore) {
      onLoadMore();
    }
  }, [inView, hasMore, onLoadMore]);
  let requests = [];
  if (userBoard?.joinOrgRequests) {
    requests = [...requests, ...userBoard.joinOrgRequests];
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
            <StyledTableCell width="54px" />
          </StyledTableRow>
        </StyledTableHead>
        <StyledTableBody>
          {requests?.map((request) => (
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
                      useNextImage={false}
                      src={request?.orgProfilePicture}
                      style={{
                        width: '17px',
                        height: '17px',
                        borderRadius: '17px',
                        marginRight: '4px',
                      }}
                    />
                    <Link
                      passHref
                      href={`/organization/${request?.orgUsername}/boards`}
                      target="_blank"
                      rel="noopener noreferrer"
                      legacyBehavior
                    >
                      <TaskDescription
                        style={{
                          textDecoration: 'underline',
                          cursor: 'pointer',
                        }}
                      >
                        {request?.orgUsername}
                      </TaskDescription>
                    </Link>
                  </div>
                )}
              </StyledTableCell>
              <StyledTableCell align="center">
                {request?.podName ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <Link
                    passHref
                    href={`/pod/${request?.podId}/boards`}
                    target="_blank"
                    rel="noopener noreferrer"
                    legacyBehavior
                  >
                    <TaskDescription
                      style={{
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                    >
                      {request?.podName}
                    </TaskDescription>
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
                        useNextImage={false}
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
              {/* <StyledTableCell> */}
              {/*  <DeliverableContainer> */}
              {/*    {Object.entries(groupBy(task?.media || [], 'type')).map(([key, value]: [string, any], index) => { */}
              {/*      return ( */}
              {/*        <DeliverableItem key={index}> */}
              {/*          <DeliverablesIconContainer>{DELIVERABLES_ICONS[key]}</DeliverablesIconContainer> */}
              {/*          {value?.length} */}
              {/*        </DeliverableItem> */}
              {/*      ); */}
              {/*    })} */}
              {/*  </DeliverableContainer> */}
              {/* </StyledTableCell> */}
              {isAdmin && (
                <StyledTableCell align="center">
                  {/* TODO: change the design for disabled button */}
                  <DropDownButtonDecision requestId={request?.id} orgId={request?.orgId} podId={request?.podId} />
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
          ))}
        </StyledTableBody>
      </StyledTable>

      <LoadMore ref={ref} hasMore={hasMore} />
    </StyledTableContainer>
  );
}
