import { Box, Grid } from "@mui/material";
import { Label } from "components/QuestsList/styles";
import PageWrapper from "components/Shared/PageWrapper";
import { useLocation } from "react-router-dom";
import ArrowSVG from "assets/arrow.svg";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";

const CommunityBadgeClaimPage = () => {
  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);
  const signature = searchParams.get("signature");
  const cmtyUserId = searchParams.get("cmtyUserId");

  return (
    <PageWrapper
      containerProps={{
        direction: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        minHeight: "100vh",
        gap: "38px",
        padding: {
          xs: "14px 14px 120px 14px",
          sm: "24px 56px 150px 24px",
        },
        sx: {
          backgroundImage: "none",
          backgroundColor: "#AF9EFF",
        },
      }}
    >
      <Box
        position="relative"
        display="flex"
        sx={{
          width: {
            xs: "100%",
            sm: "50%",
            md: "25%",
          },
        }}
      >
        <Box
          display="flex"
          padding="24px 14px"
          flexDirection="column"
          alignItems="center"
          gap="24px"
          bgcolor="#FFF"
          justifyContent="center"
          borderRadius="12px"
          width="100%"
        >
          <img src="/images/minting-discord-icon.svg" />
          <Label fontSize="15px" fontWeight={400} sx={{ textAlign: "center" }}>
            You just earned a new NFT from SampleDAO! Claim it below!
          </Label>
        </Box>
        <img
          src={ArrowSVG}
          style={{
            position: "absolute",
            top: "99%",
            right: "46%",
          }}
        />
      </Box>
      <Grid
        bgcolor="#FFF"
        borderRadius="12px"
        padding="24px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        sx={{
            width: {
                xs: "100%",
                sm: "70%",
                md: '50%'
            }
        }}
      >
        <Box display="flex" gap="24px" justifyContent="center" alignItems="center">
          <Box display="flex" flexDirection="column" gap="24px">
            <Label fontFamily="Poppins" fontSize="15px" fontWeight={500}>
              SampleDAO
            </Label>
            <Divider />
          </Box>
          <Box>
            <img src="/images/wonder-logo-3.svg"/>
          </Box>
        </Box>
      </Grid>
    </PageWrapper>
  );
};

export default CommunityBadgeClaimPage;
