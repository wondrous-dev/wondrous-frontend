import AddFormEntity from 'components/AddFormEntity';
import CreateTemplate from 'components/CreateTemplate';
import { useState } from 'react';
import CreateTemplateContext from 'utils/context';
import useCreateConfiguration from 'utils/hooks';

const CreatePage = () => {
  const { configuration, setConfiguration } = useCreateConfiguration();
  const addItem = (item) => setConfiguration([...configuration, item]);
  const [open, setIsOpen] = useState(false)

  const toggleForm = () => setIsOpen(prev => !prev)
  return (
    <CreateTemplateContext.Provider
      value={{
        configuration,
        setConfiguration,
        addItem,
        toggleForm,
      }}
    >
      {open ? <AddFormEntity/> : null}
      <CreateTemplate />
    </CreateTemplateContext.Provider>
  );
};

export default CreatePage;
