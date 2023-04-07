import AddFormEntity from 'components/AddFormEntity';
import CreateTemplate from 'components/CreateTemplate';
import PageHeader from 'components/PageHeader';
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
      <PageHeader withBackButton/>
      <CreateTemplate />
    </CreateTemplateContext.Provider>
  );
};

export default CreatePage;
