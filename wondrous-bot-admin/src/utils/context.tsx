import { createContext } from 'react';

interface Props {
  configuration: any[];
  setConfiguration: (configuration: any[]) => void;
  addItem: (item: any) => void;
  toggleForm: () => void;
}
const CreateTemplateContext = createContext<Props>({
  configuration: [],
  setConfiguration: () => {},
  addItem: () => {},
  toggleForm: () => {},
});

export default CreateTemplateContext;
