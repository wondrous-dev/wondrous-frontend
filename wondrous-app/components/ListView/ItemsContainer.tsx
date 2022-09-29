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

export default function ItemsContainer({ data, taskCount, fetchPerStatus, entityType, handleShowAll, ...props }) {
  const { status, tasks } = data;
  const [isCreateTaskModalOpen, setCreateTaskModalOpen] = useState(false);

  const itemTitle = LABELS_MAP[status] || '';

  const Icon = HEADER_ICONS[status];

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
          entityType={ENTITIES_TYPES.TASK}
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
        hasMore={taskCount > LIMIT && tasks.length <= LIMIT}
        onShowMore={() => handleShowAll(status, taskCount)}
        showMoreTitle="Show all"
        key={tasks}
      >
        {tasks?.length ? (
          tasks.map((task, idx) => (
            <Draggable key={task.id} draggableId={task.id} index={idx}>
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
                  <Item entityType={entityType} task={task} />
                </div>
              )}
            </Draggable>
          ))
        ) : (
          <EmptyStateBoards hidePlaceholder status={status} />
        )}
      </Accordion>
    </>
  );
}
