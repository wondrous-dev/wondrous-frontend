import { Grid, Box } from "@mui/material";
import { PanelCount, PanelTitle, StyledButton } from "../shared/styles";
import { CmtyActivityEmptyState, SharedShowMoreButton } from "../shared";
import { useLazyQuery } from "@apollo/client";
import { GET_CMTY_USER_BADGES } from "graphql/queries";
import { useEffect, useState } from "react";
import { BadgeIcon } from "components/Icons/Badge";
import SafeImage from "components/SafeImage";

const LIMIT = 6;

const MintingStatus = () => (
  <Box
    position="absolute"
    padding="4px 6px"
    borderRadius="6px"
    bgcolor="rgba(255, 255, 255, 0.40)"
    top="8px"
    left="8px"
  >
    <PanelTitle $fontSize="14px">Minted</PanelTitle>
  </Box>
);

const Card = (item) => {
  const { txHash, mediaUrl, name } = item;

  return (
    <Grid
      item
      display="flex"
      flexDirection="column"
      gap="14px"
      width="100%"
      bgcolor="#F7F7F7"
      borderRadius="8px"
      border="1px solid #CDCDCD"
      alignItems="stretch"
      flex="1"
      maxWidth={{
        xs: "100%",
        sm: "32%",
      }}
      minWidth="30%"
      justifyContent="flex-start"
      height="100%"
      overflow="hidden"
    >
      <Box width="100%" height="100%" position="relative" flex="1">
        {txHash && <MintingStatus />}
        {/* <CardImage src={media?.slug} alt={`An image displaying user minted NFT`} /> */}
        <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
          <SafeImage
            src={mediaUrl}
            alt={`An image displaying user minted NFT`}
            style={{
              height: "auto",
              objectFit: "cover",
              width: "100%",
              maxHeight: "25vh",
            }}
          />
        </Box>
        <Box></Box>
      </Box>
      <Box
        display="flex"
        gap="14px"
        alignItems="flex-start"
        justifyContent="flex-start"
        padding="14px 14px 18px 14px"
        flexDirection="column"
      >
        <PanelTitle $fontSize="15x">{name}</PanelTitle>
        <StyledButton $reverse={!!txHash}>{txHash ? "View Badge" : "Mint now"}</StyledButton>
      </Box>
    </Grid>
  );
};

const CardsList = ({ config }) => {
  return (
    <Grid
      display="flex"
      container
      alignItems="stretch"
      gap="18px"
      width="100%"
      height="100%"
      flexWrap="wrap"
      flexDirection={{
        xs: "column",
        sm: "row",
      }}
    >
      {config?.map((item, index) => (
        <Card key={index} {...item} />
      ))}
    </Grid>
  );
};

const BadgesPanel = ({ count, cmtyUserId, org }) => {
  const [hasMore, setHasMore] = useState(true);
  const [getCmtyUserBadges, { data, loading, error }] = useLazyQuery(GET_CMTY_USER_BADGES, {
    notifyOnNetworkStatusChange: true,
    variables: {
      cmtyUserId: cmtyUserId,
      orgId: org?.id,
    },
  });

  const handleInitialFetch = async () => {
    const { data } = await getCmtyUserBadges({
      variables: {
        orgId: org?.id,
        cmtyUserId,
      },
    });
    setHasMore(data?.getCmtyUserBadges?.length >= LIMIT);
  };
  useEffect(() => {
    handleInitialFetch();
  }, []);

  const handleShowMore = () => {};

  // const CONFIG = [
  //   {
  //     title: "This is the NFT title which can go over two lines",
  //     id: 1,
  //     link: null,
  //     assetSrc:
  //       "https://s3-alpha-sig.figma.com/img/3eed/7f1e/a58f9432c4ccb45f1915d952fb242650?Expires=1705881600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hYjrxy-JJ-Rv73BWShUd5yRsPBL4KoR7t1u5m3A0vOKMqNKxsmvq-OyTK1s1cEvG-V4ZJzqukb3u4VnAoJ~fvCamhFWHH1thwLebmYgdUJVoSQhKy529XZQ0d4stt655s35xERUUrv8K4Z326E8aluh9lJX8cYFrXUWYTWK9SPtRu0XrXWZ76MqQe15ErKw17pksAX6Efx8Gya2jE83PLNAFwz8el5r7oYytPnJBun7ZtVHPw2tEsZueeHySP7dKQGrwvAOiei9cy1X3yjU2szSyr8Zlu7Y8SIuye1MZskX7ivUpwPHB10TxgyD-I3dpZzWPf2GyLiPJzSZxHJdSJA__",
  //   },

  //   {
  //     title: "This is the NFT title which can go over two lines",
  //     id: 2,
  //     link: "https://google.com",
  //     assetSrc:
  //       "https://s3-alpha-sig.figma.com/img/3eed/7f1e/a58f9432c4ccb45f1915d952fb242650?Expires=1705881600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hYjrxy-JJ-Rv73BWShUd5yRsPBL4KoR7t1u5m3A0vOKMqNKxsmvq-OyTK1s1cEvG-V4ZJzqukb3u4VnAoJ~fvCamhFWHH1thwLebmYgdUJVoSQhKy529XZQ0d4stt655s35xERUUrv8K4Z326E8aluh9lJX8cYFrXUWYTWK9SPtRu0XrXWZ76MqQe15ErKw17pksAX6Efx8Gya2jE83PLNAFwz8el5r7oYytPnJBun7ZtVHPw2tEsZueeHySP7dKQGrwvAOiei9cy1X3yjU2szSyr8Zlu7Y8SIuye1MZskX7ivUpwPHB10TxgyD-I3dpZzWPf2GyLiPJzSZxHJdSJA__",
  //   },
  //   {
  //     title:
  //       "This is the NFT title which can go over two lines. This is the NFT title which can go over.This is the NFT title which can go over.This is the NFT title which can go over.This is the NFT title which can go over.This is the NFT title which can go over",
  //     id: 3,
  //     link: "https://google.com",
  //     assetSrc:
  //       "https://s3-alpha-sig.figma.com/img/3eed/7f1e/a58f9432c4ccb45f1915d952fb242650?Expires=1705881600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hYjrxy-JJ-Rv73BWShUd5yRsPBL4KoR7t1u5m3A0vOKMqNKxsmvq-OyTK1s1cEvG-V4ZJzqukb3u4VnAoJ~fvCamhFWHH1thwLebmYgdUJVoSQhKy529XZQ0d4stt655s35xERUUrv8K4Z326E8aluh9lJX8cYFrXUWYTWK9SPtRu0XrXWZ76MqQe15ErKw17pksAX6Efx8Gya2jE83PLNAFwz8el5r7oYytPnJBun7ZtVHPw2tEsZueeHySP7dKQGrwvAOiei9cy1X3yjU2szSyr8Zlu7Y8SIuye1MZskX7ivUpwPHB10TxgyD-I3dpZzWPf2GyLiPJzSZxHJdSJA__",
  //   },
  // ];
  return (
    <Grid display="flex" flexDirection="column" gap="18px" width="100%">
      <Box display="flex" alignItems="center" gap="8px" justifyContent="flex-start">
        <PanelCount>
          <PanelTitle>{count || 0}</PanelTitle>
        </PanelCount>
        <PanelTitle>badges</PanelTitle>
      </Box>
      {!data?.getCmtyUserBadges?.length && !loading && (
        <CmtyActivityEmptyState Image={BadgeIcon} title="No badges yet" />
      )}
      {data?.getCmtyUserBadges && <CardsList config={data?.getCmtyUserBadges} />}
      {hasMore && data?.getCmtyUserBadges?.length >= LIMIT && <SharedShowMoreButton onClick={handleShowMore} />}
    </Grid>
  );
};

export default BadgesPanel;
