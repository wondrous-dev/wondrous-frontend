import React from 'react';
import { IconButton } from '@mui/material';
import { CreateModalOverlay } from 'components/CreateEntity/styles';

import CloseModalIcon from 'components/Icons/closeModal';
import RightArrowIcon from 'components/Icons/rightArrow';
import {
  CreateLayoutsModal,
  CreateLayoutsModalCloseButton,
  CreateLayoutsModalHeader,
  CreateLayoutsModalItem,
  CreateLayoutsModalItemContainer,
  CreateLayoutsModalItemTitle,
  CreateLayoutsModalItemTitleBlock,
  CreateLayoutsModalTitle,
} from 'components/CreateEntity/styles';
import UtopiaIcon from 'components/Icons/utopiaIcon';
import ParcelIcon from 'components/Icons/parcelIcon';

export const EXPORT_PAYMENT_CSV_TYPE = {
  UTOPIA: 'utopia',
  PARCEL: 'parcel',
  PLAIN: 'plain',
};

export const ENTITIES_UI_ELEMENTS = {
  utopia: {
    icon: UtopiaIcon,
    color: '#e6e6e6',
    label: 'Utopia Labs',
  },
  parcel: {
    icon: ParcelIcon,
    color: 'white',
    label: 'Parcel',
  },
  plain: {
    icon: <></>,
    color: 'white',
    label: 'Plain (Full info)',
  },
};

const SubmissionPaymentCSVModal = (props) => {
  const { open, handleClose, exportPaymentCSV, unpaidSubmissions, isPod } = props;

  return (
    <CreateModalOverlay open={open} onClose={handleClose}>
      <CreateLayoutsModal>
        <CreateLayoutsModalHeader>
          <CreateLayoutsModalTitle>Export format in: </CreateLayoutsModalTitle>
          <CreateLayoutsModalCloseButton onClick={handleClose}>
            <CloseModalIcon />
          </CreateLayoutsModalCloseButton>
        </CreateLayoutsModalHeader>
        <CreateLayoutsModalItemContainer>
          {Object.entries(ENTITIES_UI_ELEMENTS).map(([key, { icon: EntityIcon, color, label }]) => (
            <CreateLayoutsModalItem
              style={{
                marginBottom: '8px',
              }}
              key={key}
              onClick={() => {
                if (key === EXPORT_PAYMENT_CSV_TYPE.UTOPIA) {
                  exportPaymentCSV({
                    unpaidSubmissions,
                    exportCSVType: EXPORT_PAYMENT_CSV_TYPE.UTOPIA,
                    isPod,
                  });
                } else if (key === EXPORT_PAYMENT_CSV_TYPE.PARCEL) {
                  exportPaymentCSV({
                    unpaidSubmissions,
                    exportCSVType: EXPORT_PAYMENT_CSV_TYPE.PARCEL,
                    isPod,
                  });
                } else if (key === EXPORT_PAYMENT_CSV_TYPE.PLAIN) {
                  exportPaymentCSV({
                    unpaidSubmissions,
                    exportCSVType: EXPORT_PAYMENT_CSV_TYPE.PLAIN,
                    isPod,
                  });
                }
              }}
            >
              <CreateLayoutsModalItemTitleBlock>
                <CreateLayoutsModalItemTitle>{label}</CreateLayoutsModalItemTitle>
              </CreateLayoutsModalItemTitleBlock>
              <IconButton>
                <RightArrowIcon />
              </IconButton>
            </CreateLayoutsModalItem>
          ))}
        </CreateLayoutsModalItemContainer>
      </CreateLayoutsModal>
    </CreateModalOverlay>
  );
};

export default SubmissionPaymentCSVModal;
