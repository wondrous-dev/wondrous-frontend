import { useQuery } from "@apollo/client";
import { Box, Grid } from "@mui/material";
import { Label } from "components/QuestsList/styles";
import { GET_COMMUNITY_NFTS_FOR_ORG } from "graphql/queries";
import { useGlobalContext } from "utils/hooks";
import { CardWrapper, NFTImage } from "./style";
import { MediaItem } from "components/Shared/SubmissionMedia/MediaItem";
import { isImage, isVideo } from "utils/media";
import VideoPlayer from "components/Shared/SubmissionMedia/VideoPlayer";
import { StyledViewQuestResults } from "components/ViewQuestResults/styles";
import { useState } from "react";
import ViewNFTComponent from "../ViewNFTComponent";
import EmptyState from "components/EmptyState";
import { EMPTY_STATE_TYPES } from "utils/constants";

const NFTMediaItem = ({ slug, type, name }) => {
  const mediaTypeIsImage = isImage(slug, type);
  const mediaTypeIsVideo = isVideo(slug, type);

  return (
    <>
      {mediaTypeIsImage && <NFTImage src={slug} alt="Media Item" />}
      {mediaTypeIsVideo && <VideoPlayer src={slug} name={name} style={{ width: "10%", height: "10%" }} />}
    </>
  );
};

const NFTList = () => {
  const { activeOrg } = useGlobalContext();

  const [activeNFTData, setActiveNFTData] = useState(null);
  const { data, loading } = useQuery(GET_COMMUNITY_NFTS_FOR_ORG, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    variables: {
      orgId: activeOrg?.id,
    },
    skip: !activeOrg?.id,
  });

  const count = data?.getCommunityNFTsForOrg?.length || 0;

  const handleClose = () => setActiveNFTData(null);

  return (
    <>
    {activeNFTData ? <ViewNFTComponent handleClose={handleClose} data={activeNFTData}/> : null}
    <Grid
      flex="1"
      display="flex"
      flexDirection="column"
      gap="18px"
      width={{
        xs: "100%",
        sm: "70%",
      }}
    >
      <Label>{count} items</Label>
      <Grid display="flex" flexDirection="column" gap="14px" alignItems="center" justifyContent="center">
        {data?.getCommunityNFTsForOrg?.map((item, idx) => {
          const mediaItem = item.media[0];
          return (
            <CardWrapper 
            key={item.tokenId}
            onClick={() => setActiveNFTData({
              tokenId: item.tokenId,
              title: item.name,
              id: item.id,
            })}>
              {/* TODO: change this */}
              <NFTMediaItem slug={item.mediaUrl} type={mediaItem?.type} name={mediaItem?.name} />
              <Label>{item.name}</Label>
              <Box flex="1" justifyContent="flex-end" alignItems="center" display="flex">
                <Box
                  padding="8px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="fit-content"
                  borderRadius="6px"
                  bgcolor="#AF9EFF"
                >
                  <Label fontSize="16px" fontWeight={500} lineHeight="16px">
                    {item.maxSupply > 0 ? `X${item.maxSupply}` : "Unlimited"}
                  </Label>
                </Box>
              </Box>
            </CardWrapper>
          );
        })}
      </Grid>
      {data?.getCommunityNFTsForOrg?.length === 0 && !loading ? <EmptyState type={EMPTY_STATE_TYPES.NFT}/> : null}
    </Grid>
    </>
  );
};

export default NFTList;
