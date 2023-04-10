import CreateTemplate from 'components/CreateTemplate';
import PageHeader from 'components/PageHeader';
import { SharedSecondaryButton } from 'components/Shared/styles';
import { useRef } from 'react';
import { useInView } from 'react-intersection-observer';

const CreatePage = () => {
  const headerActionsRef = useRef(null);
  const { ref, inView, entry } = useInView({
    threshold: 1,
  });

  const setRefValue = (value) => (headerActionsRef.current = value);

  return (
    <>
      <div ref={ref}>
      <PageHeader
        withBackButton
        renderActions={() => (
          <SharedSecondaryButton onClick={() => headerActionsRef.current?.handleSave()}>
            Save Quest
          </SharedSecondaryButton>
        )}
      />
      </div>
      <CreateTemplate setRefValue={setRefValue} displaySavePanel={!inView}/>

    </>
  );
};

export default CreatePage;
