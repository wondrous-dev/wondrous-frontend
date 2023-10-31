import { Box, Grid, Typography } from "@mui/material";
import { Label } from "components/CreateTemplate/styles";
import Hexagon from "components/Icons/Hexagon";
import InformationTooltip from "components/Icons/information.svg";
import { StyledInformationTooltip } from "components/Shared/Tooltip";
import { StyledViewQuestResults } from "./styles";

const getBooleanText = (value) =>
  value ? (
    <StyledViewQuestResults
      style={{
        position: "relative",
      }}
    >
      Yes
    </StyledViewQuestResults>
  ) : (
    <StyledViewQuestResults
      bgcolor="#E8E8E8"
      $outlineColor="transparent"
      color="#828282"
      style={{
        position: "relative",
      }}
    >
      No
    </StyledViewQuestResults>
  );

  const Settings = ({ quest, idx, settingsLayout }) => {
    const renderQuestComponents = {
      titleOrDescription: () => (
        <StyledViewQuestResults bgcolor="#F7F7F7" $outlineColor="transparent" style={{ position: "relative" }}>
          <Typography color={quest.value ? "#000" : "#828282"} fontSize="15px" fontWeight="500" padding="6px" fontFamily="Poppins">
            {quest.value || 'No description'}
          </Typography>
        </StyledViewQuestResults>
      ),
      level: () => (
        <Grid container item position="relative" justifyContent="center" alignItems="center" width="fit-content" height="fit-content" lineHeight="0">
          <Typography position="absolute" top="50%" color="#000" zIndex="10" lineHeight="0" fontFamily="Poppins" fontWeight="500">
            {quest.value}
          </Typography>
          <Box position="relative">
            <Hexagon />
          </Box>
        </Grid>
      ),
      boolean: () => getBooleanText(quest.value),
      questConditions: () => (
        <>
          {quest?.value?.map((condition, conditionIdx) => (
            <StyledViewQuestResults key={conditionIdx + "condition"} style={{ position: "relative" }}>
              {condition}
            </StyledViewQuestResults>
          ))}
        </>
      ),
      text: () => (
        <StyledViewQuestResults style={{ position: "relative" }}>
          {quest.value}
        </StyledViewQuestResults>
      ),
      custom: () => quest.customComponent(),
    };
  
    const renderTooltip = (label, title) => (
      <StyledInformationTooltip placement="right" title={title}>
        <img src={InformationTooltip} alt="information" style={{ width: "16px", height: "16px" }} />
      </StyledInformationTooltip>
    );
  
    const tooltipConfig = {
      "Max Submissions": "The maximum number of approved submissions each user can submit for this quest",
      "Max Purchases": "The maximum number of times a user can purchase this item",
      "Max Approvals": "The total number of approved submissions allowed for this quest",
      "Require Review": "If enabled, all submissions will require review before being approved",
    };
  
    return (
      <Grid
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        width="100%"
        key={idx + "quest"}
        {...settingsLayout}
        style={{
          ...(quest.type === "questConditions" && {
            alignItems: "baseline",
          }),
        }}
      >
        <Label>{quest.label}</Label>
        <Grid container flex="1" alignItems="center" gap="8px">
          {renderQuestComponents[quest.type]?.()}
          {tooltipConfig[quest.label] && renderTooltip(quest.label, tooltipConfig[quest.label])}
        </Grid>
      </Grid>
    );
  };
  
const ViewCampaignOverview = ({ sections }) => {
  return (
    <>
      {sections.map(({ settings, settingsLayout, showBorder = true }, key) => {
        return (
          <Grid container gap="14px" {...(showBorder && { paddingBottom: "14px", borderBottom: "1px solid #E8E8E8" })} key={`section-${key}`}>
            {settings?.map((quest, idx) => (
              <Settings quest={quest} idx={idx} settingsLayout={settingsLayout} key={`setting-${idx}`}/>
            ))}
          </Grid>
        );
      })}
    </>
  );
};

export default ViewCampaignOverview;
