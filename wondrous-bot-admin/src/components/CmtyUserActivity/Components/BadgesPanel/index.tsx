import { Grid, Box } from "@mui/material";
import { PanelCount, PanelTitle, StyledButton } from "../shared/styles";
import { CmtyActivityEmptyState, SharedShowMoreButton } from "../shared";
import { useLazyQuery } from "@apollo/client";
import { GET_CMTY_USER_BADGES } from "graphql/queries";
import { useEffect, useMemo, useState } from "react";
import { BadgeIcon } from "components/Icons/Badge";
import SafeImage from "components/SafeImage";
import BadgeModal from "./BadgeModal";

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

const Card = (props) => {
  const { txHash, mediaUrl, name, onClick } = props;

  return (
    <>
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
          <StyledButton onClick={onClick} $reverse={!!txHash}>
            {txHash ? "View Badge" : "Mint now"}
          </StyledButton>
        </Box>
      </Grid>
    </>
  );
};

const CardsList = ({ config, org, cmtyUser }) => {
  const [activeItemId, setActiveItemId] = useState(false);

  const itemConfig = useMemo(() => config?.find((item) => item.id === activeItemId), [activeItemId, config]);
  return (
    <>
      <BadgeModal
        item={itemConfig}
        isOpen={activeItemId && !!itemConfig}
        onClose={() => setActiveItemId(false)}
        org={org}
        cmtyUser={cmtyUser}
      />
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
          <Card key={index} onClick={() => setActiveItemId(item.id)} {...item} />
        ))}
      </Grid>
    </>
  );
};

const BadgesPanel = ({ count, cmtyUser, org }) => {
  const [hasMore, setHasMore] = useState(true);
  const [getCmtyUserBadges, { data, loading, error, fetchMore }] = useLazyQuery(GET_CMTY_USER_BADGES, {
    notifyOnNetworkStatusChange: true,
  });

  const handleInitialFetch = async () => {
    const { data } = await getCmtyUserBadges({
      variables: {
        orgId: org?.id,
        cmtyUserId: cmtyUser?.id,
        limit: LIMIT,
        offset: 0,
      },
    });
    setHasMore(data?.getCmtyUserBadges?.length >= LIMIT);
  };
  useEffect(() => {
    handleInitialFetch();
  }, []);

  const handleShowMore = async () => {
    const res = await fetchMore({
      variables: {
        orgId: org?.id,
        cmtyUserId: cmtyUser?.id,
        limit: LIMIT,
        offset: data?.getCmtyUserBadges?.length,
      },
    });
    setHasMore(res?.data?.getCmtyUserBadges?.length >= LIMIT);
  };

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
      {data?.getCmtyUserBadges && <CardsList config={data?.getCmtyUserBadges} org={org} cmtyUser={cmtyUser} />}
      {hasMore && data?.getCmtyUserBadges?.length >= LIMIT && <SharedShowMoreButton onClick={handleShowMore} />}
    </Grid>
  );
};

export default BadgesPanel;
