import { Box, ButtonBase, Typography } from "@mui/material";
import { CommonTypography } from "../styles";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import useAlerts from "utils/hooks";
import { ButtonIconWrapper } from "components/Shared/styles";
import CopyIcon from "components/Icons/copy";
import { ConnectDiscordIcon, ShapedHexagonWrapper } from "components/Icons/Discord";
import { IconWrapper } from "components/TableComponent/styles";
import { Twitter, Telegram } from "@mui/icons-material";
import { useMemo } from "react";

export const NameComponent = ({ name }) => {
  return (
    <CommonTypography color="black" fontFamily="Poppins" fontSize="13px" fontWeight="600">
      {name}
    </CommonTypography>
  );
};

export const AddressComponent = ({ address }) => {
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();

  const handleClick = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setSnackbarAlertMessage("Address copied to clipboard");
    setSnackbarAlertOpen(true);
  };

  if (!address) {
    return <CommonTypography>User did not connect wallet</CommonTypography>;
  }

  return (
    <Box display="flex" gap="7px" alignItems="center">
      <CommonTypography>{`${address.slice(0, 6)}...${address.slice(
        address.length - 4,
        address.length
      )}`}</CommonTypography>
      <ButtonIconWrapper
        onClick={handleClick}
        sx={{
          "&:focus": {
            outline: "none",
          },
        }}
      >
        <CopyIcon color="black" />
      </ButtonIconWrapper>{" "}
    </Box>
  );
};

export const XpComponent = ({ level, xp }) => {
  return (
    <Box display="flex" gap="11px" alignItems="center">
      <Box
        display="flex"
        gap="10px"
        alignItems="center"
        position="relative"
        justifyContent="center"
        sx={{
          "&:hover #display-edit-icon": {
            visibility: "visible",
          },
        }}
      >
        <Box position="relative" width="fit-content" display="flex" justifyContent="center" alignItems="center">
          <ShapedHexagonWrapper />
          <Typography
            fontFamily="Poppins"
            fontWeight={700}
            fontSize="13px"
            lineHeight="17px"
            position="absolute"
            color="white"
          >
            {level}
          </Typography>
        </Box>
      </Box>
      <CommonTypography>{xp} XP</CommonTypography>
    </Box>
  );
};

export const IntegrationsComponent = ({ user, type }) => {
  const data = useMemo(() => {
    if (type === "discord") {
      return {
        username: user?.discordUsername,
        link: `https://discord.com/users/${user?.discordId}`,
      };
    }
    if (type === "twitter") {
      return {
        username: user?.twitterInfo?.twitterUsername,
        link: `https://x.com/${user?.twitterInfo?.twitterUsername}`,
      };
    }
    if (type === "telegram") {
      return {
        username: user?.telegramUsername,
        link: `https://t.me/${user?.telegramUsername}`,
      };
    }
  }, [user, type]);
  const Icon = () => {
    if (type === "discord") return <ConnectDiscordIcon fill="#84bcff" />;
    if (type === "twitter")
      return (
        <Twitter
          sx={{
            color: "white",
            fontSize: "15px",
          }}
        />
      );
    if (type === "telegram")
      return (
        <Telegram
          sx={{
            color: "white",
            fontSize: "15px",
          }}
        />
      );
  };

  return (
    <Box display="flex" gap="10px" alignItems="center">
      <IconWrapper onClick={() => window.open(data?.link)}
      disabled={!data?.username}
      >
        <Icon />
      </IconWrapper>
      <CommonTypography>{data?.username || "N/A"}</CommonTypography>
    </Box>
  );
};
