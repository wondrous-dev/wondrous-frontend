import { Box, ButtonBase, Divider, Grid, Typography, useMediaQuery } from "@mui/material";
import BadgeClaimComponent from "components/BadgeClaimComponent";
import Modal from "components/Shared/Modal";
import { OrgProfilePicture } from "components/Shared/ProjectProfilePicture";
import { useState } from "react";
import { Label } from "components/QuestsList/styles";
import { CommonTypography, DataTitle } from "components/MembersAnalytics/styles";
import { ChainIcons } from "components/NFT/ViewNFTComponent";
import { CHAIN_TO_CHAIN_DIPLAY_NAME, CHAIN_TO_EXPLORER_URL } from "utils/web3Constants";
import { AddressComponent } from "components/MembersAnalytics/Common";
import { BadgeWrapper, StyledLink } from "./styles";
import moment from "moment";
import { ExternalLinkIcon } from "components/Icons/ExternalLink";

const slicedHash = (hash, sliceLen = 6) => `${hash.slice(0, sliceLen)}...${hash.slice(hash.length - 4, hash.length)}`;

const NFTDetails = ({ chain, mintedAt, txHash, tokenId, contractAddress }) => {
  const slicedTokenId = slicedHash(tokenId);
  const openSeaLink = `https://opensea.io/assets/${chain}/${contractAddress}/${tokenId}`;
  const scannerLink = `${CHAIN_TO_EXPLORER_URL[chain]}/tx/${txHash}`;
  const config = [
    {
      label: "On this chain:",
      value: chain,
      component: (value) => (
        <Box display="flex" justifyContent="center" alignItems="center" gap="8px">
          {ChainIcons[value]}
          <CommonTypography>{CHAIN_TO_CHAIN_DIPLAY_NAME[value]}</CommonTypography>
        </Box>
      ),
    },
    {
      label: "Minted at",
      value: moment(mintedAt).format("MM/DD/YYYY"),
    },
    {
      label: "TX hash",
      component: () => (
        <StyledLink href={scannerLink} target="_blank">
          {slicedHash(txHash)}
        </StyledLink>
      ),
    },
    {
      label: "Token ID",
      value: slicedTokenId,
    },
    {
      label: "OpenSea",
      component: () => (
        <a href={openSeaLink} target="_blank">
          <ButtonBase
            sx={{
              borderRadius: "6px",
              background: "black",
              border: "1px solid black",
              padding: "4px 8px",
              display: "flex",
              gap: "8px",
              color: "white",
              fontSize: "15px",
              textAlign: "center",
              fontFamily: "Poppins",
              "&:hover": {
                background: "transparent",
                border: "1px solid black",
                color: "black",
                "svg > path": {
                  stroke: "black",
                },
              },
            }}
          >
            <Typography whiteSpace="nowrap">View Badge</Typography>
            <ExternalLinkIcon stroke="white" />
          </ButtonBase>
        </a>
      ),
    },
  ];
  return (
    <Grid display="flex" flexWrap="wrap" justifyContent="flex-start" gap="28px">
      {config.map((item, idx) => {
        return (
          <Box
            display="flex"
            flexDirection="column"
            gap="12px"
            justifyContent="flex-start"
            alignItems="flex-start"
            key={`grid-item-${idx}`}
            width="40%"
          >
            {item.label ? <DataTitle>{item.label}</DataTitle> : null}
            {item.component ? (
              item.component(item.value)
            ) : (
              <CommonTypography fontSize="15px">{item.value}</CommonTypography>
            )}
          </Box>
        );
      })}
    </Grid>
  );
};

const ViewMintedBadgeComponent = ({ item, org, cmtyUser }) => {
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));
  const { chain, name, description, receiverAddress, mintedAt, txHash, tokenId, contractAddress } = item || {};
  const address = receiverAddress || "";
  const config = [
    {
      label: "NFT Title",
      value: name,
    },
    {
      label: "Description",
      value: description,
    },
    {
      label: "Receiver Address",
      value: address,
      component: (value) => <AddressComponent address={value} sliceLen={isMobile ? 12 : 24} />,
    },
    {
      component: () => {
        return (
          <NFTDetails
            chain={chain}
            mintedAt={mintedAt}
            txHash={txHash}
            tokenId={tokenId}
            contractAddress={contractAddress}
          />
        );
      },
    },
  ];

  return (
    <BadgeWrapper>
      <Grid
        bgcolor="#FFF"
        borderRadius="12px"
        display="flex"
        gap="24px"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        width="100%"
        paddingRight="24px"
        overflow="hidden"
      >
        <Box
          display="flex"
          gap="24px"
          justifyContent="space-between"
          alignItems="flex-start"
          width="100%"
          paddingBottom="6px"
          sx={{
            flexDirection: {
              xs: "column-reverse",
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
                profilePicture={org?.profilePicture}
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "100%",
                }}
              />

              <Label fontFamily="Poppins" fontSize="15px" fontWeight={500}>
                {org?.name}
              </Label>
            </Box>
            <Divider />
            {config.map((item, idx) => {
              return (
                <Box display="flex" flexDirection="column" gap="12px">
                  {item.label ? <DataTitle>{item.label}</DataTitle> : null}
                  {item.component ? (
                    item.component(item.value)
                  ) : (
                    <CommonTypography fontSize="15px">{item.value}</CommonTypography>
                  )}
                </Box>
              );
            })}
          </Box>
          <Box>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                borderRadius: "16px",
              }}
            >
              <img
                src={item?.mediaUrl}
                width="100%"
                height="auto"
                style={{
                  borderRadius: "16px",
                  minWidth: "300px",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Grid>
    </BadgeWrapper>
  );
};

const MintBadgeComponent = ({ item, org, cmtyUser }) => {
  const [success, setSuccess] = useState(false);
  return (
    <BadgeWrapper>
      <BadgeClaimComponent
        receiverAddress={item?.receiverAddress || ""}
        name={item?.name}
        chain={item?.chain}
        orgProfilePicture={org?.profilePicture}
        orgName={org?.name}
        mediaUrl={item?.mediaUrl}
        signature={item?.signature}
        nftMetadataId={item?.nftMetadataId}
        cmtyUserId={cmtyUser?.id}
        tokenId={item?.tokenId}
        onSuccess={() => setSuccess(true)}
        nonce={item.nonce}
        fullWidth
        renderItemComponent={(item) => {
          return (
            <Box display="flex" flexDirection="column" gap="12px">
              {item.label ? <DataTitle>{item.label}</DataTitle> : null}
              {item.component ? (
                item.component(item.value)
              ) : (
                <CommonTypography fontSize="15px">{item.value}</CommonTypography>
              )}
            </Box>
          );
        }}
        containerStyles={{
          padding: "0px",
          paddingRight: "24px",
        }}
      />
    </BadgeWrapper>
  );
};

const BadgeModal = ({ isOpen, item, onClose, org, cmtyUser }) => {
  const isMintedBadge = !!item?.txHash;
  return (
    <Modal
      open={isOpen}
      title={isMintedBadge ? "View Badge" : "Mint Badge"}
      onClose={onClose}
      maxWidth={800}
      modalHeaderStyle={{
        backgroundColor: "#FFFFFF",
      }}
      modalTitleStyle={{
        color: "black",
      }}
      closeButtonStyle={{
        backgroundColor: "black",
        strokeColor: "white",
      }}
    >
      {isMintedBadge ? (
        <ViewMintedBadgeComponent item={item} org={org} cmtyUser={cmtyUser} />
      ) : (
        <MintBadgeComponent item={item} org={org} cmtyUser={cmtyUser} />
      )}
    </Modal>
  );
};

export default BadgeModal;
