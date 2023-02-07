import { CreateEntityTitle, CreateEntityError } from 'components/CreateEntity/CreateEntityModal/styles';
import { debounce } from 'lodash';
import { TaskModalTitle } from '../styles';
import { FIELDS } from './hooks/constants';
import { useSubmit } from './hooks/useSubmit';
import { TaskFieldEditableContent } from './Shared';

const EditContent = ({ title, toggleEditMode }) => {
  const { submit, error } = useSubmit({ field: FIELDS.TITLE });
  const handleChange = async (e) => await submit(e.target.value);
  const debounceChange = debounce(handleChange, 200);
  return (
    <>
      <CreateEntityTitle
        type="text"
        onChange={debounceChange}
        defaultValue={title}
        name="title"
        placeholder="Enter a title"
        minRows={1}
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
    ViewContent={({ toggleEditMode }) => {
      let props = {
        ...(canEdit ? { onClick: toggleEditMode } : null),
      };
      return <TaskModalTitle {...props}>{title}</TaskModalTitle>;
    }}
    editGridStyle={{
      height: 'fit-content'
    }}
    editableContent={({ toggleEditMode }) => <EditContent toggleEditMode={toggleEditMode} title={title} />}
  />
);

export default Title;
