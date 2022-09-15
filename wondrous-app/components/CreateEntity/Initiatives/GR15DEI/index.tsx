import React, { useState } from 'react';
import Checkbox from 'components/Checkbox';
import { GR15DEILogo } from 'components/Common/IntiativesModal/GR15DEIModal/GR15DEILogo';
import GR15DEIModal from 'components/Common/IntiativesModal/GR15DEIModal';

import { GR15DEISelectorText, GRDEISelectorContainer } from './styles';

const GR15DEICreateSelector = (props) => {
  const { GR15DEISelected, setGR15DEISelected } = props;
  const [openModal, setOpenModal] = useState(false);
  return (
    <GRDEISelectorContainer>
      <GR15DEIModal open={openModal} onClose={() => setOpenModal(false)} />
      <Checkbox
        checked={!!GR15DEISelected}
        onChange={() => {
          if (setGR15DEISelected) {
            setGR15DEISelected(!GR15DEISelected);
          }
        }}
        inputProps={{ 'aria-label': 'controlled' }}
      />
      <GR15DEISelectorText>Add GR15 label</GR15DEISelectorText>
      <GR15DEILogo onClick={() => setOpenModal(true)} width="26" heigh="26" />
    </GRDEISelectorContainer>
  );
};

export default GR15DEICreateSelector;
