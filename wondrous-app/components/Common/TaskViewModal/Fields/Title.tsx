import Grid from '@mui/material/Grid';
import { CreateEntityTitle, CreateEntityError } from 'components/CreateEntity/CreateEntityModal/styles';
import EditIcon from 'components/Icons/editIcon';
import { debounce } from 'lodash';
import palette from 'theme/palette';
import { TaskModalTitle, ViewFieldWrapper } from '../styles';
import { FIELDS } from './hooks/constants';
import { useSubmit } from './hooks/useSubmit';
import { TaskFieldEditableContent } from './Shared';
import { IconWrapper, TitleFieldWrapper, TitleIconWrapper } from './styles';

const EditContent = ({ title, toggleEditMode }) => {
  const { submit, error } = useSubmit({ field: FIELDS.TITLE });
  const handleChange = async (e) => await submit(e.target.value);
  const debounceChange = debounce(handleChange, 800);
  return (
    <>
      <CreateEntityTitle
        type="text"
        onChange={debounceChange}
        defaultValue={title}
        name="title"
        placeholder="Enter a title"
        minRows={1}
        onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
        maxRows={3}
        data-cy="create-entity-input-title"
        autoFocus
      />
      {error ? <CreateEntityError>{error}</CreateEntityError> : null}
    </>
  );
};

const Title = ({ title, canEdit }) => (
  <TaskFieldEditableContent
    viewContent={({ toggleEditMode }) => (
      <TitleFieldWrapper $canEdit={canEdit} onClick={toggleEditMode} $background="transparent">
        <TaskModalTitle>{title}</TaskModalTitle>
        <TitleIconWrapper>
          <EditIcon stroke={palette.grey58} className="edit-icon-field" />
        </TitleIconWrapper>
      </TitleFieldWrapper>
    )}
    editGridStyle={{
      height: 'fit-content',
    }}
    editableContent={({ toggleEditMode }) => <EditContent toggleEditMode={toggleEditMode} title={title} />}
  />
);

export default Title;
