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
      outlineColor="transparent"
      color="#828282"
      style={{
        position: "relative",
      }}
    >
      No
    </StyledViewQuestResults>
  );

const Settings = ({ quest, idx, settingsLayout }) => {
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
        {quest.type == "titleOrDescription" ? (
          <StyledViewQuestResults
            bgcolor="#F7F7F7"
            outlineColor="transparent"
            style={{
              position: "relative",
            }}
          >
            {quest.value ? (
              <Typography color="#000" fontSize="15px" fontWeight="500" padding="6px" fontFamily="Poppins">
                {quest.value}
              </Typography>
            ) : (
              <Typography color="#828282" fontSize="15px" fontWeight="500" padding="6px" fontFamily="Poppins">
                No description
              </Typography>
            )}
          </StyledViewQuestResults>
        ) : null}
        {quest.type === "level" ? (
          <Grid
            container
            item
            position="relative"
            justifyContent="center"
            alignItems="center"
            width="fit-content"
            height="fit-content"
            lineHeight="0"
          >
            <Typography
              position="absolute"
              top="50%"
              color="#000"
              zIndex="10"
              lineHeight="0"
              fontFamily="Poppins"
              fontWeight="500"
            >
              {quest.value}
            </Typography>
            <Box position="relative">
              <Hexagon />
            </Box>
          </Grid>
        ) : null}
        {quest.type === "boolean" ? getBooleanText(quest.value) : null}
        {quest.type === "questConditions" && (
          <>
            {quest?.value?.map((condition, idx) => {
              return (
                <StyledViewQuestResults
                  style={{
                    position: "relative",
                  }}
                >
                  {condition}
                </StyledViewQuestResults>
              );
            })}
          </>
        )}
        {quest.type === "text" ? (
          <StyledViewQuestResults
            style={{
              position: "relative",
            }}
          >
            {quest.value}
          </StyledViewQuestResults>
        ) : null}
        {quest.label === "Max Submissions" && (
          <StyledInformationTooltip
            placement="right"
            title="The maximum number of approved submissions each user can submit for this quest"
          >
            <img
              src={InformationTooltip}
              alt="information"
              style={{
                width: "16px",
                height: "16px",
              }}
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
              style={{
                width: "16px",
                height: "16px",
              }}
            />
          </StyledInformationTooltip>
        )}
      </Grid>
    </Grid>
  );
};

const ViewCampaignOverview = ({ sections }) => {
  return (
    <>
      {sections.map(({ settings, settingsLayout, showBorder = true }) => {
        return (
          <Grid container gap="14px" {...(showBorder && { paddingBottom: "14px", borderBottom: "1px solid #E8E8E8" })}>
            {settings?.map((quest, idx) => (
              <Settings quest={quest} idx={idx} settingsLayout={settingsLayout} />
            ))}
          </Grid>
        );
      })}
    </>
  );
};

export default ViewCampaignOverview;
