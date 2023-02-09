import Box from '@mui/material/Box';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import GR15DEIModal from 'components/Common/IntiativesModal/GR15DEIModal';
import { GR15DEILogo } from 'components/Common/IntiativesModal/GR15DEIModal/GR15DEILogo';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { TaskSectionImageContent, TaskSectionLabel } from '../helpers';
import { ActionButton, TaskIntiativesContainer, TaskSectionDisplayDiv, TaskSectionInfoText } from '../styles';

const InitativesFieldContent = ({ setOpenModal }) => (
  <TaskIntiativesContainer>
    <GR15DEILogo
      width="26"
      height="26"
      style={{
        marginRight: '8px',
      }}
      onClick={() => setOpenModal(true)}
    />
    <TaskSectionInfoText>Gitcoin Grants R15 - DEI</TaskSectionInfoText>
  </TaskIntiativesContainer>
);
const InitativesField = ({ shouldDisplay }) => {
  const [openModal, setOpenModal] = useState(false);
  if (!shouldDisplay) return null;
  return (
    <>
      <GR15DEIModal open={openModal} onClose={() => setOpenModal(false)} />
      <TaskSectionDisplayDiv>
        <TaskSectionLabel>Initiative</TaskSectionLabel>
        <TaskSectionImageContent
          hasContent={shouldDisplay}
          ContentComponent={InitativesFieldContent}
          ContentComponentProps={{ setOpenModal }}
        />
      </TaskSectionDisplayDiv>
    </>
  );
};

export default InitativesField;