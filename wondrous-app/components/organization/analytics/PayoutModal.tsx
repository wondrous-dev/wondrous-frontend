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
  ContributorRowText,
  ContributorTaskModalRow,
  PayoutPaymentModal,
  TaskCountText,
  TaskCountWrapper,
} from './styles';
import { SafeImage } from '../../Common/Image';
import DefaultUserImage from '../../Common/Image/DefaultUserImage';
import { White, Grey800 } from '../../../theme/colors';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_ORG_WALLET, GET_POD_WALLET } from 'graphql/queries/wallet';
import { GET_PAYMENT_METHODS_FOR_ORG, GET_SUBMISSIONS_PAYMENT_INFO } from 'graphql/queries/payment';
import { parseUserPermissionContext } from 'utils/helpers';
import usePrevious, { useColumns, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { PERMISSIONS, TASK_STATUS_DONE } from 'utils/constants';
import { useMe } from '../../Auth/withAuth';
import { useRouter } from 'next/router';
import { DAOIcon } from '../../Icons/dao';
import { OrganisationsCardNoLogo } from '../../profile/about/styles';
import { OfflinePayment } from '../../Common/Payment/OfflinePayment/OfflinePayment';
import { BatchWalletPayment } from '../../Common/Payment/BatchWalletPayment';
import Link from 'next/link';
import { GET_POD_BY_ID, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { cutString } from 'utils/helpers';
import { isEqual } from 'lodash';
import { format } from 'date-fns';
import { calculatePoints, UserRowPictureStyles } from '.';
import { filterPaymentMethods } from 'components/CreateEntity/createEntityModal';
import {
  CreateFormMainBlockTitle,
  CreateFormRewardCurrency,
  CreateRewardAmountDiv,
} from 'components/CreateEntity/styles';
import InputForm from 'components/Common/InputForm/inputForm';
import CloseModalIcon from 'components/Icons/closeModal';
import TaskStatus from 'components/Icons/TaskStatus';

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

const ContributorTaskRowElement = (props) => {
  const { index, contributorTask, paymentMethods } = props;
  const [rewardsCurrency, setRewardsCurrency] = useState(null);
  const [rewardsAmount, setRewardsAmount] = useState(null);
  return (
    <ContributorTaskModalRow key={index}>
      <>
        {contributorTask?.profilePicture ? (
          <SafeImage src={contributorTask?.profilePicture} style={UserRowPictureStyles} />
        ) : (
          <DefaultUserImage style={UserRowPictureStyles} />
        )}
        <ContributorRowText>{contributorTask?.assigneeUsername}</ContributorRowText>
        <TaskCountWrapper
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <TaskStatus
            style={{
              width: '24px',
              height: '24px',
              marginRight: '4px',
            }}
            status={TASK_STATUS_DONE}
          />
          <TaskCountText>
            {contributorTask?.tasks?.length}
            <span
              style={{
                color: 'rgba(108, 108, 108, 1)',
                marginLeft: '4px',
              }}
            >
              {contributorTask?.tasks?.length === 1 ? 'task' : 'tasks'}
            </span>
          </TaskCountText>
        </TaskCountWrapper>
        <TaskCountWrapper
          style={{
            background: 'none',
            marginLeft: '12px',
          }}
        >
          <TaskCountText>
            {calculatePoints(contributorTask?.tasks)}
            <span
              style={{
                color: 'rgba(108, 108, 108, 1)',
                marginLeft: '4px',
              }}
            >
              {calculatePoints(contributorTask?.tasks) ? 'point' : 'points'}
            </span>
          </TaskCountText>
        </TaskCountWrapper>
        <div
          style={{
            flex: 1,
          }}
        />
        <CreateFormRewardCurrency
          labelText="Choose token"
          options={paymentMethods}
          labelStyle={{
            paddingTop: '0',
            marginTop: '-4px',
          }}
          name="reward-currency"
          setValue={setRewardsCurrency}
          value={rewardsCurrency}
          hideLabel={true}
          innerStyle={{
            marginTop: '15px',
            background: '#171717',
          }}
          formSelectStyle={{
            marginRight: '12px',
          }}
        />

        <InputForm
          type={'number'}
          style={{
            width: 'auto',
            background: '#171717',
          }}
          min="0"
          placeholder="Enter reward amount"
          search={false}
          value={rewardsAmount}
          onChange={(e) => setRewardsAmount(e.target.value)}
          endAdornment={
            <CloseModalIcon
              style={{
                marginRight: '8px',
                cursor: 'pointer',
              }}
              onClick={() => {
                setRewardsCurrency('');
                setRewardsAmount(0);
              }}
            />
          }
        />
      </>
    </ContributorTaskModalRow>
  );
};
export const PayoutModal = (props) => {
  const { podId, orgId, open, handleClose, unpaidSubmissions, chain, fromTime, toTime, contributorTaskData } = props;
  const [wallets, setWallets] = useState([]);
  const [submissionsPaymentInfo, setSubmissionsPaymentInfo] = useState(null);
  const [fetchPaymentMethod, setFetchPaymentMethod] = useState(false);
  const [getPaymentMethods, { data: paymentMethodData }] = useLazyQuery(GET_PAYMENT_METHODS_FOR_ORG, {
    onCompleted: () => {
      setFetchPaymentMethod(true);
    },
  });
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

  useEffect(() => {
    getWallets(podId, orgId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podId, orgId]);

  useEffect(() => {
    if (open) {
      if (!fetchPaymentMethod) {
        getPaymentMethods({
          variables: {
            orgId,
          },
        });
        setFetchPaymentMethod(true);
      }
    }
  }, [open]);
  const paymentMethods = filterPaymentMethods(paymentMethodData?.getPaymentMethodsForOrg);
  return (
    <Modal open={open} onClose={handleClose}>
      <PayoutPaymentModal>
        <PaymentTitleDiv>
          <PaymentTitleTextDiv>
            <PaymentTitleText>Pay Contributors</PaymentTitleText>
            <PaymentDescriptionText>
              Customize payouts from {format(fromTime, 'yyyy-MM-dd')} to {format(toTime, 'yyyy-MM-dd')}{' '}
            </PaymentDescriptionText>
          </PaymentTitleTextDiv>
        </PaymentTitleDiv>
        {contributorTaskData?.map((contributorTask, index) => {
          if (contributorTask?.assigneeId) {
            return (
              <ContributorTaskRowElement
                index={index}
                contributorTask={contributorTask}
                paymentMethods={paymentMethods}
              />
            );
          }
        })}
        <PaymentMethodWrapper>
          <BatchWalletPayment
            orgId={orgId}
            podId={podId}
            unpaidSubmissions={unpaidSubmissions}
            submissionIds={[]}
            wallets={wallets}
            chain={chain}
            submissionsPaymentInfo={[]}
          />
        </PaymentMethodWrapper>
      </PayoutPaymentModal>
    </Modal>
  );
};
