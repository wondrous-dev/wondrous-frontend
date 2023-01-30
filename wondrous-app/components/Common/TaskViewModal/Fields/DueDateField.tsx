import { Grid, Tooltip } from '@mui/material';
import { CreateEntityDueDate } from 'components/CreateEntity/CreateEntityModal/styles';
import EditIcon from 'components/Icons/editIcon';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import palette from 'theme/palette';
import RecurringIcon from '../../../../public/images/icons/recurring.svg';
import { TaskSectionLabel } from '../helpers';
import {
  InfoPoint,
  TaskSectionDisplayDiv,
  TaskSectionInfoCalendar,
  TaskSectionInfoText,
  ViewFieldWrapper,
} from '../styles';
import { TaskFieldEditableContent } from './Shared';
import { IconWrapper } from './styles';

const DueDateFieldContent = ({ recurringSchema, dueDate, canEdit, toggleEditMode }) => (
  <ViewFieldWrapper canEdit={canEdit} onClick={toggleEditMode}>
    <Grid display="flex" gap="6px" alignItems="center" justifyContent="center">
      <IconWrapper>
        <TaskSectionInfoCalendar />
      </IconWrapper>
      <TaskSectionInfoText>
        {!isEmpty(recurringSchema) && (
          <Tooltip title="Recurring" placement="right">
            <RecurringIcon />
          </Tooltip>
        )}
        {format(new Date(dueDate), 'MM/dd/yyyy')}
      </TaskSectionInfoText>
    </Grid>
    <EditIcon stroke={palette.grey58} className="edit-icon-field" />
  </ViewFieldWrapper>
);

const EditableFieldContent = ({ recurringSchema, dueDate, toggleMode }) => {
  const initialRecurrenceValue =
    recurringSchema?.daily || recurringSchema?.weekly || recurringSchema?.monthly || recurringSchema?.periodic;

  const initialRecurrenceType =
    recurringSchema && Object.keys(recurringSchema)[Object?.values(recurringSchema).indexOf(initialRecurrenceValue)];

  const [recurrenceValue, setRecurrenceValue] = useState(initialRecurrenceValue);
  const [recurrenceType, setRecurrenceType] = useState(initialRecurrenceType);

  // TODO: IMPLEMENT API

  return (
    <CreateEntityDueDate
      autoFocus
      setValue={(date) => console.log(date)}
      setRecurrenceType={setRecurrenceType}
      setRecurrenceValue={setRecurrenceValue}
      hideRecurring={false}
      handleClose={() => {
        toggleMode();
        setRecurrenceType(null);
        setRecurrenceValue(null);
      }}
      value={dueDate}
      recurrenceType={recurrenceType}
      recurrenceValue={recurrenceValue}
    />
  );
};

const DueDateField = ({ dueDate, recurringSchema, shouldUnclaimOnDueDateExpiry, canEdit = true }) => (
  <>
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Due Date</TaskSectionLabel>
      <TaskFieldEditableContent
        ViewContent={({ toggleEditMode }) => (
          <DueDateFieldContent
            toggleEditMode={toggleEditMode}
            recurringSchema={recurringSchema}
            dueDate={dueDate}
            canEdit={canEdit}
          />
        )}
        AddContent={({ toggleAddMode }) => (
          <EditableFieldContent toggleMode={toggleAddMode} recurringSchema={null} dueDate={null} />
        )}
        canAddItem={!dueDate && canEdit}
        EditableContent={({ toggleEditMode }) => (
          <EditableFieldContent toggleMode={toggleEditMode} recurringSchema={recurringSchema} dueDate={dueDate} />
        )}
      />
    </TaskSectionDisplayDiv>
    {shouldUnclaimOnDueDateExpiry && <InfoPoint>Assignee will be removed once the task is past due date</InfoPoint>}
  </>
);

export default DueDateField;
