/* eslint-disable react/jsx-key */
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { CHAR_LIMIT_PROFILE_BIO } from 'utils/constants';
import { useOrgBoard } from 'utils/hooks';
import CloseModalIcon from 'components/Icons/closeModal';
import { ArchivedIcon } from '../../Icons/statusIcons';
import {
  StyledArchivedLabel,
  StyledArchiveTaskButton,
  StyledBody,
  StyledBox,
  StyledButtonsContainer,
  StyledCancelButton,
  StyledCloseButton,
  StyledDialog,
  StyledDialogTopBar,
  StyledDivider,
  StyledHeader,
  StyledWarningMessage,
} from '../../Common/ArchiveTaskModal/styles';
import { GeneralSettingsDAODescriptionInput } from '../../Settings/styles';
import { ErrorText } from 'components/Common';
import { CalendarViewTaskContainer, CalendarViewTaskIcon, CalendarViewTaskLabel } from 'components/CalendarView/styles';

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

export const CalendarViewModal = (props) => {
  const { open, onClose, day, handleSelectTask } = props;
  return (
    <>
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
    </>
  );
};
