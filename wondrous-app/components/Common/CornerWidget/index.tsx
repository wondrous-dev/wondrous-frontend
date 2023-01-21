import Snackbar from '@mui/material/Snackbar';
import dynamic from 'next/dynamic';
import { createContext, useContext, useMemo, useState } from 'react';

import { CornerWidgetType } from './types';

const CornerWidgetComponent = dynamic(() => import('./Component'), { ssr: false, suspense: false });

export const CornerWidgetContext = createContext(null);

export const useCornerWidget = () => useContext(CornerWidgetContext);

const CornerWidgetProvider = ({ children }) => {
  const [value, setValue] = useState<CornerWidgetType>({
    open: false,
    id: null,
    type: null,
    orgName: null,
    podName: null,
  });
  const { open, id, type, orgName, podName } = value;
  const handleClose = () =>
    setValue({
      ...value,
      open: false,
    });
  const cornerWidgetValue = useMemo(
    () => ({
      setCornerWidgetValue: setValue,
    }),
    [setValue]
  );
  return (
    <CornerWidgetContext.Provider value={cornerWidgetValue}>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={open}
        onClose={handleClose}
        autoHideDuration={6000}
      >
        <div>
          {open && (
            <CornerWidgetComponent handleClose={handleClose} id={id} type={type} orgName={orgName} podName={podName} />
          )}
        </div>
      </Snackbar>
      {children}
    </CornerWidgetContext.Provider>
  );
};

export default CornerWidgetProvider;
