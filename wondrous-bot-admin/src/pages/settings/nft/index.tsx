import CreateNFTComponent from "components/NFT/CreateComponent";
import NFTList from "components/NFT/List";
import SettingsLayout from "components/Shared/SettingsLayout";
import { SharedSecondaryButton } from "components/Shared/styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CommunityNFTSettingsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const toggleModal = () => setIsCreateModalOpen((prev) => !prev);

  return (
    <>
      {isCreateModalOpen ? <CreateNFTComponent handleClose={toggleModal} /> : null}
      <SettingsLayout
        title="Community NFTs"
        headerProps={{
          renderActions: () => <SharedSecondaryButton onClick={toggleModal}>Create New</SharedSecondaryButton>,
        }}
      >
        <NFTList />
      </SettingsLayout>
    </>
  );
};

export default CommunityNFTSettingsPage;
