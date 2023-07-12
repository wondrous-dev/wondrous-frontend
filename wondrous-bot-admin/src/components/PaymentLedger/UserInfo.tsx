import { ButtonBase, Grid, Typography } from "@mui/material";
import SafeImage from "components/SafeImage";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import useAlerts from "utils/hooks";

const UserInfo = ({ discordUsername, discordAvatarUrl, address, renderCheckbox }) => {
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();
  const handleClick = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setSnackbarAlertMessage("Address copied to clipboard");
    setSnackbarAlertOpen(true);
  };

  return (
    <Grid display="flex" gap="6px" alignItems="center" justifyContent="center">
      {renderCheckbox ? renderCheckbox() : null}
      <SafeImage src={discordAvatarUrl} width="28px" height="28px" style={{ borderRadius: "28px" }} />
      <Typography color="black" fontSize="14px" fontFamily="Poppins" fontWeight={500}>
        {discordUsername}
      </Typography>
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
      </ButtonBase>
    </Grid>
  );
};

export default UserInfo;
