import { Grid, Tooltip } from '@mui/material';
import { CreateEntityDueDate, CreateEntityError } from 'components/CreateEntity/CreateEntityModal/styles';
import EditIcon from 'components/Icons/editIcon';
import { isEmpty } from 'lodash';
import { forwardRef, useEffect, useRef, useState } from 'react';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
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
import { FIELDS } from './hooks/constants';
import { useSubmit } from './hooks/useSubmit';
import { TaskFieldEditableContent } from './Shared';
import { IconWrapper } from './styles';

const DueDateFieldContent = ({ recurringSchema, dueDate, canEdit, toggleEditMode }) => (
  <ViewFieldWrapper $canEdit={canEdit} onClick={toggleEditMode}>
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
        {format(parseISO(dueDate.substring(0, 10)), 'MM/dd/yyyy')}{' '}
      </TaskSectionInfoText>
    </Grid>
    <EditIcon stroke={palette.grey58} className="edit-icon-field" />
  </ViewFieldWrapper>
);

const EditableFieldContent = ({
  dueDate,
  toggleMode,
  toggleOutsideAlerter,
  recurrenceValue,
  recurrenceType,
  setRecurrenceValue,
  setRecurrenceType,
  setValue,
  error,
}) => {
  useEffect(() => {
    if (toggleOutsideAlerter) toggleOutsideAlerter();
    return () => toggleOutsideAlerter && toggleOutsideAlerter();
  }, []);

  return (
    <>
      <CreateEntityDueDate
        autoFocus
        setValue={(value) => {
          setValue(value);
        }}
        value={dueDate}
        setRecurrenceType={setRecurrenceType}
        setRecurrenceValue={(newRecurrenceValue) => {
          setRecurrenceValue(newRecurrenceValue);
        }}
        hideRecurring={false}
        onClickAway={toggleMode}
        handleClose={() => {
          setValue(null);
          setRecurrenceValue(null);
          setRecurrenceType(null);
        }}
        recurrenceType={recurrenceType}
        recurrenceValue={recurrenceValue}
      />
      {error ? <CreateEntityError>{error}</CreateEntityError> : null}
    </>
  );
};

interface Input {
  timezone: string;
  dueDate?: string | null;
  recurringSchema?: {
    daily?: number;
    weekly?: number;
    monthly?: number;
    periodic?: number;
  };
}
const DueDateField = ({ dueDate, recurringSchema, shouldUnclaimOnDueDateExpiry, canEdit, shouldDisplay }) => {
  const initialRecurrenceValue =
    recurringSchema?.daily || recurringSchema?.weekly || recurringSchema?.monthly || recurringSchema?.periodic;

  const initialRecurrenceType =
    recurringSchema && Object.keys(recurringSchema)[Object?.values(recurringSchema).indexOf(initialRecurrenceValue)];

  const [recurrenceValue, setRecurrenceValue] = useState(initialRecurrenceValue);
  const [recurrenceType, setRecurrenceType] = useState(initialRecurrenceType);
  const [value, setValue] = useState(dueDate);
  const { submit, error } = useSubmit({ field: FIELDS.DUE_DATE });

  const handleSubmit = async () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    let input: Input = {
      timezone,
      [FIELDS.DUE_DATE]: value ? format(value, `yyyy-MM-dd'T'00:00:01.000'Z'`) : null,
    };

    if (recurrenceType && recurrenceValue && value) {
      input = {
        ...input,
        recurringSchema: {
          [recurrenceType]: recurrenceValue,
        },
      };
    }
    await submit(null, { ...input });
  };

  if (!shouldDisplay) return null;
  return (
    <>
      <TaskSectionDisplayDiv>
        <TaskSectionLabel>Due Date</TaskSectionLabel>
        <TaskFieldEditableContent
          onClose={handleSubmit}
          ViewContent={({ toggleEditMode }) => (
            <DueDateFieldContent
              toggleEditMode={toggleEditMode}
              recurringSchema={recurringSchema}
              dueDate={dueDate}
              canEdit={canEdit}
            />
          )}
          addContent={({ toggleAddMode, toggleOutsideAlerter }) => (
            <EditableFieldContent
              toggleOutsideAlerter={toggleOutsideAlerter}
              toggleMode={toggleAddMode}
              error={error}
              recurrenceValue={recurrenceValue}
              recurrenceType={recurrenceType}
              setRecurrenceValue={setRecurrenceValue}
              setRecurrenceType={setRecurrenceType}
              dueDate={value}
              setValue={setValue}
            />
          )}
          canAddItem={canEdit && !dueDate}
          editableContent={({ toggleEditMode, toggleOutsideAlerter }) => (
            <EditableFieldContent
              toggleOutsideAlerter={toggleOutsideAlerter}
              toggleMode={toggleEditMode}
              error={error}
              recurrenceValue={recurrenceValue}
              recurrenceType={recurrenceType}
              setRecurrenceValue={setRecurrenceValue}
              setRecurrenceType={setRecurrenceType}
              dueDate={value}
              setValue={setValue}
            />
          )}
        />
      </TaskSectionDisplayDiv>
      {shouldUnclaimOnDueDateExpiry && <InfoPoint>Assignee will be removed once the task is past due date</InfoPoint>}
    </>
  );
};

export default DueDateField;
