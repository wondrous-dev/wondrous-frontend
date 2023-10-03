import { Box, Grid } from "@mui/material";
import { ShapedHexagonWrapper } from "components/Icons/Discord";
import { Label } from "components/QuestsList/styles";
import Modal from "components/Shared/Modal";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import { DiscordGif } from "./styles";

const DiscordRoleDisclaimer = ({ onClose }) => {
  const CONFIG = [
    {
      label: (
        <Label fontSize="15px" fontWeight={400}>
          Visit your <strong>Server settings</strong>
        </Label>
      ),
    },
    {
      label: (
        <Label fontSize="15px" fontWeight={400}>
          Click on <strong>roles</strong>
        </Label>
      ),
    },
    {
      label: (
        <Label fontSize="15px" fontWeight={400}>
          Drag the <strong>Wonderverse Bot</strong> above all roles it has to manage
        </Label>
      ),
    },
  ];

  return (
    <Modal title="Update Discord Server Settings" onClose={onClose} open maxWidth={740}>
      <Grid display="flex" flexDirection="column" gap="24px">
        <Box display="flex" flexDirection="column" gap="12px">
          <Label fontSize="15px" color="#2A8D5C">
            You need to update your server settings before you can reward that role.
          </Label>
          <Label fontSize="15px" fontWeight={400}>
            Please move the Wonderverse Bot role above all the user roles it has to manage.
          </Label>
        </Box>
        <Divider />
        <Label fontSize="15px" color="#2A8D5C">
          How to:
        </Label>
        <Box display="flex" flexDirection="column" alignItems="flex-start" gap="18px">
          {CONFIG.map((item, idx) => (
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
                <Label color="white" fontSize="13px" fontWeight={700} sx={{ position: "absolute" }}>
                  {idx + 1}
                </Label>
              </Box>
              {item.label}
            </Box>
          ))}
          <DiscordGif src="/images/discord-role-guide.gif" />
        </Box>
        <Divider />
        <Box
          borderRadius="12px"
          border="1px solid #AF9EFF"
          bgcolor="rgba(175, 158, 255, 0.20)"
          display="flex"
          padding="14px"
          flexDirection="column"
          alignItems="flex-start"
        >
          <Label fontSize="15px">After updating you should be able to grant any role.</Label>
          <Box display="flex" gap="4px" justifyContent="center" alignItems="center">
            <a>
              <Label color="#4D9EFF" sx={{ textDecoration: "underline" }} fontSize="15px">
                Ask us on Discord{" "}
              </Label>
            </a>
            <Label fontSize="15px" fontWeight={400}> if you need help</Label>
          </Box>
        </Box>
      </Grid>
    </Modal>
  );
};
export default DiscordRoleDisclaimer;
