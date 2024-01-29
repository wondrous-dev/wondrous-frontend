import { Box, Grid, useMediaQuery } from "@mui/material";
import { Label } from "components/QuestsList/styles";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import { CommonTypography, DataTitle } from "components/MembersAnalytics/styles";
import { TextWrapper } from "components/NFT/ViewNFTComponent/styles";
import { ChainIcons } from "components/NFT/ViewNFTComponent";
import { CHAIN_TO_CHAIN_DIPLAY_NAME } from "utils/web3Constants";
import { OrgProfilePicture } from "components/Shared/ProjectProfilePicture";
import ClaimButton from "components/NFT/ClaimButton";
import { AddressComponent } from "components/MembersAnalytics/Common";
import { BadgeItem } from "./styles";

const BadgeClaimComponent = ({
  receiverAddress,
  name,
  chain,
  orgProfilePicture,
  orgName,
  mediaUrl,
  signature,
  nftMetadataId,
  cmtyUserId,
  tokenId,
  onSuccess,
  onFailure = null,
  nonce,
  fullWidth = false,
  containerStyles = {},
  renderItemComponent = null,
}) => {
  const address = receiverAddress || "";

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

  const config = [
    {
      label: "NFT Title",
      value: name,
    },
    {
      label: "Minting to your wallet:",
      component: (value) => <AddressComponent address={address} sliceLen={isMobile ? 12 : 24} />,
    },
    {
      label: "On this chain",
      value: chain,

      component: (value) => (
        // <TextWrapper>
        <Box display="flex" justifyContent="flex-start" alignItems="center" gap="8px">
          {ChainIcons[value]}
          <CommonTypography>{CHAIN_TO_CHAIN_DIPLAY_NAME[value]}</CommonTypography>
        </Box>
        // </TextWrapper>
      ),
    },
  ];

  return (
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
        width: fullWidth
          ? "100%"
          : {
              xs: "100%",
              sm: "70%",
              md: "60%",
              xl: "40%",
            },
        ...containerStyles,
      }}
    >
      <Box
        display="flex"
        gap="24px"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        sx={{
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          gap="24px"
          sx={{
            width: {
              xs: "100%",
              sm: "50%",
            },
          }}
        >
          <Box display="flex" gap="8px" alignItems="center" justifyContent="flex-start">
            <OrgProfilePicture
              profilePicture={orgProfilePicture}
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "100%",
              }}
            />

            <Label fontFamily="Poppins" fontSize="15px" fontWeight={500}>
              {orgName}
            </Label>
          </Box>
          <Divider />
          {config.map((item, idx) => {
            return (
              <>
                {renderItemComponent ? (
                  renderItemComponent?.(item)
                ) : (
                  <BadgeItem key={`badge-item-${idx}`}>
                    <DataTitle>{item.label}</DataTitle>

                    {item.component ? (
                      item.component(item.value)
                    ) : (
                      <TextWrapper>
                        <CommonTypography>{item.value}</CommonTypography>
                      </TextWrapper>
                    )}
                  </BadgeItem>
                )}
              </>
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
              backgroundImage: `url(${mediaUrl})`,
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
        <ClaimButton
          chain={chain}
          signature={signature}
          nftMetadataId={nftMetadataId}
          cmtyUserId={cmtyUserId}
          tokenId={tokenId}
          onSuccess={onSuccess}
          onFailure={onFailure}
          nonce={nonce}
        />
      </Box>
    </Grid>
  );
};

export default BadgeClaimComponent;
