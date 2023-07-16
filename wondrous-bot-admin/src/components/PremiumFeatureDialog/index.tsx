import { Button, Dialog, Grid, Typography } from "@mui/material";

type PremiumFeatureDialogProps = {
  open: boolean;
  onClose: (value: string) => void;
  paywallMessage?: string;
};

const PremiumFeatureDialog = ({ open = false, onClose, paywallMessage }: PremiumFeatureDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: "16px", boxShadow: "none", outline: "1px solid black" },
      }}
      slotProps={{
        backdrop: {
          sx: { backgroundColor: "#AF9EFFCC", backdropFilter: "blur(5px)" },
        },
      }}
    >
      <Grid
        container
        width="fit-content"
        maxWidth="416px"
        flexDirection="column"
        alignItems="center"
        borderRadius="16px"
      >
        <Grid container item padding="24px" flexDirection="column" alignItems="center" gap="24px">
          <Grid container item flexDirection="column" gap="14px" alignItems="center">
            <Typography color="#2A8D5C" fontFamily="Poppins" fontSize="24px" fontWeight="700" textAlign="center">
              {paywallMessage || "This is a premium feature"}
            </Typography>
            <Typography color="#5E5E5E" fontFamily="Poppins" fontSize="15px" fontWeight="500" textAlign="center">
              Ready to increase your engagement with Communities Premium?
            </Typography>
          </Grid>
          <img
            src="/images/premium-feature-modal.png"
            alt="premium feature modal"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </Grid>
        <Grid
          container
          item
          padding="24px"
          borderTop="1px solid #E8E8E8"
          flexDirection="column"
          alignItems="center"
          width="100%"
        >
          <Button
            disableRipple
            disableFocusRipple
            href="/pricing"
            sx={{
              backgroundColor: "#84BCFF",
              height: "40px",
              width: "100%",
              borderRadius: "100px",
              textTransform: "none",
              color: "#000",
              textAlign: "center",
              fontFamily: "Poppins",
              fontSize: "15px",
              fontWeight: 600,

              "&:hover": {
                backgroundColor: "#84BCFF",
              },
            }}
          >
            Upgrade Community
          </Button>
          {/* <Button
            disableRipple
            disableFocusRipple
            sx={{
              height: "40px",
              width: "100%",
              borderRadius: "100px",
              textTransform: "none",
              color: "#6D6D6D",
              textAlign: "center",
              fontFamily: "Space Grotesk",
              fontSize: "16px",
              fontWeight: 700,

              "&:hover": {
                backgroundColor: "#fff",
              },
            }}
          >
            I'll upgrade later
          </Button> */}
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default PremiumFeatureDialog;
