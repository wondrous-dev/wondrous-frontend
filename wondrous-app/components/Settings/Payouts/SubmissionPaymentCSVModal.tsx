import React, { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import { CreateModalOverlay } from 'components/CreateEntity/styles';

import CloseModalIcon from 'components/Icons/closeModal';
import RightArrowIcon from 'components/Icons/rightArrow';
import { GET_SUBMISSIONS_PAYMENT_INFO } from 'graphql/queries/payment';
import { useLazyQuery, useQuery } from '@apollo/client';
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
import { isEqual } from 'lodash';
import usePrevious from 'utils/hooks';

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
  // const [submissionsPaymentInfo, setSubmissionsPaymentInfo] = useState(null);
  // const [getSubmissionsPaymentInfo] = useLazyQuery(GET_SUBMISSIONS_PAYMENT_INFO, {
  //   onCompleted: (data) => {
  //     setSubmissionsPaymentInfo(data?.getSubmissionsPaymentInfo);
  //   },
  //   fetchPolicy: 'network-only',
  // });
  // const submissionIds = unpaidSubmissions && Object.keys(unpaidSubmissions);

  // const prevSubmissionIds = usePrevious(submissionIds);
  // useEffect(() => {
  //   if (!submissionIds || submissionIds.length === 0) return;
  //   if (!isEqual(submissionIds, prevSubmissionIds)) {
  //     getSubmissionsPaymentInfo({
  //       variables: {
  //         submissionIds,
  //       },
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [submissionIds, prevSubmissionIds]);

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
