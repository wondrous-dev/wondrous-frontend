import React from 'react';
import { IconButton } from '@material-ui/core';

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
  other: {
    icon: <></>,
    color: 'white',
    label: 'Other',
  },
};

const CSVModal = (props) => {
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
        {/*{Object.entries(ENTITIES_UI_ELEMENTS).map(([key, { icon: EntityIcon, label }]) => (*/}
        {Object.entries(ENTITIES_UI_ELEMENTS).map(([key, { icon: EntityIcon, color, label }]) => (
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
              } else {
                exportPaymentCSV({
                  paymentsData,
                  exportCSVType: EXPORT_PAYMENT_CSV_TYPE.PARCEL,
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
};

export default CSVModal;
