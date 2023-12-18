import Modal from "components/Shared/Modal";
import { Grid, Box, Typography, Button } from "@mui/material";
import { useLazyQuery } from "@apollo/client";
import { GET_ORG_DISCORD_INVITE_LINK } from "graphql/queries";
import { SharedSecondaryButton } from "components/Shared/styles";
import Spinner from "components/Shared/Spinner";

const InactiveQuestInfoModal = ({ isOpen, onClose = null, orgId }) => {
  const [getOrgDiscordInviteLink, { loading }] = useLazyQuery(GET_ORG_DISCORD_INVITE_LINK, {
    notifyOnNetworkStatusChange: true,
  });

  const handleClick = () => {
    getOrgDiscordInviteLink({
      variables: {
        orgId,
      },
    }).then(({ data }) => {
      const inviteLink = data?.getOrgDiscordInviteLink?.link;
      window.open(inviteLink);
    });
  };

  return (
    <Modal open={isOpen} onClose={onClose} title={null} maxWidth={792} noHeader>
      <Grid
        display="flex"
        gap="24px"
        sx={{
          flexDirection: {
            xs: "column-reverse",
            sm: "row",
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection="column" gap="24px">
          <Box display="flex" flexDirection="column" gap="14px" height="100%" justifyContent="center">
            <Typography
              color="#2A8D5C"
              fontWeight={700}
              fontFamily="Poppins"
              fontSize={{
                xs: "20px",
                sm: "24px",
              }}
              lineHeight="33px"
            >
              Inactive Quest
            </Typography>
            <Typography
              color="#5E5E5E"
              fontFamily="Poppins"
              fontSize={{
                xs: "12px",
                sm: "15px",
              }}
              lineHeight="24px"
              fontWeight={500}
            >
              It looks like the quest you're trying to embark on is currently inactive. <br />
              Check back later to see if it's available or explore other quests.
            </Typography>
          </Box>
          <Box display="flex" gap="24px" alignItems="center" justifyContent="flex-start" width="100%">
            {onClose ? (
              <Button
                disableRipple
                onClick={onClose}
                disableFocusRipple
                sx={{
                  height: "40px",
                  width: "fit-content",
                  borderRadius: "100px",
                  textTransform: "none",
                  color: "#6D6D6D",
                  textAlign: "center",
                  fontFamily: "Space Grotesk",
                  fontSize: "16px",
                  fontWeight: 700,
                  textWrap: "nowrap",

                  "&:hover": {
                    backgroundColor: "#fff",
                  },
                }}
              >
                Close
              </Button>
            ) : null}
            <SharedSecondaryButton disabled={loading} onClick={handleClick}>
              {loading ? <Spinner /> : "Check Discord"}
            </SharedSecondaryButton>
          </Box>
        </Box>
      </Grid>
    </Modal>
  );
};

export default InactiveQuestInfoModal;
