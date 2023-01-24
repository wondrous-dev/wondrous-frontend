import { useMutation } from '@apollo/client';
import { Typography } from '@mui/material';
import { FileLoading } from 'components/Common/FileUpload/FileUpload';
import { PaymentData } from 'components/Common/Payment/types';
import { MediaItem } from 'components/CreateEntity/MediaItem';
import CopyIcon from 'components/Icons/copy';
import {
  LINK_BATCH_OFF_PLATFORM_PAYMENT,
  LINK_OFF_PLATFORM_PAYMENT,
  LINK_OFF_PLATFORM_PAYMENT_FOR_APPLICATION,
} from 'graphql/mutations/payment';
import {
  GET_PAYMENTS_FOR_ORG,
  GET_PAYMENTS_FOR_POD,
  GET_UNPAID_SUBMISSIONS_FOR_ORG,
  GET_UNPAID_SUBMISSIONS_FOR_POD,
} from 'graphql/queries/payment';
import React, { useContext, useRef, useState } from 'react';
import palette from 'theme/palette';
import { ENTITIES_TYPES } from 'utils/constants';
import { handleAddFile } from 'utils/media';

import { CreateEntityAttachment, CreateEntityAttachmentIcon } from 'components/CreateEntity/CreateEntityModal/styles';

import Button from 'components/Button';
import { ErrorText } from '../..';
import { CreateFormPreviewButton } from '../../../CreateEntity/styles';
import { SnackbarAlertContext } from '../../SnackbarAlert';
import {
  MediaUploadDiv,
  OfflinePaymentButtonWrapper,
  OfflinePaymentDescriptionText,
  OfflinePaymentDropdown,
  OfflinePaymentDropdownWrapper,
  OfflinePaymentInputLabel,
  OfflinePaymentLinkInput,
  OfflinePaymentWallet,
  OfflinePaymentWalletButton,
  OfflinePaymentWalletButtonText,
  OfflinePaymentWalletWrapper,
  OfflinePaymentWarningTypography,
  OfflinePaymentWrapper,
} from './styles';

const OFFLINE_PAYMENT_OPTIONS = [
  { label: 'Block Explorer Link', value: 'manual_explorer_link' },
  { label: 'Utopia labs Link', value: 'utopia_link' },
  { label: 'Parcel link', value: 'parcel_link' },
];

interface Props {
  handleClose: () => void;
  submissionOrApplicationId: string;
  paymentData: PaymentData;
  entityType?: string;
}

export function OfflinePayment({ handleClose, submissionOrApplicationId, paymentData, entityType = null }: Props) {
  const recipientAddress = paymentData?.recepientAddress;
  const [selectedOfflineType, setSelectedOfflineType] = useState(null);
  const [offlinePaymentLink, setOfflinePaymentLink] = useState(null);
  const [linkPaymentError, setLinkPaymentError] = useState(null);
  const [mediaUploads, setMediaUploads] = useState([]);
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const [submissionPaid, setSubmissionPaid] = useState(null);
  const inputRef: any = useRef();

  const [fileUploadLoading, setFileUploadLoading] = useState(false);

  const handleExistingMediaAttach = async (event) => {
    const fileToAdd = await handleAddFile({
      event,
      filePrefix: 'tmp/payment/new/',
      mediaUploads,
      setMediaUploads: (medias) => setMediaUploads(medias),
      setFileUploadLoading,
    });
  };

  const [lnkOffPlatformPaymentForGrantApplications] = useMutation(LINK_OFF_PLATFORM_PAYMENT_FOR_APPLICATION, {
    onCompleted: (data) => {
      setSubmissionPaid(true);
    },
    refetchQueries: ['getGrantApplicationById', 'getGrantById'],
    onError: (e) => {
      console.error(e);
      setLinkPaymentError('Error linking payment');
    },
  });
  const [linkOffPlatformPayment] = useMutation(LINK_OFF_PLATFORM_PAYMENT, {
    onCompleted: (data) => {
      setSubmissionPaid(true);
    },
    refetchQueries: [
      'getUnpaidSubmissionsForOrg',
      'getUnpaidSubmissionsForPod',
      'getPaymentsForOrg',
      'getPaymentsForPod',
    ],
    onError: (e) => {
      console.error(e);
      setLinkPaymentError('Error linking payment');
    },
  });

  const handleLinkPaymentLinkClick = () => {
    setLinkPaymentError(null);
    if (!selectedOfflineType || !offlinePaymentLink) {
      setLinkPaymentError('Need to select a payment type and enter a link');
      return;
    }
    const offlineLinks = [
      {
        type: selectedOfflineType,
        link: offlinePaymentLink,
      },
    ];
    if (entityType === ENTITIES_TYPES.GRANT_APPLICATION) {
      lnkOffPlatformPaymentForGrantApplications({
        variables: {
          input: {
            grantApplicationId: submissionOrApplicationId,
            offlineLinks,
          },
        },
      });
    } else {
      linkOffPlatformPayment({
        variables: {
          input: {
            submissionId: submissionOrApplicationId,
            offlineLinks,
            mediaUploads,
          },
          refetchQueries: [
            GET_UNPAID_SUBMISSIONS_FOR_POD,
            GET_UNPAID_SUBMISSIONS_FOR_ORG,
            GET_PAYMENTS_FOR_POD,
            GET_PAYMENTS_FOR_ORG,
          ],
        },
      });
    }
    if (handleClose) {
      handleClose();
    }
    setSnackbarAlertOpen(true);
    setSnackbarAlertMessage(
      <Typography
        variant="body1"
        style={{
          color: palette.white,
        }}
      >
        Payment linked
      </Typography>
    );
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${recipientAddress}`);
    setSnackbarAlertOpen(true);
    setSnackbarAlertMessage('Address copied to clipboard');
  };

  return (
    <OfflinePaymentWrapper>
      <OfflinePaymentWarningTypography>
        This link will only be visible to the assignee and other admins with the payment permission.
      </OfflinePaymentWarningTypography>
      <OfflinePaymentInputLabel>Platform</OfflinePaymentInputLabel>
      <OfflinePaymentDropdownWrapper>
        <OfflinePaymentDropdown
          value={selectedOfflineType}
          setValue={setSelectedOfflineType}
          labelText="Choose a payment method"
          options={OFFLINE_PAYMENT_OPTIONS}
          onChange={(e) => {}}
        />
      </OfflinePaymentDropdownWrapper>
      <OfflinePaymentInputLabel>Wallet Link</OfflinePaymentInputLabel>
      <OfflinePaymentWalletWrapper>
        <OfflinePaymentWallet disabled value={recipientAddress} />
        <Button
          onClick={handleCopyAddress}
          buttonTheme={{
            background: palette.grey75,
            borderColor: 'transparent',
            fontSize: '14px',
            fontWeight: 500,
            paddingX: 24,
            paddingY: 8,
            height: '32px',
            hover: {
              background: palette.grey76,
            },
          }}
        >
          {/* <Button highlighted onClick={handleCopyAddress}> */}
          <CopyIcon />
          Copy
          {/* </OfflinePaymentWalletButton> */}
        </Button>
      </OfflinePaymentWalletWrapper>
      <OfflinePaymentInputLabel>Link</OfflinePaymentInputLabel>
      <OfflinePaymentLinkInput
        placeholder="Proof of payment link"
        value={offlinePaymentLink}
        onChange={(e) => setOfflinePaymentLink(e.target.value)}
      />
      <MediaUploadDiv>
        {mediaUploads?.length > 0 &&
          mediaUploads.map((mediaItem) => (
            <MediaItem
              key={mediaItem?.uploadSlug}
              mediaUploads={mediaUploads}
              setMediaUploads={(medias) => setMediaUploads(medias)}
              mediaItem={mediaItem}
              removeMediaItem={() => {}}
            />
          ))}
        <CreateEntityAttachment onClick={() => inputRef?.current?.click()}>
          <CreateEntityAttachmentIcon />
          Add Attachment
          {fileUploadLoading && <FileLoading />}
        </CreateEntityAttachment>
      </MediaUploadDiv>
      <input type="file" hidden ref={inputRef} onChange={handleExistingMediaAttach} />

      {linkPaymentError && <ErrorText>{linkPaymentError}</ErrorText>}
      <OfflinePaymentButtonWrapper>
        {!submissionPaid && (
          <CreateFormPreviewButton onClick={handleLinkPaymentLinkClick}>Link Payment</CreateFormPreviewButton>
        )}
        {submissionPaid && <OfflinePaymentDescriptionText>Paid!</OfflinePaymentDescriptionText>}
      </OfflinePaymentButtonWrapper>
    </OfflinePaymentWrapper>
  );
}

export function BatchOfflinePayment(props) {
  const { handleClose, submissionIds } = props;
  const [selectedOfflineType, setSelectedOfflineType] = useState(null);
  const [offlinePaymentLink, setOfflinePaymentLink] = useState(null);
  const [linkPaymentError, setLinkPaymentError] = useState(null);
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const [submissionPaid, setSubmissionPaid] = useState(null);
  const [linkBatchOffPlatformPayment] = useMutation(LINK_BATCH_OFF_PLATFORM_PAYMENT, {
    onCompleted: (data) => {
      setSubmissionPaid(true);
    },
    onError: (e) => {
      console.error(e);
      setLinkPaymentError('Error linking payment');
    },
  });

  const handleLinkPaymentLinkClick = () => {
    setLinkPaymentError(null);
    if (!selectedOfflineType || !offlinePaymentLink) {
      setLinkPaymentError('Need to select a payment type and enter a link');
      return;
    }
    const offlineLinks = [
      {
        type: selectedOfflineType,
        link: offlinePaymentLink,
      },
    ];
    linkBatchOffPlatformPayment({
      variables: {
        input: {
          submissionIds,
          offlineLinks,
        },
        refetchQueries: [
          GET_UNPAID_SUBMISSIONS_FOR_POD,
          GET_UNPAID_SUBMISSIONS_FOR_ORG,
          GET_PAYMENTS_FOR_POD,
          GET_PAYMENTS_FOR_ORG,
        ],
      },
    });
    if (handleClose) {
      handleClose();
    }
    setSnackbarAlertOpen(true);
    setSnackbarAlertMessage(
      <Typography
        variant="body1"
        style={{
          color: palette.white,
        }}
      >
        Payment linked
      </Typography>
    );
  };

  return (
    <OfflinePaymentWrapper>
      <OfflinePaymentWarningTypography>
        This link will only be visible to the assignee and other admins with the payment permission.
      </OfflinePaymentWarningTypography>
      <OfflinePaymentInputLabel>Platform</OfflinePaymentInputLabel>
      <OfflinePaymentDropdownWrapper>
        <OfflinePaymentDropdown
          value={selectedOfflineType}
          setValue={setSelectedOfflineType}
          labelText="Choose a payment method"
          options={OFFLINE_PAYMENT_OPTIONS}
          onChange={(e) => {}}
        />
      </OfflinePaymentDropdownWrapper>
      <OfflinePaymentInputLabel>Link</OfflinePaymentInputLabel>
      <OfflinePaymentLinkInput
        placeholder="Proof of payment link"
        value={offlinePaymentLink}
        onChange={(e) => setOfflinePaymentLink(e.target.value)}
      />
      {linkPaymentError && <ErrorText>{linkPaymentError}</ErrorText>}
      <OfflinePaymentButtonWrapper>
        {!submissionPaid && (
          <CreateFormPreviewButton onClick={handleLinkPaymentLinkClick}>Link Payment</CreateFormPreviewButton>
        )}
        {submissionPaid && <OfflinePaymentDescriptionText>Paid!</OfflinePaymentDescriptionText>}
      </OfflinePaymentButtonWrapper>
    </OfflinePaymentWrapper>
  );
}
