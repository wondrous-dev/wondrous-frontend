import { Box, Grid } from "@mui/material";
import { Label } from "components/QuestsList/styles";
import PageWrapper from "components/Shared/PageWrapper";
import { useLocation } from "react-router-dom";
import ArrowSVG from "assets/arrow.svg";
import { useLazyQuery } from "@apollo/client";
import { GET_CMTY_USER_NFT_METADATA } from "graphql/queries";
import { useEffect, useState } from "react";
import BadgeClaimComponent from "components/BadgeClaimComponent";

const CommunityBadgeClaimPage = () => {
  const { search } = useLocation();

  const [isSuccess, setSuccess] = useState(false);
  const searchParams = new URLSearchParams(search);
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
        },
      });
    }
  }, [cmtyUserId, tokenId]);

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
            signature={data?.getCmtyUserNftMetadata?.signature}
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
        </>
      )}
    </PageWrapper>
  );
};

export default CommunityBadgeClaimPage;
