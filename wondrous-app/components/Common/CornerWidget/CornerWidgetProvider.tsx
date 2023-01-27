import Snackbar from '@mui/material/Snackbar';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { CornerWidgetContext } from 'utils/contexts';
import { CornerWidgetProps } from './CornerWidget';

const CornerWidgetComponent = dynamic(() => import('./CornerWidget'), { ssr: false, suspense: false });

type CornerWidgetState = Omit<CornerWidgetProps, 'handleClose'> | null;

const CornerWidgetProvider = ({ children }) => {
  const [value, setValue] = useState<CornerWidgetState>(null);
  const open = Boolean(value?.id);
  const handleClose = () => setValue(null);
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
        <div>{open && <CornerWidgetComponent handleClose={handleClose} {...value} />}</div>
      </Snackbar>
      {children}
    </CornerWidgetContext.Provider>
  );
};

export default CornerWidgetProvider;
