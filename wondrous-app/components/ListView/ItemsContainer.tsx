import { useState } from 'react';
import {
  TASK_STATUS_TODO,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_DONE,
  ENTITIES_TYPES,
} from 'utils/constants';
import { ChevronFilled } from 'components/Icons/sections';

import { ToDo, InProgress, Done, InReview } from 'components/Icons';
import { CreateModalOverlay } from 'components/CreateEntity/styles';
import CreateBtnIconDark from 'components/Icons/createBtnIconDark';
import { Draggable } from 'react-beautiful-dnd';
import { LIMIT } from 'services/board';
import CreateEntityModal from 'components/CreateEntity/CreateEntityModal/index';
import EmptyStateBoards from 'components/EmptyStateBoards';
import {
  ShowMoreButton,
  Accordion,
  AccordionDetails,
  ListViewItemHeader,
  ListViewItemCount,
  ListViewItemStatus,
  IconWrapper,
  DraggableItem,
} from './styles';
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
  const [isExpanded, setIsExpanded] = useState(tasks?.length > 0);
  const [isCreateTaskModalOpen, setCreateTaskModalOpen] = useState(false);

  const handleExpansion = () => setIsExpanded(!isExpanded);

  const itemTitle = LABELS_MAP[status] || '';

  const Icon = HEADER_ICONS[status];
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

      <Accordion expanded={isExpanded}>
        <ListViewItemHeader>
          <ListViewItemStatus isExpanded={isExpanded} onClick={() => handleExpansion()}>
            <ChevronFilled fill="white" className="accordion-expansion-icon" />
            <Icon />
            {itemTitle}
            <ListViewItemCount>{taskCount}</ListViewItemCount>
          </ListViewItemStatus>
          {status === TASK_STATUS_TODO && (
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
          )}
        </ListViewItemHeader>
        <AccordionDetails>
          {tasks?.length ? (
            tasks.map((task, idx) => (
              <Draggable key={task.id} draggableId={task.id} index={idx}>
                {(provided, snapshot) => (
                  <DraggableItem
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    isDragging={snapshot.isDragging}
                  >
                    <Item entityType={entityType} task={task} />
                  </DraggableItem>
                )}
              </Draggable>
            ))
          ) : (
            <EmptyStateBoards hidePlaceholder status={status} />
          )}
        </AccordionDetails>
        {taskCount > LIMIT && tasks.length <= LIMIT && (
          <ShowMoreButton type="button" onClick={() => handleShowAll(status, taskCount)}>
            Show all
          </ShowMoreButton>
        )}
      </Accordion>
    </>
  );
}
