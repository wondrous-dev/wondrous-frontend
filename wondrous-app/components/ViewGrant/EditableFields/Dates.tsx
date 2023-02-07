import { FIELDS } from 'components/Common/TaskViewModal/Fields/hooks/constants';
import { useSubmit } from 'components/Common/TaskViewModal/Fields/hooks/useSubmit';
import { TaskFieldEditableContent } from 'components/Common/TaskViewModal/Fields/Shared';
import { TaskSectionInfoCalendar, ViewFieldWrapper } from 'components/Common/TaskViewModal/styles';
import { Dates } from 'components/CreateGrant/Fields';
import EditIcon from 'components/Icons/editIcon';
import { format } from 'date-fns';
import { useState } from 'react';
import palette from 'theme/palette';
import { DataDisplay, MultipleDataDisplay } from '../Fields';

const ViewContent = ({ toggleEditMode, startDate, endDate, canEdit }) => (
  <ViewFieldWrapper canEdit={canEdit} onClick={toggleEditMode}>
    <MultipleDataDisplay>
      {[startDate, endDate].map((date, idx) => (
        <DataDisplay
          key={`${date}-${idx}`}
          label={
            <>
              <TaskSectionInfoCalendar />
              {date ? format(new Date(date), 'MM/dd/yyyy') : 'Not set'}
            </>
          }
        />
      ))}
    </MultipleDataDisplay>
    <EditIcon stroke={palette.grey58} className="edit-icon-field" />
  </ViewFieldWrapper>
);
const EditContent = ({ toggleManageMode, startDate = null, endDate = null }) => {
  const [dates, setDates] = useState({
    startDate,
    endDate,
  });

  const { submit, error } = useSubmit({ field: FIELDS.GRANT_DATES });

  const handleSubmit = async (input) => await submit(null, input);

  const onChange = (key, value) => {
    const newDates = { ...dates, [key]: value };
    setDates({ ...dates, [key]: value });
    if (newDates.startDate && newDates.endDate) {
      handleSubmit(newDates);
    }
  };

  return <Dates hideLabel startDate={startDate} endDate={endDate} onChange={onChange} />;
};

const EditableDates = ({ startDate, endDate, canEdit }) => (
  <TaskFieldEditableContent
    editableContent={({ toggleEditMode }) => (
      <EditContent startDate={startDate} endDate={endDate} toggleManageMode={toggleEditMode} />
    )}
    ViewContent={({ toggleEditMode }) => (
      <>
        <ViewContent startDate={startDate} endDate={endDate} toggleEditMode={toggleEditMode} canEdit={canEdit} />
      </>
    )}
    canAddItem={!startDate && !endDate && canEdit}
    addContent={({ toggleAddMode }) => <EditContent toggleManageMode={toggleAddMode} />}
  />
);

export default EditableDates;
