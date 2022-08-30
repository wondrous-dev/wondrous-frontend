/* eslint-disable react/jsx-key */

import CloseModalIcon from 'components/Icons/closeModal';
import { CalendarViewTaskContainer, CalendarViewTaskIcon, CalendarViewTaskLabel } from 'components/CalendarView/styles';
import {
  StyledBox,
  StyledCloseButton,
  StyledDialog,
  StyledDialogTopBar,
  StyledHeader,
} from 'components/Common/ArchiveTaskModal/styles';

const monthsOfYear = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const CalendarViewModal = ({ open, onClose, day, handleSelectTask }) => (
  <StyledDialog
    open={open}
    onClose={onClose}
    aria-labelledby="archive-task-modal"
    aria-describedby="modal-modal-description"
  >
    <StyledBox>
      <StyledDialogTopBar>
        <StyledHeader
          style={{
            marginLeft: 0,
          }}
        >
          {`${monthsOfYear[day?.day.getMonth()]} ${day?.day.getDate()}`}
        </StyledHeader>
        <StyledCloseButton onClick={onClose}>
          <CloseModalIcon />
        </StyledCloseButton>
      </StyledDialogTopBar>
      {day?.tasks?.length !== 0 ? (
        day?.tasks?.map((task, index) => (
          <CalendarViewTaskContainer
            style={{ marginLeft: '0px', marginBottom: '6px' }}
            onClick={() => {
              handleSelectTask(task?.id);
            }}
          >
            <CalendarViewTaskIcon status={task?.status} />
            <CalendarViewTaskLabel style={{ fontSize: '14px' }}>{task.title}</CalendarViewTaskLabel>
          </CalendarViewTaskContainer>
        ))
      ) : (
        <CalendarViewTaskLabel>No Tasks Are Due Today</CalendarViewTaskLabel>
      )}
    </StyledBox>
  </StyledDialog>
);

export default CalendarViewModal;
