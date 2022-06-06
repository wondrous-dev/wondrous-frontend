import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import ItemsContainer from './ItemsContainer';
import { TASK_STATUS_TODO, TASK_STATUS_IN_PROGRESS, TASK_STATUS_IN_REVIEW, TASK_STATUS_DONE } from 'utils/constants';
import { LIMIT } from 'services/board';

interface Props {
  columns: any[];
  onLoadMore: any;
  hasMore: boolean;
}

const STATUS_MAP = {
  [TASK_STATUS_TODO]: 'created',
  [TASK_STATUS_IN_PROGRESS]: 'inProgress',
  [TASK_STATUS_IN_REVIEW]: 'inReview',
  [TASK_STATUS_DONE]: 'completed',
};

export default function ListView({ columns, onLoadMore, hasMore, ...props }: Props) {
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();

  const { taskCount, fetchPerStatus, entityType } = orgBoard || podBoard || userBoard;

  const handleShowAll = (status, limit) => fetchPerStatus(status, limit);

  return (
    <>
      {columns.map((column) => {
        if (!column) return null;
        const count = taskCount[STATUS_MAP[column?.status]] || 0;
        return (
          <>
            <ItemsContainer entityType={entityType} data={column} taskCount={count} fetchPerStatus={fetchPerStatus} />
            {count > LIMIT && column?.tasks.length <= LIMIT && (
              <button onClick={() => handleShowAll(column?.status, count)}>show all</button>
            )}
          </>
        );
      })}
    </>
  );
}
