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

const TokenStoreItem = ({ onChange, value, postInitialFetch = null, key = null, errors = null, setErrors = null }) => {
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
        postInitialFetch?.(data);
      });
    }
  }, [activeOrg?.id, data, loading]);

  const toggleCreateModal = () => setIsAddModalOpen((prev) => !prev);

  const items = useMemo(() => {
    if (!data?.getCommunityNFTsForOrg)
      return {
        options: [],
        groupedOptions: [],
      };
    const communityNFTItems = data?.getCommunityNFTsForOrg.map((item, idx) => ({
      label: item.name,
      value: item.id,
      tokenId: item.tokenId,
      icon: (
        <Box display="flex" marginRight="8px">
          <PoapImage src={item?.mediaUrl} />
        </Box>
      ),
    }));

    const group1 = communityNFTItems?.filter((item) => item.tokenId);
    const group2 = communityNFTItems?.filter((item) => !item.tokenId);
    const options = [
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
      ...communityNFTItems,
    ];

    const groupedOptions = [
      {
        groupName: null,
        items: [
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
        ],
      },
      {
        groupName: group1?.length ? "Created NFT" : null,
        items: group1,
      },
      {
        groupName: group2?.length ? "Imported NFT" : null,
        items: group2,
      },
    ];
    return {
      options,
      groupedOptions,
    };
  }, [data?.getCommunityNFTsForOrg, toggleCreateModal]);

  const handleCreateNFT = (createdNft) => {
    setErrors?.((prev) => ({
      ...prev,
      [key]: null,
    }));
    onChange(createdNft);
  };

  const handleChange = (value) => {
    if (value === "add-nft") return;
    const option = data?.getCommunityNFTsForOrg?.find((item) => item.id === value);

    setErrors?.((prev) => ({
      ...prev,
      [key]: null,
    }));

    onChange(option);
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
      {modalType?.isImportModalOpen ? (
        <ImportComponent handleClose={handleNFTModalClose} onSuccess={handleCreateNFT} />
      ) : null}
      {modalType?.isImportModalOpen || modalType?.isCreateModalOpen ? null : (
        <SelectComponent
          error={errors?.[key]}
          groupedOptions={items.groupedOptions}
          options={items.options}
          value={value}
          onChange={handleChange}
          grouped

        />
      )}
    </>
  );
};

export default TokenStoreItem;
