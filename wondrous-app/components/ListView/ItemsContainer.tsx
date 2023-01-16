import { useState } from 'react';
import { ENTITIES_TYPES, TASK_STATUS_TODO, HEADER_ICONS, TITLES, ENTITIES_DISPLAY_LABEL_MAP } from 'utils/constants';

import { BountyIcon } from 'components/Common/BountyBoard/styles';
import Accordion from 'components/Common/ListViewAccordion';
import CreateEntityModal from 'components/CreateEntity/CreateEntityModal/index';
import { CreateModalOverlay } from 'components/CreateEntity/styles';
import EmptyStateBoards from 'components/EmptyStateBoards';
import CreateBtnIconDark from 'components/Icons/createBtnIconDark';
import FlagIcon from 'components/Icons/flag';
import { Draggable } from 'react-beautiful-dnd';
import { LIMIT } from 'services/board';

import { useRouter } from 'next/router';
import Item from './Item';
import { IconWrapper, ListViewItemWrapper } from './styles';

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

const DndWrapper = ({ disableDnd, id, index, children }) =>
  disableDnd ? (
    children
  ) : (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <ListViewItemWrapper
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          {children}
        </ListViewItemWrapper>
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
  dndPlaceholder = null,
  highlighted,
  ...props
}) {
  const { status, tasks } = data;
  const router = useRouter();
  const [isCreateTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const itemTitle = TITLES[status] || ENTITIES_DISPLAY_LABEL_MAP[entityType] || '';
  const Icon = HEADER_ICONS[status] || ENTITIES_HEADER_ICONS[entityType];

  // onLoadMore is used for infinite loading
  // handleShowAll is used to fetch entities per status on click
  const loadMoreAction = () => (onLoadMore ? onLoadMore() : handleShowAll(status, taskCount));

  const HeaderAddons =
    status === TASK_STATUS_TODO && !router?.query?.search ? (
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
        count={taskCount || tasks?.length}
        headerAddons={HeaderAddons}
        hasMore={hasMore || (taskCount > LIMIT && tasks.length <= LIMIT)}
        onShowMore={loadMoreAction}
        showMoreTitle="Show all"
        enableInfiniteLoading={enableInfiniteLoading}
        noGap
        highlighted={highlighted}
      >
        {tasks?.length ? (
          tasks.map((task, index) => (
            <DndWrapper key={task.id} id={task.id} index={index} disableDnd={disableDnd}>
              <Item entityType={entityType} task={task} isDragDisabled={disableDnd} />
            </DndWrapper>
          ))
        ) : (
          <EmptyStateBoards hidePlaceholder status={status} />
        )}
        {dndPlaceholder}
      </Accordion>
    </>
  );
}
