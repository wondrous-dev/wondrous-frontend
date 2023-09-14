import React, { useContext, useEffect } from "react";
import GlobalContext from "utils/context/GlobalContext";
import { ButtonBase, Grid, Typography } from "@mui/material";
import SafeImage from "components/SafeImage";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import useAlerts from "utils/hooks";
import {REQUEST_CMTY_USER_CONNECT_WALLET} from "graphql/mutations";
import { useMutation } from "@apollo/client";

const UserInfo = ({ cmtyUserId, discordUsername, discordAvatarUrl, address, renderCheckbox }) => {
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();
  const [requestCmtyUserConnectWallet] = useMutation(REQUEST_CMTY_USER_CONNECT_WALLET);
  const { activeOrg } = useContext(GlobalContext);

  const handleClick = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setSnackbarAlertMessage("Address copied to clipboard");
    setSnackbarAlertOpen(true);
  };

  const handleRequestWallet = (e) => {
    e.stopPropagation();
    requestCmtyUserConnectWallet({
      variables: {
        cmtyUserId,
        orgId: activeOrg?.id
      }
    }).then(() => {
      setSnackbarAlertMessage("Wallet request sent");
      setSnackbarAlertOpen(true);
    })

  }

  return (
    <Grid display="flex" gap="6px" alignItems="center" justifyContent="center">
      {renderCheckbox ? renderCheckbox() : null}
      <SafeImage src={discordAvatarUrl} width="28px" height="28px" style={{ borderRadius: "28px" }} />
      <Typography color="black" fontSize="14px" fontFamily="Poppins" fontWeight={500}>
        {discordUsername}
      </Typography>
      {!address && (
        <>
          <ButtonBase style={{
            color: "#fff",
            background: "#2A8D5C",
            padding: "2px 4px",
            borderRadius: "6px",
          }} onClick={handleRequestWallet}>Request wallet</ButtonBase>
        </>
      )}
      {address && (
        <>
          <Typography color="#5E5E5E" fontSize="13px" fontFamily="Poppins" fontWeight={500}>
            {address?.slice(0, 6) + "..." + address?.slice(-4)}
          </Typography>
          <ButtonBase
            onClick={handleClick}
            sx={{
              "&:focus": {
                outline: "none",
              },
            }}
          >
            <ContentCopyIcon
              sx={{
                color: "#2A8D5C",
                height: "13px",
                width: "13px",
              }}
            />
          </ButtonBase>{" "}
        </>
      )}
    </Grid>
  );
};

export default UserInfo;
