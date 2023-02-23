import { useContext } from 'react';

import { PlateContext } from 'utils/contexts';

const usePlate = () => {
  const { setComboboxOpen, isComboboxOpen } = useContext(PlateContext);

  return { setComboboxOpen, isComboboxOpen };
};

export default usePlate;
