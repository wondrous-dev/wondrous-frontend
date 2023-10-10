import { useLazyQuery } from "@apollo/client";
import { Box } from "@mui/material";
import { TokenComponent } from "components/CreateTemplate/RewardUtils";
import { PoapImage } from "components/CreateTemplate/styles";
import { PoapIcon } from "components/Icons/Rewards";
import SelectComponent from "components/Shared/Select";
import { GET_COMMUNITY_NFTS_FOR_ORG } from "graphql/queries";
import { useContext, useEffect, useMemo, useState } from "react";
import CreateQuestContext from "utils/context/CreateQuestContext";
import { useGlobalContext } from "utils/hooks";
import AddIcon from "@mui/icons-material/Add";
import CreateNFTComponent from "components/NFT/CreateComponent";

const TokenStoreItem = ({ setStoreItemData, storeItemData }) => {
  const { errors, setErrors } = useContext(CreateQuestContext);
  const { activeOrg } = useGlobalContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

    return [
      {
        label: "Add NFT",
        value: "add-nft",
        icon: (
          <AddIcon
            sx={{
              color: "black",
            }}
          />
        ),
      },
      ...data?.getCommunityNFTsForOrg.map((item, idx) => ({
        label: item.name,
        value: item.id,
        icon: (
          <Box display="flex" marginRight="8px">
            <PoapImage src={item?.mediaUrl} />
          </Box>
        ),
      })),
    ];
  }, [data?.getCommunityNFTsForOrg]);

  const toggleCreateModal = () => setIsAddModalOpen((prev) => !prev);

  const handleCreateNFT = (createdNft) => {
    setErrors((prev) => ({
      ...prev,
      nftMetadataId: null,
    }));
    setStoreItemData((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        nftMetadataId: createdNft?.id,
      },
      mediaUploads: [
        {
          slug: createdNft?.mediaUrl,
        },
      ],
    }));
  };

  const handleChange = (value) => {
    if (value === "add-nft") return toggleCreateModal();
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
    <>
      {isAddModalOpen ? <CreateNFTComponent handleClose={toggleCreateModal} onSuccess={handleCreateNFT} /> : null}

      <SelectComponent
        error={errors["nftMetadataId"]}
        options={options}
        value={storeItemData?.config?.nftMetadataId}
        onChange={handleChange}
      />
    </>
  );
};

export default TokenStoreItem;
