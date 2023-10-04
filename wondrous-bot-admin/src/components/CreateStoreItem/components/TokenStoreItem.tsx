import { useLazyQuery } from "@apollo/client";
import { Box } from "@mui/material";
import { TokenComponent } from "components/CreateTemplate/RewardUtils";
import { PoapImage } from "components/CreateTemplate/styles";
import { PoapIcon } from "components/Icons/Rewards";
import SelectComponent from "components/Shared/Select";
import { GET_COMMUNITY_NFTS_FOR_ORG } from "graphql/queries";
import { useContext, useEffect, useMemo } from "react";
import CreateQuestContext from "utils/context/CreateQuestContext";
import { useGlobalContext } from "utils/hooks";

const TokenStoreItem = ({ setStoreItemData, storeItemData }) => {
  const { errors, setErrors } = useContext(CreateQuestContext);
  const { activeOrg } = useGlobalContext();
  const [getCommunityNFTsForOrg, { data, loading }] = useLazyQuery(GET_COMMUNITY_NFTS_FOR_ORG, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (activeOrg?.id && !data && !loading) {
      getCommunityNFTsForOrg({
        variables: {
          orgId: activeOrg?.id,
        },
      }).then(({ data }) => {
        if (storeItemData?.config?.nftMetadataId && !storeItemData?.mediaUploads?.length) {
          const option = data?.getCommunityNFTsForOrg?.find((item) => item.id === storeItemData?.config?.nftMetadataId);
          setStoreItemData((prev) => ({
            ...prev,
            mediaUploads: [
              {
                slug: option?.mediaUrl,
              },
            ],
          }));
        }
      });
    }
  }, [activeOrg?.id, data, loading, storeItemData]);

  const options = useMemo(() => {
    if (!data?.getCommunityNFTsForOrg) return null;

    return data?.getCommunityNFTsForOrg.map((item, idx) => ({
      label: item.name,
      value: item.id,
      icon: (
        <Box display="flex" marginRight="8px">
          <PoapImage src={item?.mediaUrl} />
        </Box>
      ),
    }));
  }, [data?.getCommunityNFTsForOrg]);

  const handleChange = (value) => {
    const option = data?.getCommunityNFTsForOrg?.find((item) => item.id === value);

    setErrors((prev) => ({
      ...prev,
      nftMetadataId: null,
    }));

    setStoreItemData((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        nftMetadataId: value,
      },
      mediaUploads: [
        {
          slug: option?.mediaUrl,
        },
      ],
    }));
  };

  return (
    <SelectComponent
      error={errors["nftMetadataId"]}
      options={options}
      value={storeItemData?.config?.nftMetadataId}
      onChange={handleChange}
    />
  );
};

export default TokenStoreItem;
