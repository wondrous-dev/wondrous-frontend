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

const ProfilePanel = () => {
  const userDataConfig = {
    top: [
      {
        label: "Level 4",
        icon: LevelIcon,
      },
      {
        label: "Points balance 8",
        icon: PointsBalanceIcon,
      },
      {
        label: "Total points 468",
        icon: PointsBalanceIcon,
      },
    ],
    bottom: [
      {
        label: "8 Badges",
        icon: BadgesIcon,
      },
      {
        label: "32 Purchases",
        icon: PurchasesIcon,
      },
      {
        label: "56 Submissions",
        icon: SubmissionsIcon,
      },
    ],
  };

  const username = "Joe Schmoe";

  const profilePic =
    "https://s3-alpha-sig.figma.com/img/b79e/dce2/e36a56336972f01f541cfca7a8129408?Expires=1705881600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=XqzCSaYV3miaEbIWdYq9Shasvo-9zfweyiQXQBdgcEbvIXQmqgP4B8VzMepGXo1zeVyS2SvtO0adOkav0o1TbzKO6DDgjELIGSTO9iIJc9YS9i6CONqAKZN2tGU3iLnDMfneJXl-E4ulX7iNBtcpYyMNZ2pR2UE3SkPbIncogNEfTz4XLxpLyvLI-dc~-WqhZ3J~it9O9Dz-~JME4fRHfDKmxM4uDvyV7u2D47~cL-gipc~plKyp~Vqqhtuofo-V0K6vQcc97UC0~LogYulVK6o0t5fnXZ~uz85xcCzrjOU0-qnHR4UGP8q380Gfb8PXWd9R-5M~WZHtTWsKo0HLlw__";
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
        <ProfilePicture src={profilePic} />
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
          {username}
        </Typography>

        <UserConfigItems config={userDataConfig.top} />
        <Divider />
        <UserConfigItems config={userDataConfig.bottom} />
      </Box>
    </Grid>
  );
};

export default ProfilePanel;
