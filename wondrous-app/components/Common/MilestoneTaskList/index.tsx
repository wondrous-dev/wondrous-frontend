import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { GET_TASK_FOR_MILESTONE } from '../../../graphql/queries';
import * as Constants from '../../../utils/constants';
import { Done, InProgress, InReview, ToDo, AwaitingPayment } from '../../Icons';
import { ArchivedIcon } from '../../Icons/statusIcons';
import { SmallAvatar } from '../AvatarList';
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
  StyledMilestoneEmpty,
} from './styles';

export const TASK_ICONS = {
  [Constants.TASK_STATUS_TODO]: ToDo,
  [Constants.TASK_STATUS_IN_PROGRESS]: InProgress,
  [Constants.TASK_STATUS_DONE]: Done,
  [Constants.TASK_STATUS_IN_REVIEW]: InReview,
  [Constants.TASK_STATUS_ARCHIVED]: ArchivedIcon,
  [Constants.TASK_STATUS_AWAITING_PAYMENT]: AwaitingPayment,
};

export const MilestoneTaskList = (props) => {
  const { milestoneId, open } = props;
  const [ref, inView] = useInView({});
  const [hasMore, setHasMore] = useState(false);
  const limit = 10;
  const [getTasksForMilestone, { fetchMore, data }] = useLazyQuery(GET_TASK_FOR_MILESTONE);

  useEffect(() => {
    if (!data?.getTasksForMilestone && open) {
      getTasksForMilestone({
        variables: {
          milestoneId: milestoneId,
          limit: limit,
          offset: 0,
        },
      })
        .then(() => {
          setHasMore(data?.getTasksForMilestone.length >= limit);
        })
        .catch((err) => {
          console.error(err);
        });
    }
    if (inView && hasMore) {
      fetchMore({
        variables: {
          offset: data?.getTasksForMilestone.length,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          setHasMore(fetchMoreResult?.getTasksForMilestone.length >= limit);
          if (!fetchMoreResult) return prev;
          return Object.assign({}, prev, fetchMoreResult, {
            getTasksForMilestone: [...prev.getTasksForMilestone, ...fetchMoreResult.getTasksForMilestone],
          });
        },
      });
    }
  }, [getTasksForMilestone, milestoneId, setHasMore, inView, hasMore, fetchMore, data, open]);

  return (
    <>
      {data?.getTasksForMilestone.length === 0 && open && <StyledMilestoneEmpty>No task yet.</StyledMilestoneEmpty>}
      {data?.getTasksForMilestone.length > 0 && open && (
        <StyledTableContainer>
          <StyledTableHead>
            <StyledTableRow>
              <StyledTableHeadCell>Assignee</StyledTableHeadCell>
              <StyledTableHeadCell>Status</StyledTableHeadCell>
              <StyledTableHeadCell>Task</StyledTableHeadCell>
            </StyledTableRow>
          </StyledTableHead>
          <StyledTableBody>
            {data?.getTasksForMilestone.map((task) => {
              const StatusIcon = TASK_ICONS[task.status];
              return (
                <Link
                  key={task?.id}
                  href={`/organization/${task?.orgUsername}/boards?task=${task?.id}`}
                  passHref={true}
                >
                  <StyledTableRow
                    key={task.id}
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
                      <TaskTitle>{task.title}</TaskTitle>
                      <TaskDescription>{task.description}</TaskDescription>
                    </StyledTableCell>
                  </StyledTableRow>
                </Link>
              );
            })}
          </StyledTableBody>
          <LoadMore ref={ref} hasMore={hasMore}></LoadMore>
        </StyledTableContainer>
      )}
    </>
  );
};
