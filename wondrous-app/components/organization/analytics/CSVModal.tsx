import React from 'react';
import { IconButton } from '@mui/material';

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
import { EXPORT_PAYMENT_CSV_TYPE } from 'utils/constants';

export const PAYMENT_PROVIDER_UI_ELEMENTS = {
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

function CSVModal(props) {
  const { handleClose, fromTime, toTime, exportPaymentCSV, paymentsData, isPod } = props;

  return (
    <CreateLayoutsModal>
      <CreateLayoutsModalHeader>
        <CreateLayoutsModalTitle>Export format in: </CreateLayoutsModalTitle>
        <CreateLayoutsModalCloseButton onClick={handleClose}>
          <CloseModalIcon />
        </CreateLayoutsModalCloseButton>
      </CreateLayoutsModalHeader>
      <CreateLayoutsModalItemContainer>
        {/* {Object.entries(ENTITIES_UI_ELEMENTS).map(([key, { icon: EntityIcon, label }]) => ( */}
        {Object.entries(PAYMENT_PROVIDER_UI_ELEMENTS).map(([key, { icon: EntityIcon, color, label }]) => (
          <CreateLayoutsModalItem
            style={{
              marginBottom: '8px',
            }}
            key={key}
            onClick={() => {
              if (key === EXPORT_PAYMENT_CSV_TYPE.UTOPIA) {
                exportPaymentCSV({
                  paymentsData,
                  exportCSVType: EXPORT_PAYMENT_CSV_TYPE.UTOPIA,
                  fromTime,
                  toTime,
                  isPod,
                });
              } else if (key === EXPORT_PAYMENT_CSV_TYPE.PARCEL) {
                exportPaymentCSV({
                  paymentsData,
                  exportCSVType: EXPORT_PAYMENT_CSV_TYPE.PARCEL,
                  fromTime,
                  toTime,
                  isPod,
                });
              } else if (key === EXPORT_PAYMENT_CSV_TYPE.PLAIN) {
                exportPaymentCSV({
                  paymentsData,
                  exportCSVType: EXPORT_PAYMENT_CSV_TYPE.PLAIN,
                  fromTime,
                  toTime,
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
  );
}

export default CSVModal;
