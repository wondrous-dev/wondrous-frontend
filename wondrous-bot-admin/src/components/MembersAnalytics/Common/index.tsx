import { Box, ButtonBase, Typography } from "@mui/material";
import { CommonTypography, TextWrapper } from "../styles";
import useAlerts from "utils/hooks";
import { ButtonIconWrapper } from "components/Shared/styles";
import CopyIcon from "components/Icons/copy";
import { ShapedHexagonWrapper } from "components/Icons/Discord";
import { useMemo } from "react";


export const NameComponent = ({ name }) => {
  return (
    <TextWrapper data-tour="member-analytics-modal-username">
      <CommonTypography color="black" fontFamily="Poppins" fontSize="13px" fontWeight="600">
        {name}
      </CommonTypography>
    </TextWrapper>
  );
};

export const AddressComponent = ({ address, sliceLen = 6 }) => {
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
      <TextWrapper>
        <CommonTypography>{`${address.slice(0, sliceLen)}...${address.slice(
          address.length - 4,
          address.length
        )}`}</CommonTypography>
      </TextWrapper>
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
          <ShapedHexagonWrapper fill="#84BCFF" />
          <Typography
            fontFamily="Poppins"
            fontWeight={700}
            fontSize="13px"
            lineHeight="17px"
            position="absolute"
            color="black"
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
        username: user?.twitterInfo?.twitterUsername ? `@${user?.twitterInfo?.twitterUsername}` : null,
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

  return (
    <ButtonBase onClick={() => window.open(data?.link)} disabled={!data?.username}>
      <TextWrapper
        {...(data?.username
          ? {
              border: "1px solid #2A8D5C",
              bgcolor: "rgba(42, 141, 92, 0.20)",
            }
          : {})}
      >
        <CommonTypography color={data?.username ? "#000" : "#626262"}>
          {data?.username || "not yet collected"}
        </CommonTypography>
      </TextWrapper>
    </ButtonBase>
  );
};

