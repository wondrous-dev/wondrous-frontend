import { TokenComponent } from "components/CreateTemplate/RewardUtils";
import { useContext } from "react";
import CreateQuestContext from "utils/context/CreateQuestContext";

const TokenStoreItem = ({ setStoreItemData, storeItemData }) => {
  const { errors, setErrors } = useContext(CreateQuestContext);
  const handleTokenReward = (values) => {
    setErrors(prev => ({
      ...prev,
      tokenInfo: null
    }))
    const newConfig = {
      ...storeItemData.config,
      tokenInfo: {
        ...storeItemData.config.tokenInfo,
        ...values,
      },
    };
    setStoreItemData((prev) => ({
      ...prev,
      config: newConfig,
    }));
  };

  return (
    <TokenComponent
      withAmount={false}
      addPaymentMethod
      options={[
        { label: "ERC721", value: "erc721" },
        { label: "ERC1155", value: "erc1155" },
      ]}
      setTokenReward={handleTokenReward}
      tokenReward={storeItemData?.config?.tokenInfo || {}}
      errors={errors?.tokenInfo}
    />
  );
};

export default TokenStoreItem;
