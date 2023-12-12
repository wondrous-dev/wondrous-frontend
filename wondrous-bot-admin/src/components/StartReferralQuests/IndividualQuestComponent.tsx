import { Typography, Divider, Box, Grid } from "@mui/material";
import { CardHoverWrapper, CardWrapper, Label } from "components/QuestsList/styles";
import { SharedSecondaryButton } from "components/Shared/styles";
import { Reward } from "components/ViewQuestResults/ViewRewards";
import { constructRewards } from "utils/common";

const IndividualQuestComponent = ({ quest, onStartQuest }) => {
  const rewardsValue = constructRewards({ rewards: quest?.rewards || [] });

  return (
    <>
      <CardHoverWrapper width="100%" height="100%" flex={1}>
        <CardWrapper
          item
          sx={{
            border: "1px solid black",
            padding: "24px 14px !important",
          }}
        >
          <Label
            fontSize="15px"
            style={{
              textAlign: "center",
              overflowWrap: "anywhere",
            }}
          >
            {quest?.title}
          </Label>
          <Typography fontFamily="Poppins" fontWeight={500} fontSize="14px" color="#626262">
            {quest?.description}
          </Typography>
          <Divider style={{ backgroundColor: "#F5F5F5" }} />
          <Box display="flex" gap="14px" alignItems="center" justifyContent="center" flexDirection="column">
            {rewardsValue?.length ? (
              <>
                <Typography fontFamily="Poppins" fontSize="13px" color="black" fontWeight={500}>
                  Quest Rewards
                </Typography>
                <Grid container alignItems="center" gap="14px" flex="1" justifyContent="center">
                  {rewardsValue.map(Reward)}
                </Grid>
              </>
            ) : null}
            <SharedSecondaryButton onClick={() => onStartQuest(quest?.id)}>Start Quest</SharedSecondaryButton>
          </Box>
        </CardWrapper>
      </CardHoverWrapper>
    </>
  );
};

export default IndividualQuestComponent;
