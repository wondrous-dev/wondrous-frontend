import { Box, Grid, Typography } from "@mui/material";
import {
  BadgesIcon,
  LevelIcon,
  PointsBalanceIcon,
  PurchasesIcon,
  SubmissionsIcon,
} from "components/CmtyUserActivity/Icons";
import { ProfilePicture } from "./styles";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import { useQuery } from "@apollo/client";
import { GET_CMTY_USER_ACTIVITY_STATS } from "graphql/queries";

const UserConfigItems = ({ config }) => {
  return (
    <Box
      display="flex"
      gap={{
        xs: "14px",
        md: "24px",
      }}
      alignItems="center"
      flexWrap="wrap"
    >
      {config?.map((item, idx) => {
        return (
          <Box key={item.label} display="flex" alignItems="center" gap="6px">
            {item.icon && <item.icon />}
            <Typography color="black" fontSize="14px" fontWeight={500} lineHeight="14px">
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

const ProfilePanel = ({ cmtyUser, stats }) => {
  const userDataConfig = {
    top: [
      {
        label: `Level ${stats?.level || 0}`,
        icon: LevelIcon,
      },
      {
        label: `Points balance ${stats?.totalPointsBalance || 0}`,
        icon: PointsBalanceIcon,
      },
      {
        label: `Total points ${stats?.totalPoints || 0}`,
        icon: PointsBalanceIcon,
      },
    ],
    bottom: [
      {
        label: `${stats?.badges || 0} Badges`,
        icon: BadgesIcon,
      },
      {
        label: `${stats?.purchases || 0} Purchases`,
        icon: PurchasesIcon,
      },
      {
        label: `${stats?.submissions || 0} Submissions`,
        icon: SubmissionsIcon,
      },

      
    ],
  };

  return (
    <Grid
      display="flex"
      gap="24px"
      alignItems="center"
      padding="14px"
      borderRadius="12px"
      bgcolor="#F6F6F6"
      width="100%"
    >
      <Box>
        <ProfilePicture src={cmtyUser?.profilePicture || "/images/profile-picture-placeholder.svg"} />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        gap="14px"
        alignItems="flex-start"
        justifyContent="flex-start"
        width="100%"
      >
        <Typography color="black" fontSize="18px" fontWeight={600} lineHeight="18px">
          {cmtyUser?.discordUsername || cmtyUser?.username || cmtyUser?.telegramUsername || "Wonder User"}
        </Typography>

        <UserConfigItems config={userDataConfig.top} />
        <Divider />
        <UserConfigItems config={userDataConfig.bottom} />
      </Box>
    </Grid>
  );
};

export default ProfilePanel;
