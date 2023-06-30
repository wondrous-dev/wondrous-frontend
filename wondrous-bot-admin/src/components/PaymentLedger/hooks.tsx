import {
  GET_COMPLETED_CMTY_PAYMENTS_FOR_ORG,
  GET_PAID_CMTY_PAYMENTS_FOR_QUESTS,
  GET_PROCESSING_CMTY_PAYMENTS_FOR_ORG,
  GET_PROCESSING_CMTY_PAYMENTS_FOR_QUESTS,
  GET_UNPAID_CMTY_PAYMENTS_FOR_ORG,
  GET_UNPAID_CMTY_PAYMENTS_FOR_QUESTS,
} from "graphql/queries";
import { useLazyQuery } from "@apollo/client";
import { LIMIT, MONTH_DAY_FULL_YEAR } from "utils/constants";
import { useEffect, useMemo, useState } from "react";
import PaymentSelector from "./PaymentSelector";
import moment from "moment";
import ChainInfo from "./ChainInfo";
import TokenIdSelect from "./TokenIdSelect";
import UserInfo from "./UserInfo";
import { constructExplorerRedirectUrl } from "utils/common";
import { StyledCheckbox } from "./styles";

export const useData = ({ orgId, questId }) => {
  const [paymentView, setPaymentView] = useState("unpaid");
  const [hasMore, setHasMore] = useState(false);

  const [getUnpaidCmtyPaymentsForQuest, { fetchMore: fetchMoreUnpaidQuest, data: unpaidQuestData }] = useLazyQuery(
    GET_UNPAID_CMTY_PAYMENTS_FOR_QUESTS,
    {
      fetchPolicy: "network-only",
    }
  );

  const [getPaidCmtyPaymentsForQuest, { fetchMore: fetchMorePaidQuest, data: paidQuestData }] = useLazyQuery(
    GET_PAID_CMTY_PAYMENTS_FOR_QUESTS,
    {
      fetchPolicy: "network-only",
    }
  );

  const [getProcessingCmtyPaymentsForQuest, { fetchMore: fetchMoreProcessingQuest, data: processingQuestData }] =
    useLazyQuery(GET_PROCESSING_CMTY_PAYMENTS_FOR_QUESTS, {
      fetchPolicy: "network-only",
    });

  const [getUnpaidCmtyPaymentsForOrg, { fetchMore: fetchMoreUnpaid, data: unpaidListData }] = useLazyQuery(
    GET_UNPAID_CMTY_PAYMENTS_FOR_ORG,
    {
      fetchPolicy: "network-only",
    }
  );

  const [getCompletedCmtyPaymentsForOrg, { fetchMore: fetchMoreCompleted, data: completedListData }] = useLazyQuery(
    GET_COMPLETED_CMTY_PAYMENTS_FOR_ORG,
    {
      fetchPolicy: "network-only",
    }
  );

  const [getProcessingCmtyPaymentsForOrg, { fetchMore: fetchMoreProcessing, data: processingListData }] = useLazyQuery(
    GET_PROCESSING_CMTY_PAYMENTS_FOR_ORG,
    {
      fetchPolicy: "network-only",
    }
  );
  const fetchUnpaidOrg = async () => {
    const result = await getUnpaidCmtyPaymentsForOrg({
      variables: {
        input: {
          orgId,
          limit: LIMIT,
        },
      },
    });
    const unpaidPayments = result?.data?.getUnpaidCmtyPaymentsForOrg;
    setHasMore(unpaidPayments?.length >= LIMIT);
  };

  const fetchUnpaidQuestData = async () => {
    const result = await getUnpaidCmtyPaymentsForQuest({
      variables: {
        input: {
          questId,
          limit: LIMIT,
        },
      },
    });
    const unpaidPayments = result?.data?.getUnpaidCmtyPaymentsForQuest;
    setHasMore(unpaidPayments?.length >= LIMIT);
  };

  const handleFetch = () => {
    if (questId) {
      return fetchUnpaidQuestData();
    }
    if (orgId) {
      return fetchUnpaidOrg();
    }
  };

  const handlePaidPaymentsFetch = async () => {
    if (questId) {
      const result = await getPaidCmtyPaymentsForQuest({
        variables: {
          input: {
            questId,
            limit: LIMIT,
          },
        },
      });
      const paidPayments = result?.data?.getPaidCmtyPaymentsForQuest;
      return setHasMore(paidPayments?.length >= LIMIT);
    }
    const result = await getCompletedCmtyPaymentsForOrg({
      variables: {
        input: {
          orgId,
          limit: LIMIT,
        },
      },
    });
    const completedPayments = result?.data?.getCompletedCmtyPaymentsForOrg;
    return setHasMore(completedPayments?.length >= LIMIT);
  };

  const handleUnpaidPaymentsFetch = async () => {
    if (questId) {
      const result = await getUnpaidCmtyPaymentsForQuest({
        variables: {
          input: {
            questId,
            limit: LIMIT,
          },
        },
      });
      const paidPayments = result?.data?.getUnpaidCmtyPaymentsForQuest;
      return setHasMore(paidPayments?.length >= LIMIT);
    }
    const { data } = await getUnpaidCmtyPaymentsForOrg({
      variables: {
        input: {
          orgId,
          limit: LIMIT,
        },
      },
    });
    const unpaidPayments = data?.getUnpaidCmtyPaymentsForOrg;
    setHasMore(unpaidPayments?.length >= LIMIT);
  };

  const handleProcessingPaymentsFetch = async () => {
    if (questId) {
      const result = await getProcessingCmtyPaymentsForQuest({
        variables: {
          input: {
            questId,
            limit: LIMIT,
          },
        },
      });
      const payments = result?.data?.getProcessingCmtyPaymentsForQuest;
      return setHasMore(payments?.length >= LIMIT);
    }
    const { data } = await getProcessingCmtyPaymentsForOrg({
      variables: {
        input: {
          orgId,
          limit: LIMIT,
        },
      },
    });
    const processingPayments = data?.getProcessingCmtyPaymentsForOrg;
    return setHasMore(processingPayments?.length >= LIMIT);
  };

  useEffect(() => {
    handleFetch();
  }, [orgId, questId]);

  const hasLength = useMemo(() => {
    if (paymentView === "unpaid") {
      return questId
        ? !!unpaidQuestData?.getUnpaidCmtyPaymentsForQuest?.length
        : !!unpaidListData?.getUnpaidCmtyPaymentsForOrg?.length;
    }
    if (paymentView === "processing") {
      return questId
        ? !!processingQuestData?.getProcessingCmtyPaymentsForQuest?.length
        : !!processingListData?.getProcessingCmtyPaymentsForOrg?.length;
    }
    return questId
      ? !!paidQuestData?.getPaidCmtyPaymentsForQuest?.length
      : !!completedListData?.getCompletedCmtyPaymentsForOrg?.length;
  }, [
    paymentView,
    completedListData,
    unpaidListData,
    processingListData,
    paidQuestData,
    unpaidQuestData,
    processingQuestData,
    questId,
  ]);

  const handleQuestFetchMore = async () => {
    if (paymentView === "unpaid") {
      const { data } = await fetchMoreUnpaidQuest({
        variables: {
          input: {
            questId,
            limit: LIMIT,
            offset: unpaidQuestData?.getUnpaidCmtyPaymentsForQuest?.length,
          },
        },
      });
      const unpaidPayments = data?.getUnpaidCmtyPaymentsForQuest;
      return setHasMore(unpaidPayments?.length >= LIMIT);
    }
    if (paymentView === "paid") {
      const { data } = await fetchMorePaidQuest({
        variables: {
          input: {
            questId,
            limit: LIMIT,
            offset: paidQuestData?.getPaidCmtyPaymentsForQuest?.length,
          },
        },
      });
      const paidPayments = data?.getPaidCmtyPaymentsForQuest;
      return setHasMore(paidPayments?.length >= LIMIT);
    }
    if (paymentView === "processing") {
      const { data } = await fetchMoreProcessingQuest({
        variables: {
          input: {
            questId,
            limit: LIMIT,
            offset: processingQuestData?.getProcessingCmtyPaymentsForQuest?.length,
          },
        },
      });
      const processingPayments = data?.getProcessingCmtyPaymentsForQuest;
      return setHasMore(processingPayments?.length >= LIMIT);
    }
  };

  const handleOrgFetchMore = async () => {
    if (paymentView === "unpaid") {
      const { data } = await fetchMoreUnpaid({
        variables: {
          input: {
            orgId,
            limit: LIMIT,
            offset: unpaidListData?.getUnpaidCmtyPaymentsForOrg?.length,
          },
        },
      });
      const unpaidPayments = data?.getUnpaidCmtyPaymentsForOrg;
      return setHasMore(unpaidPayments?.length >= LIMIT);
    }
    if (paymentView === "paid") {
      const { data } = await fetchMoreCompleted({
        variables: {
          input: {
            orgId,
            limit: LIMIT,
            offset: completedListData?.getCompletedCmtyPaymentsForOrg?.length,
          },
        },
      });
      const completedPayments = data?.getCompletedCmtyPaymentsForOrg;
      return setHasMore(completedPayments?.length >= LIMIT);
    }
    if (paymentView === "processing") {
      const { data } = await fetchMoreProcessing({
        variables: {
          input: {
            orgId,
            limit: LIMIT,
            offset: processingListData?.getProcessingCmtyPaymentsForOrg?.length,
          },
        },
      });
      const processingPayments = data?.getProcessingCmtyPaymentsForOrg;
      return setHasMore(processingPayments?.length >= LIMIT);
    }
  };
  const handleFetchMore = () => {
    if (questId) {
      return handleQuestFetchMore();
    }
    return handleOrgFetchMore();
  };

  const items = useMemo(() => {
    if (paymentView === "unpaid") {
      return questId ? unpaidQuestData?.getUnpaidCmtyPaymentsForQuest : unpaidListData?.getUnpaidCmtyPaymentsForOrg;
    }
    if (paymentView === "processing") {
      return questId
        ? processingQuestData?.getProcessingCmtyPaymentsForQuest
        : processingListData?.getProcessingCmtyPaymentsForOrg;
    }
    return questId ? paidQuestData?.getPaidCmtyPaymentsForQuest : completedListData?.getCompletedCmtyPaymentsForOrg;
  }, [
    unpaidListData,
    paymentView,
    processingListData,
    completedListData,
    paidQuestData,
    unpaidQuestData,
    processingQuestData,
    questId,
  ]);

  const batchPaymentData = questId
    ? unpaidQuestData?.getUnpaidCmtyPaymentsForQuest
    : unpaidListData?.getUnpaidCmtyPaymentsForOrg;

  const togglePaymentView = async (value) => {
    setPaymentView(value);
    if (value === "paid") {
      return handlePaidPaymentsFetch();
    }

    if (value === "unpaid") {
      return handleUnpaidPaymentsFetch();
    }
    if (value === "processing") {
      return handleProcessingPaymentsFetch();
    }
  };

  return {
    hasMore,
    hasLength,
    paymentView,
    items,
    batchPaymentData,
    setPaymentView,
    handleFetchMore,
    togglePaymentView,
  };
};

export const useTableComponents = ({
  paymentView,
  items,
  selectedPayments,
  tokenIds,
  updatePaymentList,
  setTokenIds,
}) => {
  if (paymentView === "unpaid") {
    return items?.map((payment) => {
      return {
        id: payment.id,
        selector: {
          component: "custom",
          value: payment.id,
          tableStyle: {
            width: "1%",
          },
          customComponent: () => (
            <PaymentSelector
              paymentData={{
                chain: payment.chain,
                amount: payment.amount,
                currency: payment.tokenName,
                recipient: payment.recipientAddress,
                contractAddress: payment.contractAddress,
                decimal: payment.decimal,
                id: payment.id,
                contractType: payment.contractType,
              }}
              tokenId={tokenIds[payment.id]}
              withPaymentButton
              isChecked={selectedPayments.includes(payment.id)}
              updatePaymentList={updatePaymentList}
            />
          ),
        },
        name: {
          component: "custom",
          tableStyle: {
            width: "1%",
          },
          value: {
            discordUsername: payment.discordUsername,
            discordAvatarUrl: payment.profilePicture,
            address: payment.recipientAddress,
          },
          customComponent: ({ value }) => <UserInfo {...value} />,
        },
        reward: {
          component: "label",
          value: `${payment.amount} ${payment.tokenName}`,
          componentProps: {
            fontWeight: 500,
          },
        },
        chain: {
          component: "custom",
          value: payment.chain,
          customComponent: ({ value }) => <ChainInfo chain={value} />,
        },
        tokenId: {
          component: "custom",
          value: payment.id,
          customComponent: () => <TokenIdSelect payment={payment} setTokenIds={setTokenIds} />,
        },
        questName: {
          component: "label",
          value: payment.questTitle,
          componentProps: {
            fontWeight: 500,
          },
        },
        date: {
          component: "label",
          value: moment(payment.submissionApprovedAt).format(MONTH_DAY_FULL_YEAR),
          componentProps: {
            fontWeight: 500,
          },
        },
      };
    });
  }
  return items?.map((payment) => {
    const link = constructExplorerRedirectUrl(payment.chain, payment.txHash);
    return {
      id: payment.id,
      name: {
        component: "custom",
        value: {
          discordUsername: payment.discordUsername,
          discordAvatarUrl: payment.profilePicture,
          address: payment.recipientAddress,
        },
        tableStyle: {
          width: "1%",
        },
        customComponent: ({ value }) => (
          <UserInfo
            {...value}
            renderCheckbox={() => (
              <StyledCheckbox
                checked={selectedPayments.includes(payment.id)}
                onChange={(e) => updatePaymentList(payment.id, e.target.checked)}
              />
            )}
          />
        ),
      },
      reward: {
        component: "label",
        value: `${payment.amount} ${payment.tokenName}`,
        componentProps: {
          fontWeight: 500,
        },
      },
      chain: {
        component: "custom",
        value: payment.chain,
        customComponent: ({ value }) => <ChainInfo chain={value} />,
      },
      link: {
        component: "link",
        value: link,
      },
      questName: {
        component: "label",
        value: payment.questTitle,
        componentProps: {
          fontWeight: 500,
        },
      },
      date: {
        component: "label",
        value: moment(payment.submissionApprovedAt).format(MONTH_DAY_FULL_YEAR),
        componentProps: {
          fontWeight: 500,
        },
      },
    };
  });
};
