import { useQuery } from "@apollo/client";
import { Box, Grid, Typography } from "@mui/material";
import Modal from "components/Shared/Modal";
import { GET_COMMUNITY_NFT_BY_METADATA_ID } from "graphql/queries";
import { useMemo } from "react";
import { DataLabel } from "./styles";
import Ethereum from "assets/ethereum";
import Polygon from "assets/polygonMaticLogo.svg";

export const ChainIcons = {
  ethereum: <Ethereum />,
  polygon: (
    <img
      style={{
        width: "20px",
        marginRight: "8px",
      }}
      src={Polygon}
    />
  ),
  goerli: <Ethereum />
};

const ImageComponent = ({ src }) => (
  <Box width="100%" display="flex" justifyContent="center" alignItems="center">
    <Box
      sx={{
        width: "250px",
        height: "250px",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        borderRadius: "16px",
        backgroundImage: `url(${src})`,
      }}
    />
  </Box>
);

const DataComponent = ({ label, value, type }) => {
  const Wrapper = ({ children }) => {
    if (type === "url") {
      return (
        <a href={value} target="__blank" rel="noreferrer">
          {children}
        </a>
      );
    }
    return <>{children}</>;
  };

  const ChainComponent = useMemo(() => ChainIcons[value] || null, [value]);

  return (
    <Box display="flex" alignItems="center" gap="24px" padding="10px 0px" key={label}>
      <DataLabel>{label}</DataLabel>
      <Box
        borderRadius="6px"
        bgcolor="#e8e8e8"
        display="flex"
        padding="8px"
        justifyContent="center"
        alignItems="center"
        gap="8px"
      >
        <Wrapper>
          {type === "chain" && !!ChainComponent ? ChainComponent : null}
          <Typography
            color="black"
            fontFamily="Poppins"
            fontSize="12px"
            fontWeight={500}
            sx={{ textDecoration: type === "url" ? "underline" : "none", wordBreak: "break-all" }}
          >
            {value}
          </Typography>
        </Wrapper>
      </Box>
    </Box>
  );
};

const ViewNFTComponent = ({ handleClose, data }) => {
  const { data: communityNftData } = useQuery(GET_COMMUNITY_NFT_BY_METADATA_ID, {
    variables: {
      nftMetadataId: data?.id,
    },
    skip: !data?.id,
  });

  const { mediaUrl, name, externalUrl, description, maxSupply, chain } = communityNftData?.getCmtyNFTByMetadataId || {};
  const CONFIG = [
    {
      component: "media",
      key: "mediaUpload",
      value: mediaUrl,
    },
    {
      component: "text",
      label: "Name",
      placeholder: "Enter NFT name",
      key: "name",
      value: name,
      type: "text",
    },
    {
      component: "text",
      label: "External link",
      placeholder: "Enter external link",
      key: "externalUrl",
      value: externalUrl,
      type: "url",
    },
    {
      component: "text",
      label: "Description",
      placeholder: "Provide a description of the item.",
      key: "description",
      value: description,
      type: "textarea",
    },
    {
      component: "text",
      label: "Supply",
      placeholder: "Enter supply",
      key: "maxSupply",
      value: maxSupply > 0 ? `X${maxSupply}` : "Unlimited",
    },
    {
      component: "text",
      label: "Blockchain",
      placeholder: "Select blockchain",
      key: "chain",
      value: chain,
      type: "chain",
    },
  ];
  return (
    <Modal open onClose={handleClose} title={data?.title} maxWidth={640}>
      <Grid display="flex" flexDirection="column" gap="8px">
        {CONFIG.map((item, idx) => {
          return (
            <>
              {item.component === "media" ? <ImageComponent src={item.value} /> : null}

              {item.component === "text" ? (
                <DataComponent label={item.label} value={item.value} type={item.type} />
              ) : null}
            </>
          );
        })}
      </Grid>
    </Modal>
  );
};

export default ViewNFTComponent;
