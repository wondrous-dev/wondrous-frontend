import { useState } from 'react';
import {
  TASK_STATUS_TODO,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_DONE,
  ENTITIES_TYPES,
} from 'utils/constants';

import { ToDo, InProgress, Done, InReview } from 'components/Icons';
import { CreateModalOverlay } from 'components/CreateEntity/styles';
import CreateBtnIconDark from 'components/Icons/createBtnIconDark';
import { Draggable } from 'react-beautiful-dnd';
import { LIMIT } from 'services/board';
import Accordion from 'components/Common/ListViewAccordion';
import CreateEntityModal from 'components/CreateEntity/CreateEntityModal/index';
import EmptyStateBoards from 'components/EmptyStateBoards';
import { BountyIcon } from 'components/Common/BountyBoard/styles';
import FlagIcon from 'components/Icons/flag';
import { IconWrapper } from './styles';
import Item from './Item';

const HEADER_ICONS = {
  [TASK_STATUS_TODO]: ToDo,
  [TASK_STATUS_IN_PROGRESS]: InProgress,
  [TASK_STATUS_IN_REVIEW]: InReview,
  [TASK_STATUS_DONE]: Done,
};

const LABELS_MAP = {
  [TASK_STATUS_TODO]: 'To-do',
  [TASK_STATUS_IN_PROGRESS]: 'In-Progress',
  [TASK_STATUS_IN_REVIEW]: 'In-Review',
  [TASK_STATUS_DONE]: 'Done',
};

const ENTITIES_LABELS_MAP = {
  [ENTITIES_TYPES.TASK]: 'Tasks',
  [ENTITIES_TYPES.MILESTONE]: 'Milestones',
  [ENTITIES_TYPES.BOUNTY]: 'Bounties',
};

const ENTITIES_HEADER_ICONS = {
  [ENTITIES_TYPES.MILESTONE]: () => (
    <FlagIcon
      stroke="url(#open0)"
      secondStroke="url(#open1)"
      style={{
        width: '21px',
        height: '21px',
      }}
    />
  ),
  [ENTITIES_TYPES.BOUNTY]: BountyIcon,
};
const DndWrapper = ({ disableDnd, task, children }) =>
  disableDnd ? (
    children
  ) : (
    <Draggable key={task.id} draggableId={task.id}>
      {(provided, snapshot) => (
        <div
          style={{
            width: '100%',
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          {children}
        </div>
      )}
    </Draggable>
  );

export default function ItemsContainer({
  data,
  taskCount = null,
  entityType = ENTITIES_TYPES.TASK,
  handleShowAll = null,
  hasMore,
  onLoadMore = null,
  disableDnd = false,
  enableInfiniteLoading = false,
  ...props
}) {
  const { status, tasks } = data;
  const [isCreateTaskModalOpen, setCreateTaskModalOpen] = useState(false);

  const itemTitle = LABELS_MAP[status] || ENTITIES_LABELS_MAP[entityType] || '';

  const Icon = HEADER_ICONS[status] || ENTITIES_HEADER_ICONS[entityType];

  // onLoadMore is used for infinite loading
  // handleShowAll is used to fetch entities per status on click
  const loadMoreAction = () => (onLoadMore ? onLoadMore() : handleShowAll(status, taskCount));

  const HeaderAddons =
    status === TASK_STATUS_TODO ? (
      <IconWrapper>
        <CreateBtnIconDark
          onClick={() => setCreateTaskModalOpen(true)}
          width="26"
          height="28"
          style={{
            marginLeft: '16px',
            cursor: 'pointer',
          }}
        />
      </IconWrapper>
    ) : null;
  return (
    <>
      <CreateModalOverlay
        style={{
          height: '95vh',
        }}
        open={isCreateTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
      >
        <CreateEntityModal
          entityType={entityType}
          handleClose={() => setCreateTaskModalOpen(false)}
          resetEntityType={() => {}}
          setEntityType={() => {}}
          cancel={() => setCreateTaskModalOpen(false)}
        />
      </CreateModalOverlay>
      <Accordion
        isExpanded={tasks?.length > 0}
        Icon={Icon}
        title={itemTitle}
        count={taskCount}
        headerAddons={HeaderAddons}
        hasMore={hasMore || (taskCount > LIMIT && tasks.length <= LIMIT)}
        onShowMore={loadMoreAction}
        showMoreTitle="Show all"
        key={tasks}
        enableInfiniteLoading={enableInfiniteLoading}
      >
        {tasks?.length ? (
          tasks.map((task, idx) => (
            <DndWrapper task={task} disableDnd={disableDnd} key={idx}>
              <Item entityType={entityType} task={task} />
            </DndWrapper>
          ))
        ) : (
          <EmptyStateBoards hidePlaceholder status={status} />
        )}
      </Accordion>
    </>
  );
}
