import React, { useCallback, useEffect, useRef, useState, useContext } from 'react';
import Modal from '@mui/material/Modal';
import { Typography, Tab } from '@mui/material';
import palette from 'theme/palette';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_ORG_WALLET, GET_POD_WALLET } from 'graphql/queries/wallet';
import { GET_SUBMISSIONS_PAYMENT_INFO } from 'graphql/queries/payment';
import { parseUserPermissionContext, cutString } from 'utils/helpers';
import usePrevious from 'utils/hooks';
import { PERMISSIONS } from 'utils/constants';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { GET_ORG_BY_ID, GET_POD_BY_ID, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import isEqual from 'lodash/isEqual';
import {
  PodNameTypography,
  PaymentModal,
  PaymentModalHeader,
  PaymentTitleDiv,
  PaymentTitleTextDiv,
  PaymentTitleText,
  PaymentDescriptionText,
  StyledTabs,
  PaymentMethodWrapper,
  WarningTypography,
} from 'components/Common/Payment/styles';
import BatchWalletPayment from 'components/Common/Payment/BatchWalletPayment';
import { BatchOfflinePayment } from 'components/Common/Payment/OfflinePayment/OfflinePayment';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import { SafeImage } from 'components/Common/Image';
import { CompensationAmount, CompensationPill, IconContainer } from 'components/Common/Compensation/styles';
import { NoUnderlineLink } from 'components/Common/Link/links';
import { TableCellText } from './styles';
import {
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
} from '../../Table/styles';

enum ViewType {
  Paid = 'paid',
  Unpaid = 'unpaid',
}

const imageStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '16px',
  marginRight: '8px',
};

export function BatchPayModal(props) {
  const { podId, orgId, open, handleClose, unpaidSubmissions, chain } = props;
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('wallet');
  const [wallets, setWallets] = useState([]);
  const [submissionsPaymentInfo, setSubmissionsPaymentInfo] = useState(null);
  const PAYMENT_TABS = [
    { name: 'wallet', label: 'Wallet', action: () => setSelectedTab('wallet') },
    { name: 'off_platform', label: 'Off platform', action: () => setSelectedTab('off_platform') },
  ];
  const { data: userPermissionsContextData } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const [getOrgWallet, { data, loading, fetchMore }] = useLazyQuery(GET_ORG_WALLET, {
    onCompleted: (data) => {
      setWallets(data?.getOrgWallet);
    },
    fetchPolicy: 'network-only',
  });
  const [getPodWallet] = useLazyQuery(GET_POD_WALLET, {
    fetchPolicy: 'network-only',
  });

  const [getPodById] = useLazyQuery(GET_POD_BY_ID);

  const [getOrgById, { data: orgData }] = useLazyQuery(GET_ORG_BY_ID);

  const getWallets = useCallback(
    async (podId, orgId) => {
      if (podId) {
        try {
          const result = await getPodWallet({
            variables: {
              podId,
            },
          });
          const wallets = result?.data?.getPodWallet;
          if (!wallets || wallets?.length === 0) {
            const podResult = await getPodById({
              variables: {
                podId,
              },
            });
            const pod = podResult?.data?.getPodById;
            getOrgWallet({
              variables: {
                orgId: pod?.orgId,
              },
            });
          } else {
            setWallets(wallets);
          }
        } catch (err) {
          console.error(`failed to fetch wallet: ${err?.message}`);
        }
      } else if (orgId) {
        getOrgWallet({
          variables: {
            orgId,
          },
        });
        getOrgById({
          variables: {
            orgId,
          },
        });
      }
    },
    [podId, orgId]
  );
  const [getSubmissionsPaymentInfo] = useLazyQuery(GET_SUBMISSIONS_PAYMENT_INFO, {
    onCompleted: (data) => {
      setSubmissionsPaymentInfo(data?.getSubmissionsPaymentInfo);
    },
    fetchPolicy: 'network-only',
  });
  const submissionIds = unpaidSubmissions && Object.keys(unpaidSubmissions);

  const prevSubmissionIds = usePrevious(submissionIds);
  useEffect(() => {
    getWallets(podId, orgId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podId, orgId]);
  useEffect(() => {
    if (!submissionIds || submissionIds.length === 0) return;
    if (!isEqual(submissionIds, prevSubmissionIds)) {
      getSubmissionsPaymentInfo({
        variables: {
          submissionIds,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionIds, prevSubmissionIds]);

  return (
    <Modal open={open} onClose={handleClose}>
      <PaymentModal>
        <PaymentTitleDiv>
          <PaymentTitleTextDiv>
            <PaymentTitleText>Batch pay</PaymentTitleText>
            <PaymentDescriptionText>Pay the following submissions</PaymentDescriptionText>
          </PaymentTitleTextDiv>
        </PaymentTitleDiv>
        <StyledTabs value={selectedTab}>
          {PAYMENT_TABS.map((tab) => (
            <Tab
              style={{
                color: 'white !important',
              }}
              value={tab.name}
              key={tab.name}
              label={tab.label}
              onClick={tab.action}
            />
          ))}
        </StyledTabs>
        <StyledTableContainer
          style={{
            width: '100%',
          }}
        >
          <StyledTable>
            <StyledTableHead>
              <StyledTableRow>
                <StyledTableCell align="center" width="20%">
                  Receipient
                </StyledTableCell>
                <StyledTableCell align="center" width="20%">
                  Payout
                </StyledTableCell>
                <StyledTableCell align="center" width="20%">
                  Deliverable
                </StyledTableCell>
              </StyledTableRow>
            </StyledTableHead>
            <StyledTableBody>
              {unpaidSubmissions &&
                Object.keys(unpaidSubmissions).map((key, index) => {
                  const submission = unpaidSubmissions[key];
                  const taskHref = orgId
                    ? `/organization/${orgData?.username}/boards?task=${submission.taskId}`
                    : `/pod/${podId}/boards?task=${submission.taskId}`;

                  return (
                    <StyledTableRow
                      style={{
                        width: '150%',
                      }}
                      key={submission?.id}
                    >
                      <StyledTableCell>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginLeft: '8px',
                          }}
                        >
                          {submission?.payeeProfilePicture ? (
                            <SafeImage
                              useNextImage={false}
                              src={submission?.payeeProfilePicture}
                              style={imageStyle}
                              alt="Payee profile picture"
                            />
                          ) : (
                            <DefaultUserImage style={imageStyle} />
                          )}
                          <TableCellText>{submission?.payeeUsername}</TableCellText>
                        </div>
                      </StyledTableCell>
                      <StyledTableCell
                        style={{
                          minWidth: '120px',
                        }}
                      >
                        <CompensationPill
                          style={{
                            backGround: 'none',
                          }}
                        >
                          <IconContainer>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <SafeImage
                              useNextImage={false}
                              src={submission?.icon}
                              style={{
                                width: '24px',
                                height: '24px',
                              }}
                              alt="Icon"
                            />
                          </IconContainer>
                          <CompensationAmount>
                            {submission?.amount} {submission?.symbol}
                          </CompensationAmount>
                        </CompensationPill>
                      </StyledTableCell>
                      <StyledTableCell>
                        <NoUnderlineLink
                          href={taskHref}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: palette.white,
                          }}
                        >
                          {cutString(submission?.taskTitle, 30)}
                        </NoUnderlineLink>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
            </StyledTableBody>
          </StyledTable>
        </StyledTableContainer>

        <PaymentMethodWrapper>
          {selectedTab === 'off_platform' && (
            <BatchOfflinePayment handleClose={handleClose} submissionIds={submissionIds} />
          )}
          {selectedTab === 'wallet' && (
            <BatchWalletPayment
              orgId={orgId}
              podId={podId}
              unpaidSubmissions={unpaidSubmissions}
              submissionIds={submissionIds}
              wallets={wallets}
              chain={chain}
              submissionsPaymentInfo={submissionsPaymentInfo}
            />
          )}
        </PaymentMethodWrapper>
      </PaymentModal>
    </Modal>
  );
}
