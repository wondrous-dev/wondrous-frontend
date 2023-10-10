import { useLazyQuery } from "@apollo/client";
import { Box, ButtonBase, Grid } from "@mui/material";
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
import Modal from "components/Shared/Modal";
import { SharedSecondaryButton } from "components/Shared/styles";
import { Label } from "components/QuestsList/styles";
import ImportComponent from "components/NFT/ImportComponent";

const NFT_MODAL_TYPES = {
  CREATE: "create",
  IMPORT: "import",
};

const TokenStoreItem = ({ setStoreItemData, storeItemData }) => {
  const { errors, setErrors } = useContext(CreateQuestContext);
  const { activeOrg } = useGlobalContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [nftModalType, setNftModalType] = useState(null);
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

  const toggleCreateModal = () => setIsAddModalOpen((prev) => !prev);

  const options = useMemo(() => {
    if (!data?.getCommunityNFTsForOrg) return null;

    return [
      {
        label: "Add NFT",
        value: "add-nft",
        onClick: () => toggleCreateModal(),
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
  }, [data?.getCommunityNFTsForOrg, toggleCreateModal]);

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
    if (value === "add-nft") return;
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

  const modalType = useMemo(() => {
    return {
      isCreateModalOpen: nftModalType === NFT_MODAL_TYPES.CREATE,
      isImportModalOpen: nftModalType === NFT_MODAL_TYPES.IMPORT,
    };
  }, [nftModalType]);

  const handleNFTModalClose = () => {
    setNftModalType(null);
  };

  const onModalSelect = (type) => {
    setNftModalType(type);
    setIsAddModalOpen(false);
  };
  return (
    <>
      <Modal
        maxWidth={640}
        open={isAddModalOpen}
        onClose={toggleCreateModal}
        title="Community NFT"
        modalFooterStyle={{
          padding: "0px",
        }}
      >
        <Grid display="flex" width="100%" gap="18px" alignItems="center" justifyContent="center">
          <SharedSecondaryButton onClick={() => onModalSelect(NFT_MODAL_TYPES.CREATE)}>
            Create NFT
          </SharedSecondaryButton>
          <SharedSecondaryButton onClick={() => onModalSelect(NFT_MODAL_TYPES.IMPORT)} $reverse>
            Import NFT
          </SharedSecondaryButton>
        </Grid>
      </Modal>
      {modalType?.isCreateModalOpen ? (
        <CreateNFTComponent handleClose={handleNFTModalClose} onSuccess={handleCreateNFT} />
      ) : null}
      {modalType?.isImportModalOpen ? <ImportComponent handleClose={handleNFTModalClose} 
      onSuccess={handleCreateNFT}
      /> : null}
      {modalType?.isImportModalOpen || modalType?.isCreateModalOpen ? null : (
        <SelectComponent
          error={errors["nftMetadataId"]}
          options={options}
          value={storeItemData?.config?.nftMetadataId}
          onChange={handleChange}
        />
      )}
    </>
  );
};

export default TokenStoreItem;
