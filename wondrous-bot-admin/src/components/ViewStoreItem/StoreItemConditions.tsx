import { useQuery } from "@apollo/client";
import { StyledViewQuestResults } from "components/ViewQuestResults/styles";
import { GET_ORG_DISCORD_ROLES } from "graphql/queries";
import { useMemo } from "react";
import { getTextForCondition } from "utils/common";
import { CONDITION_TYPES } from "utils/constants";
import useLevels from "utils/levels/hooks";

const StoreItemConditions = ({ storeItemData, discordData }) => {
  const fetchConditions = useMemo(() => {
    return {
      shouldFetchLevels: storeItemData?.conditions?.some((condition) => condition.type === CONDITION_TYPES.LEVEL),
      shouldFetchDiscord: storeItemData?.conditions?.some(
        (condition) => condition.type === CONDITION_TYPES.DISCORD_ROLE
      ),
    };
  }, [storeItemData?.conditions]);

  // const { data, loading } = useQuery(GET_ORG_DISCORD_ROLES, {
  //   variables: {
  //     orgId: storeItemData?.orgId,
  //   },
  //   skip: !fetchConditions.shouldFetchDiscord,
  //   // skip: !storeItemData || storeItemData?.type !== STORE_ITEM_TYPES.DISCORD_ROLE,
  // });

  const { levels, loading: levelsLoading } = useLevels({
    orgId: storeItemData?.orgId,
    shouldFetch: fetchConditions.shouldFetchLevels,
  });

  const getNameForCondition = (condition) => {
    if (condition.type === CONDITION_TYPES.DISCORD_ROLE) {
      const allRoles = discordData?.map((role) => role.roles).flat();
      return allRoles.find((item) => item.id === condition.conditionData?.discordRoleId)?.name;
    }
    if (condition.type === CONDITION_TYPES.LEVEL) {
      return levels[condition.conditionData?.minLevel];
    }
    return null;
  };

  const conditionTexts = useMemo(() => {
    const conditions = storeItemData?.conditions?.map((condition) => {
      return getTextForCondition({
        type: condition.type,
        name: getNameForCondition(condition),
      });
    });
    return conditions;
  }, [storeItemData?.conditions, discordData, levels, fetchConditions, getNameForCondition]);

  if (!conditionTexts?.length)
    return (
      <StyledViewQuestResults
        style={{
          position: "relative",
        }}
      >
        None
      </StyledViewQuestResults>
    );
    
  return (
    <>
      {conditionTexts?.map((condition, idx) => {
        return (
          <StyledViewQuestResults
            key={idx + "condition"}
            style={{
              position: "relative",
            }}
          >
            {condition}
          </StyledViewQuestResults>
        );
      })}
    </>
  );
};
export default StoreItemConditions;
