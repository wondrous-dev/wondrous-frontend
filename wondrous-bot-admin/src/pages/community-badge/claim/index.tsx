import { Box, Grid } from "@mui/material";
import { Label } from "components/QuestsList/styles";
import PageWrapper from "components/Shared/PageWrapper";
import { useLocation } from "react-router-dom";
import ArrowSVG from "assets/arrow.svg";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import { CommonTypography, DataTitle } from "components/MembersAnalytics/styles";
import { TextWrapper } from "components/NFT/ViewNFTComponent/styles";
import { NFT_MINTING_CHAIN_SELECT_OPTIONS } from "components/NFT/CreateComponent";
import { ChainIcons } from "components/NFT/ViewNFTComponent";
import { CHAIN_TO_CHAIN_DIPLAY_NAME } from "utils/web3Constants";
import { SharedSecondaryButton } from "components/Shared/styles";

const CommunityBadgeClaimPage = () => {
  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);
  const signature = searchParams.get("signature");
  const cmtyUserId = searchParams.get("cmtyUserId");

  const config = [
    {
      label: "NFT Title",
      value: "little-booty-nft",
    },
    {
      label: "Minting to your wallet:",
      value: "0x1234...5678",
    },
    {
      label: "On this chain",
      value: "polygon",

      component: (value) => (
        <Box display="flex" justifyContent="center" alignItems="center">
          {ChainIcons[value]}
          <CommonTypography>{CHAIN_TO_CHAIN_DIPLAY_NAME[value]}</CommonTypography>,
        </Box>
      ),
    },
  ];

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
        gap="24px"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        width="fit-content"
        overflow="hidden"
        sx={{
          maxWidth: {
            xs: "100%",
            sm: "70%",
            md: "60%",
          },
        }}
      >
        <Box display="flex" gap="24px" justifyContent="space-between" alignItems="center" width="100%" sx={{
          flexDirection: {
            xs: 'column',
            sm: 'row'
          }
        }}>
          <Box display="flex" flexDirection="column" gap="24px" sx={{
            width: {
              xs: '100%',
              sm: '50%'
            }
          }}>
            <Label fontFamily="Poppins" fontSize="15px" fontWeight={500}>
              SampleDAO
            </Label>
            <Divider />
            {config.map((item, idx) => {
              return (
                <Box display="flex" flexDirection="column" gap="12px">
                  <DataTitle>{item.label}</DataTitle>
                  <TextWrapper>
                    {item.component ? item.component(item.value) : <CommonTypography>{item.value}</CommonTypography>}
                  </TextWrapper>
                </Box>
              );
            })}
          </Box>
          <Box>
            <Box
              sx={{
                minWidth: "340px",
                height: "340px",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                borderRadius: "16px",
                backgroundImage: `url(${"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80?size=512"})`,
              }}
            />
          </Box>
        </Box>
        <Box
          borderRadius="16px"
          padding="14px 0px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="#F5F5F5"
          width="100%"
        >
          <SharedSecondaryButton>Claim Now</SharedSecondaryButton>
        </Box>
      </Grid>
    </PageWrapper>
  );
};

export default CommunityBadgeClaimPage;
