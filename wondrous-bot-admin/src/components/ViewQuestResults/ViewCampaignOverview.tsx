import { Grid, Tooltip } from "@mui/material";
import { Label } from "components/CreateTemplate/styles";
import InformationTooltip from "components/Icons/information.svg";
import { StyledViewQuestResults } from "./styles";
import { StyledInformationTooltip } from "components/Shared/Tooltip";

const getBooleanText = (value) => (value ? "Yes" : "No");

const ViewCampaignOverview = ({ questSettings }) => {
  return (
    <>
      {questSettings?.map((quest, idx) => {
        return (
          <Grid
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            width="100%"
            key={idx + "quest"}
            gap="10%"
          >
            <Label>{quest.label}</Label>
            {quest.type !== "rewards" ? (
              <>
                <StyledViewQuestResults
                  style={{
                    position: "relative",
                  }}
                >
                  {quest.type === "boolean" ? getBooleanText(quest.value) : null}
                  {quest.type === "text" ? quest.value : null}
                  {quest.label === "Max Submissions" && (
                    <StyledInformationTooltip
                      placement="right"
                      title="The maximum number of approved submissions each user can submit for this quest"
                    >
                      <img
                        src={InformationTooltip}
                        alt="information"
                        style={{ width: "16px", height: "16px", marginLeft: "8px", position: "absolute", right: -26 }}
                      />
                    </StyledInformationTooltip>
                  )}
                  {quest.label === "Max Approvals" && (
                    <StyledInformationTooltip
                      placement="right"
                      title="The total number of approved submissions allowed for this quest"
                    >
                      <img
                        src={InformationTooltip}
                        alt="information"
                        style={{ width: "16px", height: "16px", marginLeft: "8px", position: "absolute", right: -26 }}
                      />
                    </StyledInformationTooltip>
                  )}
                </StyledViewQuestResults>
              </>
            ) : null}
            {quest.type === 'rewards'
              ? <Grid display="flex" gap="6px" flexWrap="wrap">
                {quest.value.map((reward, key) => (
                  <StyledViewQuestResults $isReward key={key + 'reward'}>
                    {reward.value} {reward.type}
                  </StyledViewQuestResults>
                ))}
                </Grid>
              : null}
          </Grid>
        );
      })}
    </>
  );
};

export default ViewCampaignOverview;
