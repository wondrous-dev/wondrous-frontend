import React from 'react';
import { IconButton } from '@mui/material';
import {
  CreateModalOverlay,
  CreateLayoutsModal,
  CreateLayoutsModalCloseButton,
  CreateLayoutsModalHeader,
  CreateLayoutsModalItem,
  CreateLayoutsModalItemContainer,
  CreateLayoutsModalItemTitle,
  CreateLayoutsModalItemTitleBlock,
  CreateLayoutsModalTitle,
} from 'components/CreateEntity/styles';

import CloseModalIcon from 'components/Icons/closeModal';
import RightArrowIcon from 'components/Icons/rightArrow';
import { EXPORT_PAYMENT_CSV_TYPE } from 'utils/constants';
import { PAYMENT_PROVIDER_UI_ELEMENTS } from 'components/organization/analytics/CSVModal';

function SubmissionPaymentCSVModal(props) {
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
          {Object.entries(PAYMENT_PROVIDER_UI_ELEMENTS).map(([key, { icon: EntityIcon, color, label }]) => (
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
}

export default SubmissionPaymentCSVModal;
