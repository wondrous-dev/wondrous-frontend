import { Grid, Box, Typography, ButtonBase } from "@mui/material";
import { CardHoverWrapper, CardWrapper, Label } from "components/QuestsList/styles";
import { CloseIcon } from "components/Shared/DatePicker/Shared/Icons";
import { OrgProfilePicture } from "components/Shared/ProjectProfilePicture";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import ViewRewards, { Reward } from "components/ViewQuestResults/ViewRewards";
import { useState } from "react";
import { constructRewards } from "utils/common";

const QuestCard = ({ quest }) => {
  const rewardsValue = constructRewards({ rewards: quest?.rewards || [] });

  return (
    <CardHoverWrapper
      width="100%"
      height="100%"
      // onClick={() => navigate(`/quests/${item.id}`)}
      flex={1}
      flexBasis={{
        xs: "48%",
        sm: "30%",
        md: "24%",
      }}
      maxWidth={{
        xs: "50%",
        sm: "33%",
        md: "24%",
      }}
    >
      <CardWrapper item>
        <Box
          height="40px"
          width="auto"
          minWidth="40px"
          bgcolor="#84bcff"
          borderRadius="35px"
          display="flex"
          padding="4px"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Label>{quest?.title}</Label>
          <Typography>{quest?.description}</Typography>
          <Divider />
          <Box display="flex" gap="14px" alignItems="center" justifyContent="center" flexDirection="column">
            <Typography fontFamily="Poppins" fontSize="13px" color="black" fontWeight={500}>
              Quest Rewards
            </Typography>
            <Grid container alignItems="center" gap="14px" flex="1" justifyContent="center">
              {rewardsValue.map(Reward)}
            </Grid>
          </Box>
        </Box>
      </CardWrapper>
    </CardHoverWrapper>
  );
};

const ViewRefferal = ({ referralCampaign }) => {
  const org = referralCampaign?.org;
  const [isReffererView, setIsReffererView] = useState(true);

  const rewardsValue = constructRewards({ rewards: referralCampaign?.rewards || [] });

  return (
    <>
      {isReffererView ? (
        <Box
          display="flex"
          padding="13px 14px"
          flex="1 0 0"
          top="100px"
          zIndex="10"
          width="calc(100% - 56px)"
          position="fixed"
          alignItems="center"
          justifyContent="space-between"
          alignSelf="stretch"
          borderRadius="12px"
          border="1px solid #2A8D5C"
          bgcolor="#d0e1d6"
        >
          <Box />
          <Typography color="black" fontSize="14px" fontFamily="Poppins" fontWeight={500}>
            {<strong>{referralCampaign?.creator?.firstName}</strong>} referred you, complete the quests below!
          </Typography>
          <ButtonBase onClick={() => setIsReffererView(false)}>
            <CloseIcon />
          </ButtonBase>
        </Box>
      ) : null}

      <Grid
        display="flex"
        flexDirection="column"
        gap="24px"
        // paddingTop="116px"
        justifyContent="center"
        alignItems="center"
      >
        <Box display="flex" flexDirection="column" gap="11px" justifyContent="center" alignItems="center">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            border="2px solid #000000"
            borderRadius="100%"
            padding="2px"
            position="relative"
          >
            <OrgProfilePicture
              profilePicture={org?.profilePicture}
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "100%",
              }}
            />
          </Box>
        </Box>
        <Typography fontWeight={600} fontFamily="Poppins" fontSize="22px" color="black">
          {org?.name}
        </Typography>
        {org.description ? (
          <Typography fontWeight={500} fontFamily="Poppins" fontSize="17" color="#626262" textAlign="center">
            {org?.description}
          </Typography>
        ) : null}
        {referralCampaign?.rewards?.length ? (
          <Box display="flex" gap="14px" alignItems="center" justifyContent="center" flexDirection="column">
            <Typography fontFamily="Poppins" fontSize="13px" color="black" fontWeight={500}>
              Earn rewards for completing these quests!
            </Typography>
            <Grid container alignItems="center" gap="14px" flex="1" justifyContent="center">
              {rewardsValue.map(Reward)}
            </Grid>
          </Box>
        ) : null}
        {referralCampaign?.quests?.length ? (
          <Grid container gap="30px 14px" bgcolor="#AF9EFF" padding="32px 56px" width="100vw" flex="1">
            {referralCampaign?.quests?.map((quest) => {
              return <QuestCard quest={quest} />;
            })}
            {/* //TODO: REPLACE THIS WITH NEWEST CARD */}
          </Grid>
        ) : null}
      </Grid>
    </>
  );
};

/*
delete 
*/

export default ViewRefferal;
