import { Box, Grid } from "@mui/material";
import { Label } from "components/QuestsList/styles";
import PageWrapper from "components/Shared/PageWrapper";
import { useLocation } from "react-router-dom";
import ArrowSVG from "assets/arrow.svg";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import { CommonTypography, DataTitle } from "components/MembersAnalytics/styles";
import { TextWrapper } from "components/NFT/ViewNFTComponent/styles";
import { ChainIcons } from "components/NFT/ViewNFTComponent";
import { CHAIN_TO_CHAIN_DIPLAY_NAME } from "utils/web3Constants";
import { useLazyQuery } from "@apollo/client";
import { GET_CMTY_USER_NFT_METADATA } from "graphql/queries";
import { useEffect, useState } from "react";
import { OrgProfilePicture } from "components/Shared/ProjectProfilePicture";
import ClaimButton from "components/NFT/ClaimButton";
import BadgeClaimComponent from "components/BadgeClaimComponent";

const CommunityBadgeClaimPage = () => {
  const { search } = useLocation();

  const [isSuccess, setSuccess] = useState(false);
  const searchParams = new URLSearchParams(search);
  const signature = searchParams.get("signature");
  const cmtyUserId = searchParams.get("cmtyUserId");
  const tokenId = searchParams.get("tokenId");

  const [getMetadata, { data, error }] = useLazyQuery(GET_CMTY_USER_NFT_METADATA, {
    notifyOnNetworkStatusChange: true,
  });

  const signatureAlreadyUsed = error?.graphQLErrors?.[0]?.extensions?.errorCode === "used_signature";

  useEffect(() => {
    if (tokenId) {
      getMetadata({
        variables: {
          tokenId,
          cmtyUserId,
          signature,
        },
      });
    }
  }, [cmtyUserId, tokenId, signature]);

  // const address = data?.getCmtyUserNftMetadata?.receiverAddress || "";

  // const config = [
  //   {
  //     label: "NFT Title",
  //     value: data?.getCmtyUserNftMetadata?.name,
  //   },
  //   {
  //     label: "Minting to your wallet:",
  //     value: `${address.slice(0, 6)}...${address.slice(address.length - 4, address.length)}`,
  //   },
  //   {
  //     label: "On this chain",
  //     value: data?.getCmtyUserNftMetadata?.chain,

  //     component: (value) => (
  //       <Box display="flex" justifyContent="center" alignItems="center" gap="8px">
  //         {ChainIcons[value]}
  //         <CommonTypography>{CHAIN_TO_CHAIN_DIPLAY_NAME[value]}</CommonTypography>,
  //       </Box>
  //     ),
  //   },
  // ];

  return (
    <PageWrapper
      containerProps={{
        direction: "column",
        justifyContent: isSuccess || signatureAlreadyUsed ? "center" : "flex-start",
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
      {isSuccess || signatureAlreadyUsed ? (
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
            height: "100%",
            width: {
              xs: "100%",
              sm: "70%",
              md: "60%",
              xl: "40%",
            },
          }}
        >
          <Label>{signatureAlreadyUsed ? "Woops!" : "Minted Successfully!"}</Label>
          <Label fontSize="12px" fontWeight={400}>
            {signatureAlreadyUsed
              ? "You have already minted this NFT"
              : "You can now close this page and go back to Discord"}
          </Label>
        </Grid>
      ) : (
        <>
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
                Hey, <strong>{data?.getCmtyUserNftMetadata?.cmtyUserDiscordUsername || null} </strong>you just earned a
                new NFT from {data?.getCmtyUserNftMetadata?.org?.name}! Claim it below!
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
          <BadgeClaimComponent
            tokenId={tokenId}
            cmtyUserId={cmtyUserId}
            signature={signature}
            receiverAddress={data?.getCmtyUserNftMetadata?.receiverAddress}
            name={data?.getCmtyUserNftMetadata?.name}
            chain={data?.getCmtyUserNftMetadata?.chain}
            orgProfilePicture={data?.getCmtyUserNftMetadata?.org?.profilePicture}
            orgName={data?.getCmtyUserNftMetadata?.org?.name}
            mediaUrl={data?.getCmtyUserNftMetadata?.mediaUrl}
            nftMetadataId={data?.getCmtyUserNftMetadata?.nftMetadataId}
            onSuccess={() => setSuccess(true)}
            nonce={data?.getCmtyUserNftMetadata?.nonce}
          />
          {/* <Grid
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
              width: {
                xs: "100%",
                sm: "70%",
                md: "60%",
                xl: "40%",
              },
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
                    profilePicture={data?.getCmtyUserNftMetadata?.org?.profilePicture}
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "100%",
                    }}
                  />

                  <Label fontFamily="Poppins" fontSize="15px" fontWeight={500}>
                    {data?.getCmtyUserNftMetadata?.org?.name}
                  </Label>
                </Box>
                <Divider />
                {config.map((item, idx) => {
                  return (
                    <Box display="flex" flexDirection="column" gap="12px">
                      <DataTitle>{item.label}</DataTitle>
                      <TextWrapper>
                        {item.component ? (
                          item.component(item.value)
                        ) : (
                          <CommonTypography>{item.value}</CommonTypography>
                        )}
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
                    backgroundImage: `url(${data?.getCmtyUserNftMetadata?.mediaUrl})`,
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
                chain={data?.getCmtyUserNftMetadata?.chain}
                signature={signature}
                nftMetadataId={data?.getCmtyUserNftMetadata?.nftMetadataId}
                cmtyUserId={cmtyUserId}
                tokenId={tokenId}
                setSuccess={setSuccess}
                nonce={data?.getCmtyUserNftMetadata?.nonce}
              />
            </Box>
          </Grid> */}
        </>
      )}
    </PageWrapper>
  );
};

export default CommunityBadgeClaimPage;
