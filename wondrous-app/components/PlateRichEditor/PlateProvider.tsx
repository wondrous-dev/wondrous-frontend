import { useState } from 'react';

import { PlateContext } from 'utils/contexts';

const PlateProvider = ({ children }) => {
  const [isComboboxOpen, setComboboxOpen] = useState<boolean>(false);

  return <PlateContext.Provider value={{ isComboboxOpen, setComboboxOpen }}>{children}</PlateContext.Provider>;
};

export default PlateProvider;
