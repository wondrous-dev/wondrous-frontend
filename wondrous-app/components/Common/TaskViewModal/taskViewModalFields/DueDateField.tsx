import { Grid, Tooltip } from '@mui/material';
import { CreateEntityDueDate } from 'components/CreateEntity/CreateEntityModal/styles';
import EditIcon from 'components/Icons/editIcon';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';
import { useRef, useState } from 'react';
import palette from 'theme/palette';
import { useOutsideAlerter } from 'utils/hooks';
import RecurringIcon from '../../../../public/images/icons/recurring.svg';
import { TaskSectionLabel } from '../helpers';
import {
  InfoPoint,
  TaskSectionDisplayDiv,
  TaskSectionInfoCalendar,
  TaskSectionInfoText,
  ViewFieldWrapper,
} from '../styles';
import { IconWrapper } from './styles';

const DueDateFieldContent = ({ recurringSchema, dueDate, canEdit }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const initialRecurrenceValue =
    recurringSchema?.daily || recurringSchema?.weekly || recurringSchema?.monthly || recurringSchema?.periodic;

  const ref = useRef();

  useOutsideAlerter(ref, () => {
    setIsEditMode(false);
  });

  const initialRecurrenceType =
    recurringSchema && Object.keys(recurringSchema)[Object?.values(recurringSchema).indexOf(initialRecurrenceValue)];

  const [recurrenceValue, setRecurrenceValue] = useState(initialRecurrenceValue);
  const [recurrenceType, setRecurrenceType] = useState(initialRecurrenceType);

  const handleEditMode = () => setIsEditMode((prev) => !prev);

  if (isEditMode) {
    return (
      <div ref={ref}>
        <CreateEntityDueDate
          autoFocus
          setValue={(date) => console.log(date)}
          setRecurrenceType={setRecurrenceType}
          setRecurrenceValue={setRecurrenceValue}
          hideRecurring={false}
          handleClose={() => {
            // TODO: implement API
            // form.setFieldValue('dueDate', null);
            setIsEditMode(false);
            setRecurrenceType(null);
            setRecurrenceValue(null);
          }}
          value={dueDate}
          recurrenceType={recurrenceType}
          recurrenceValue={recurrenceValue}
        />
      </div>
    );
  }

  return (
    <ViewFieldWrapper canEdit onClick={handleEditMode}>
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
};
export default function DueDateField({ shouldDisplay, dueDate, recurringSchema, shouldUnclaimOnDueDateExpiry }) {
  if (!shouldDisplay) return null;
  return (
    <div>
      <TaskSectionDisplayDiv>
        <TaskSectionLabel>Due Date</TaskSectionLabel>
        <DueDateFieldContent recurringSchema={recurringSchema} dueDate={dueDate} canEdit={false} />
      </TaskSectionDisplayDiv>
      {shouldUnclaimOnDueDateExpiry && <InfoPoint>Assignee will be removed once the task is past due date</InfoPoint>}
    </div>
  );
}
