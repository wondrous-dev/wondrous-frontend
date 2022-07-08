import { useQuery } from '@apollo/client';
import SmartLink from 'components/Common/SmartLink';
import { RichTextViewer } from 'components/RichText';
import { GET_TASKS_FOR_MILESTONE } from 'graphql/queries';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import * as Constants from 'utils/constants';
import { AwaitingPayment, Done, InProgress, InReview, ToDo } from '../../Icons';
import { ArchivedIcon } from '../../Icons/statusIcons';
import { SmallAvatar } from '../AvatarList';
import MilestoneTasksCreate from './MilestoneTasksCreate';
import {
  LoadMore,
  StyledTableBody,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTableRow,
  TableCellWrapper,
  TaskDescription,
  TaskTitle,
} from './styles';

const TASK_ICONS = {
  [Constants.TASK_STATUS_TODO]: ToDo,
  [Constants.TASK_STATUS_IN_PROGRESS]: InProgress,
  [Constants.TASK_STATUS_DONE]: Done,
  [Constants.TASK_STATUS_IN_REVIEW]: InReview,
  [Constants.TASK_STATUS_ARCHIVED]: ArchivedIcon,
  [Constants.TASK_STATUS_AWAITING_PAYMENT]: AwaitingPayment,
};

const getDataLength = (data) => data?.getTasksForMilestone?.length;

const useGetTasksForMilestone = ({ milestone }) => {
  const { id } = milestone;
  const limit = 5;
  const [ref, inView] = useInView({});
  const [hasMore, setHasMore] = useState(true);
  const { fetchMore, data } = useQuery(GET_TASKS_FOR_MILESTONE, {
    fetchPolicy: 'cache-and-network',
    variables: {
      milestoneId: id,
      limit,
      offset: 0,
    },
    onCompleted: (data) => setHasMore(getDataLength(data) >= limit),
    onError: (err) => console.error(err),
  });
  useEffect(() => {
    if (inView && hasMore) {
      fetchMore({
        variables: {
          offset: getDataLength(data),
        },
      }).then(({ data }) => setHasMore(getDataLength(data) >= limit));
    }
  }, [inView, fetchMore, hasMore, data]);
  return { data: data?.getTasksForMilestone, ref, hasMore };
};

const MilestoneTasks = ({ milestone, canCreate }) => {
  const { data, ref, hasMore } = useGetTasksForMilestone({ milestone });
  return (
    <>
      <MilestoneTasksCreate canCreate={canCreate} milestone={milestone} />
      {data?.length > 0 && (
        <StyledTableContainer>
          <StyledTableHead>
            <StyledTableRow>
              <StyledTableHeadCell>Assignee</StyledTableHeadCell>
              <StyledTableHeadCell>Status</StyledTableHeadCell>
              <StyledTableHeadCell>Task</StyledTableHeadCell>
            </StyledTableRow>
          </StyledTableHead>
          <StyledTableBody>
            {data?.map((task) => {
              const StatusIcon = TASK_ICONS[task.status];
              const viewUrl = `/organization/${task?.orgUsername || task?.org?.username}/boards?task=${task?.id}`;
              return (
                <SmartLink href={viewUrl} key={task.id}>
                  <StyledTableRow
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    <StyledTableCell>
                      <TableCellWrapper>
                        <SmallAvatar
                          id={task.assigneeId}
                          avatar={task.assignee?.profilePicture ?? {}}
                          initials={task.assignee?.username?.slice(0, 2)}
                        />
                      </TableCellWrapper>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <StatusIcon />
                    </StyledTableCell>
                    <StyledTableCell>
                      <TaskTitle>
                        <Link href={viewUrl}>{task.title}</Link>
                      </TaskTitle>
                      <TaskDescription>
                        <RichTextViewer text={task.description} />
                      </TaskDescription>
                    </StyledTableCell>
                  </StyledTableRow>
                </SmartLink>
              );
            })}
          </StyledTableBody>
          <LoadMore ref={ref} hasMore={hasMore} />
        </StyledTableContainer>
      )}
    </>
  );
};

export default MilestoneTasks;
