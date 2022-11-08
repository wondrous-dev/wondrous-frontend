import { TaskModalTitle } from 'components/Common/TaskViewModal/styles';
import { CreateEntityTitle } from 'components/CreateEntity/CreateEntityModal/styles';
import { useRef } from 'react';
import { useOutsideAlerter } from 'utils/hooks';
import { useEditMode } from '../hooks';

const Title = ({ title, onChange = () => {} }) => {
  const { isEditMode, closeEditMode, toggleEditMode } = useEditMode();

  const ref = useRef();

  useOutsideAlerter(ref, closeEditMode);

  return (
    <div ref={ref}>
      {isEditMode && (
        <CreateEntityTitle
          type="text"
          onChange={onChange}
          value={title}
          name="title"
          placeholder="Enter a title"
          minRows={1}
          maxRows={3}
          //   error={form.errors?.title}
          onFocus={() => {}}
          data-cy="create-entity-input-title"
          autoFocus
        />
      )}
      {!isEditMode && <TaskModalTitle onClick={toggleEditMode}>{title}</TaskModalTitle>}
    </div>
  );
};

export default Title;
