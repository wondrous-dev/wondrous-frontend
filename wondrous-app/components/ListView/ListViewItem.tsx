import { useState } from 'react';
import { Chevron } from 'components/Icons/sections';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListViewItemHeader,
  ListViewItemCount,
  ListViewItemStatus,
  IconWrapper,
  ListViewItemBodyWrapper,
  ListViewItemDataContainer,
} from './styles';
import {
  TASK_STATUS_TODO,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_DONE,
  ENTITIES_TYPES,
} from 'utils/constants';
import { ToDo, InProgress, Done, InReview } from 'components/Icons';
import { CreateModalOverlay } from 'components/CreateEntity/styles';
import CreateLayoutBaseModal from 'components/CreateEntity/createEntityModal';
import CreateBtnIconDark from 'components/Icons/createBtnIconDark';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';

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

export default function ListViewItem({ data, taskCount, fetchPerStatus, ...props }) {
  const { status, tasks } = data;
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCreateTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  //TODO we can get rid of this state in the future, probably needs a BE improvement

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
      >
        <CreateLayoutBaseModal
          entityType={ENTITIES_TYPES.TASK}
          handleClose={() => setCreateTaskModalOpen(false)}
          resetEntityType={() => {}}
          setEntityType={() => {}}
          open={isCreateTaskModalOpen}
        />
      </CreateModalOverlay>

      <Accordion expanded={isExpanded}>
        <ListViewItemHeader>
          <ListViewItemStatus onClick={() => handleExpansion()}>
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
          {tasks.map(({ assigneeProfilePicture, title, totalSubmissionsCount, commentCount, id }, idx) => (
            <ListViewItemBodyWrapper key={idx}>
              <ListViewItemDataContainer>
                {assigneeProfilePicture ? (
                  <SafeImage
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '13px',
                      marginRight: '4px',
                    }}
                    src={assigneeProfilePicture}
                  />
                ) : (
                  <DefaultUserImage
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '13px',
                      marginRight: '4px',
                    }}
                  />
                )}

                {title}
                {totalSubmissionsCount}
                {commentCount}
              </ListViewItemDataContainer>
              <div>claim btn actions dropdown</div>
            </ListViewItemBodyWrapper>
          ))}
        </AccordionDetails>
      </Accordion>
    </>
  );
}
