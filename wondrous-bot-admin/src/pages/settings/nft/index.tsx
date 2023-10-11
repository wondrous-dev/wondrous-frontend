import { Box } from "@mui/material";
import CreateNFTComponent from "components/NFT/CreateComponent";
import ImportComponent from "components/NFT/ImportComponent";
import NFTList from "components/NFT/List";
import SettingsLayout from "components/Shared/SettingsLayout";
import { SharedSecondaryButton } from "components/Shared/styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CommunityNFTSettingsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const toggleCreateModal = () => setIsCreateModalOpen((prev) => !prev);

  const toggleImportModal = () => setIsImportModalOpen((prev) => !prev);

  return (
    <>
      {isImportModalOpen ? <ImportComponent handleClose={toggleImportModal} /> : null}
      {isCreateModalOpen ? <CreateNFTComponent handleClose={toggleCreateModal} /> : null}
      <SettingsLayout
        title="Community NFTs"
        headerProps={{
          renderActions: () => (
            <Box display="flex" gap="8px" alignItems="center">
              <SharedSecondaryButton onClick={toggleImportModal}>Import NFT</SharedSecondaryButton>

              <SharedSecondaryButton onClick={toggleCreateModal}>Create New</SharedSecondaryButton>
            </Box>
          ),
        }}
      >
        <NFTList />
      </SettingsLayout>
    </>
  );
};

export default CommunityNFTSettingsPage;
