import { Box } from "@mui/material";
import { StyledViewQuestResults } from "components/ViewQuestResults/styles";
import { useEffect, useState } from "react";
import { getNameForCondition, getTextForCondition } from "utils/common";
import { TextLabel } from "../styles";

const ViewQuestConditions = ({ conditions, orgId, conditionLogic }) => {
  const [questSettingsConditions, setQuestSettingsConditions] = useState([]);

  const setQuestConditionsAsync = async (questConditions) => {
    const results = await Promise.all(
      questConditions.map(async (item) => {
        const result = await getNameForCondition(item, orgId);
        return {
          type: item?.type,
          questId: item?.conditionData?.questId,
          name: getTextForCondition({
            type: item?.type,
            name: result,
            exclusiveQuest: item?.conditionData?.exclusiveQuest,
          }),
        };
      })
    );
    setQuestSettingsConditions(results);
  };

  useEffect(() => {
    if (conditions?.length > 0 && conditions?.length !== questSettingsConditions?.length) {
      setQuestConditionsAsync(conditions);
    }
  }, [conditions?.length]);

  console.log(questSettingsConditions);
  if (!conditions?.length) return null;

  const Wrapper = ({ conditionType, questId, children }) => {
    if (conditionType === "quest" && questId) {
      return <a href={`/quests/view/${questId}`}>{children}</a>;
    }
    return <>{children}</>;
  };
  return (
    <Box display="flex" gap="16px" paddingY="16px" flexDirection="column" alignItems="center" justifyContent="center">
      <TextLabel>{conditionLogic === 'and' ? 'All requirements must be fulfilled' : 'Complete at least one requirement to proceed'}</TextLabel>

      <Box display="flex" gap="8px" alignItems="center" flexWrap="wrap" justifyContent="center">
        {questSettingsConditions?.map((condition, idx) => {
          return (
            <Wrapper conditionType={condition.type} questId={condition.questId}>
              <StyledViewQuestResults
                key={idx + "condition"}
                style={{
                  position: "relative",
                }}
              >
                {condition.name}
              </StyledViewQuestResults>
            </Wrapper>
          );
        })}
      </Box>
    </Box>
  );
};

export default ViewQuestConditions;
