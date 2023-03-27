import { Grid } from '@mui/material';
import { FIELDS } from 'components/Common/TaskViewModal/Fields/hooks/constants';
import { useSubmit } from 'components/Common/TaskViewModal/Fields/hooks/useSubmit';
import { TaskFieldEditableContent } from 'components/Common/TaskViewModal/Fields/Shared';
import { InlineFieldWrapper } from 'components/Common/TaskViewModal/Fields/styles';
import {
  TaskSectionInfoCalendar,
  ViewFieldHoverWrapper,
  ViewFieldWrapper,
} from 'components/Common/TaskViewModal/styles';
import { Dates } from 'components/CreateGrant/Fields';
import EditIcon from 'components/Icons/editIcon';
import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import palette from 'theme/palette';
import { DataDisplay, MultipleDataDisplay } from '../Fields';

const ViewContent = ({ toggleEditMode, startDate, endDate, canEdit }) => (
  <ViewFieldHoverWrapper height="fit-content" $canEdit={canEdit} onClick={toggleEditMode}>
    <Grid container gap="8px">
      {[startDate, endDate].map((date, idx) => (
        <DataDisplay
          key={`${date}-${idx}`}
          label={
            <Grid
              container
              bgcolor={palette.grey920}
              height="28px"
              alignItems="center"
              gap="8px"
              borderRadius="6px"
              padding="4px"
            >
              <TaskSectionInfoCalendar />
              {date ? format(parseISO(date.substring(0, 10)), 'MM/dd/yyyy') : 'Not set'}
            </Grid>
          }
        />
      ))}
    </Grid>
    <EditIcon stroke={palette.grey58} className="edit-icon-field" />
  </ViewFieldHoverWrapper>
);

const EditContent = ({ toggleManageMode, startDate = null, endDate = null }) => {
  const [dates, setDates] = useState({
    startDate,
    endDate,
  });

  const { submit, error } = useSubmit({ field: FIELDS.GRANT_DATES });

  const handleSubmit = async (input) => await submit(null, input);

  const onChange = (key, value) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const newDates = { ...dates, [key]: value, timezone };
    setDates({ ...dates, [key]: value });
    if (newDates.startDate && newDates.endDate) {
      handleSubmit({
        ...newDates,
        [key]: value ? format(value, `yyyy-MM-dd'T'00:00:01.000'Z'`) : null,
      });
    }
  };

  return <Dates hideLabel startDate={startDate} endDate={endDate} onChange={onChange} />;
};

const EditableDates = ({ startDate, endDate, canEdit }) => (
  <TaskFieldEditableContent
    editableContent={({ toggleEditMode }) => (
      <EditContent startDate={startDate} endDate={endDate} toggleManageMode={toggleEditMode} />
    )}
    viewContent={({ toggleEditMode }) => (
      <ViewContent startDate={startDate} endDate={endDate} toggleEditMode={toggleEditMode} canEdit={canEdit} />
    )}
    canAddItem={!startDate && !endDate && canEdit}
    addContent={({ toggleAddMode }) => <EditContent toggleManageMode={toggleAddMode} />}
    content={startDate || endDate}
  />
);

export default EditableDates;
