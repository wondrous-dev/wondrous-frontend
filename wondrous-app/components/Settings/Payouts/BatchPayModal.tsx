import React, { useCallback, useEffect, useRef, useState, useContext } from 'react';
import Modal from '@mui/material/Modal';
import { Typography } from '@mui/material';
import { Tab } from '@material-ui/core';
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
} from '../../Common/Payment/styles';
import { CompensationAmount, CompensationPill, IconContainer } from '../../Common/Compensation/styles';
import {
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
} from '../../Table/styles';
import { SafeImage } from '../../Common/Image';
import DefaultUserImage from '../../Common/Image/DefaultUserImage';
import { StyledCheckbox, TableCellText } from './styles';
import { White, Grey800 } from '../../../theme/colors';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_ORG_WALLET, GET_POD_WALLET } from 'graphql/queries/wallet';
import { GET_SUBMISSIONS_PAYMENT_INFO } from 'graphql/queries/payment';
import { parseUserPermissionContext } from 'utils/helpers';
import { useColumns, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { PERMISSIONS } from 'utils/constants';
import { useMe } from '../../Auth/withAuth';
import { useRouter } from 'next/router';
import { DAOIcon } from '../../Icons/dao';
import { OrganisationsCardNoLogo } from '../../profile/about/styles';
import { OfflinePayment } from '../../Common/Payment/OfflinePayment/OfflinePayment';
import { BatchWalletPayment } from '../../Common/Payment/BatchWalletPayment';
import Link from 'next/link';
import { GET_POD_BY_ID, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { cutString } from 'utils/helpers';

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

export const BatchPayModal = (props) => {
  const { podId, orgId, open, handleClose, unpaidSubmissions, chain } = props;
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('wallet');
  const [wallets, setWallets] = useState([]);
  const [submissionsPaymentInfo, setSubmissionsPaymentInfo] = useState(null);
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
                podId: podId,
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
          console.error('failed to fetch wallet: ' + err?.message);
        }
      } else if (orgId) {
        getOrgWallet({
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

  useEffect(() => {
    getWallets(podId, orgId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podId, orgId]);
  useEffect(() => {
    if (submissionIds) {
      getSubmissionsPaymentInfo({
        variables: {
          submissionIds,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unpaidSubmissions, submissionIds]);
  return (
    <Modal open={open} onClose={handleClose}>
      <PaymentModal>
        <PaymentTitleDiv>
          <PaymentTitleTextDiv>
            <PaymentTitleText>Batch pay</PaymentTitleText>
            <PaymentDescriptionText>Pay the following submissions</PaymentDescriptionText>
          </PaymentTitleTextDiv>
        </PaymentTitleDiv>
        <StyledTableContainer
          style={{
            marginLeft: '-3%',
            width: '110%',
          }}
        >
          <StyledTable>
            <StyledTableHead>
              <StyledTableRow>
                <StyledTableCell align="center" width={'20%'}>
                  Receipient
                </StyledTableCell>
                <StyledTableCell align="center" width={'20%'}>
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
                    ? `/organization/${orgId}/boards?task=${submission.taskId}`
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
                            <SafeImage src={submission?.payeeProfilePicture} style={imageStyle} />
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
                              src={submission?.icon}
                              style={{
                                width: '24px',
                                height: '24px',
                              }}
                            />
                          </IconContainer>
                          <CompensationAmount>
                            {submission?.amount} {submission?.symbol}
                          </CompensationAmount>
                        </CompensationPill>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Link href={taskHref}>
                          <a
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color: White,
                            }}
                          >
                            {cutString(submission?.taskTitle, 30)}
                          </a>
                        </Link>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
            </StyledTableBody>
          </StyledTable>
        </StyledTableContainer>

        <PaymentMethodWrapper>
          <BatchWalletPayment
            orgId={orgId}
            podId={podId}
            unpaidSubmissions={unpaidSubmissions}
            submissionIds={submissionIds}
            wallets={wallets}
            chain={chain}
            submissionsPaymentInfo={submissionsPaymentInfo}
          />
        </PaymentMethodWrapper>
      </PaymentModal>
    </Modal>
  );
};
