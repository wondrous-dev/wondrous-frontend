import { useLazyQuery } from "@apollo/client";
import { GET_CMTY_PAYMENT_METHODS_FOR_ORG } from "graphql/queries";
import { useEffect, useMemo } from "react";
import { useGlobalContext } from "utils/hooks";

export const DEFAULT_QUEST_SETTINGS_STATE_VALUE = {
  title: "New Quest",
  description: "",
  level: "1",
  timeBound: false,
  maxSubmission: 1,
  maxApproval: null,
  requireReview: false,
  isActive: false,
  isOnboarding: false,
  startAt: null,
  endAt: null,
  questConditions: [],
  submissionCooldownPeriod: null,
  category: null,
  rewards: [
    {
      value: 0,
      type: "points",
    },
  ],
};

export const useCommunityBadgePaymentMethods = ({shouldFetch, asOptions = false}) => {
  const {activeOrg} = useGlobalContext();
  const [getCmtyPaymentForOrg, {data, refetch}] = useLazyQuery(GET_CMTY_PAYMENT_METHODS_FOR_ORG, {
    notifyOnNetworkStatusChange: true,
  })

  useEffect(() => {
    if(activeOrg?.id && shouldFetch) {
      getCmtyPaymentForOrg({
        variables: {
          orgId: activeOrg?.id,
          types: ['COMMUNITY_BADGE', 'ERC721', 'ERC1155']
        }
      })
    }
  }, [activeOrg?.id, shouldFetch])

  const options = useMemo(() => {
    if(!asOptions || !data?.getCmtyPaymentMethodsForOrg) return [];

    return data?.getCmtyPaymentMethodsForOrg?.map((item, idx) =>({
      nftMetadataId: item.nftMetadataId,
      label: item.name,
      value: item.id,
      mediaUrl: item.nftMetadata?.mediaUrl,
      icon: <img src={item.nftMetadata?.mediaUrl} style={{
        height: '18px',
        width: '18px'
      }}/>,
    }));

  }, [asOptions, data?.getCmtyPaymentMethodsForOrg]);
  return {
    data: data?.getCmtyPaymentMethodsForOrg,
    options,
    refetch
  }
};  