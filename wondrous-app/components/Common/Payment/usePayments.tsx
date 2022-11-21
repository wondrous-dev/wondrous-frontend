import { useLazyQuery } from '@apollo/client';
import { GET_ORG_WALLET, GET_POD_WALLET, GET_SUBMISSION_PAYMENT_INFO } from 'graphql/queries';
import { useState, useEffect, useMemo } from 'react';
import { BOUNTY_TYPE, ENTITIES_TYPES, GRAPHQL_ERRORS } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';

const usePayments = (entityType, entity, reward) => {
  //   const [paymentInfo, setPaymentInfo] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  //   const [tokenName, setTokenName] = useState('')
  const [changeRewardErrorText, setChangeRewardErrorText] = useState('');
  const [rewardAmount, setRewardAmount] = useState(reward?.rewardAmount);
  const [changedRewardAmount, setChangedRewardAmount] = useState(null);
  const [useChangedRewardAmount, setUseChangedRewardAmount] = useState(false);
  const [changeRewardAmount, setChangeRewardAmount] = useState(false);
  const [wallets, setWallets] = useState([]);
  const [getOrgWallet, { data, loading, fetchMore }] = useLazyQuery(GET_ORG_WALLET, {
    onCompleted: (data) => {
      setWallets(data?.getOrgWallet);
    },
    fetchPolicy: 'network-only',
  });

  const [getSubmissionPaymentInfo, { data: submissionPaymentInfo }] = useLazyQuery(GET_SUBMISSION_PAYMENT_INFO, {
    onError: (err) => {
      if (err?.graphQLErrors[0].extensions?.message === GRAPHQL_ERRORS.NO_RECIPIENT_WEB_3_ADDRESS) {
        setPaymentError('Recipient has no active wallet. Please inform them to connect their wallet to their account');
      }
    },
    fetchPolicy: 'network-only',
  });

  const [getPodWallet] = useLazyQuery(GET_POD_WALLET, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (entity?.podId) {
      getPodWallet({
        variables: {
          podId: entity?.podId,
        },
      }).then((result) => {
        const wallets = result?.data?.getPodWallet;
        if (!wallets || wallets?.length === 0) {
          getOrgWallet({
            variables: {
              orgId: entity?.orgId,
            },
          });
        } else {
          setWallets(wallets);
        }
      });
    } else if (entity?.orgId) {
      getOrgWallet({
        variables: {
          orgId: entity?.orgId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity]);

  const handlePayments = (entityType) => {
    if (entityType === ENTITIES_TYPES.SUBMISSION) {
      return getSubmissionPaymentInfo({
        variables: {
          submissionId: entity?.id,
        },
      });
    }
  };

  const tokenName = reward?.tokenName;

  useEffect(() => {
    handlePayments(entityType);
  }, [entityType, entity]);

  // TODO : refactor this

  const isBountyOrGrantApplication = entity.type === BOUNTY_TYPE || entityType === ENTITIES_TYPES.GRANT_APPLICATION;

  const payee = {
    userId: isBountyOrGrantApplication ? entity?.createdBy : entity?.assigneeId,
    username: isBountyOrGrantApplication ? entity?.creator.username : entity.assigneeUsername,
  };
  const paymentInfo = submissionPaymentInfo?.getSubmissionPaymentInfo;

  return {
    paymentInfo,
    payee,
    wallets,
    rewardAmount,
    setRewardAmount,
    changeRewardErrorText,
    setChangeRewardErrorText,
    tokenName,
    changeRewardAmount,
    setChangeRewardAmount,
    changedRewardAmount,
    setChangedRewardAmount,
    useChangedRewardAmount,
    setUseChangedRewardAmount,
    paymentError,
  };
};

export default usePayments;
