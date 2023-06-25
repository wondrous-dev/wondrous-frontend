import { Box, Grid, Typography } from "@mui/material";
import { IndexContainer, Label } from "components/AddFormEntity/components/styles";

import { TYPES } from "utils/constants";
import TextField from "components/Shared/TextField";
import Ethereum from "assets/ethereum";
import { Matic } from "components/Icons/web3";
import Optimism from "assets/optimism";
import Avalanche from "assets/avalanche";
import Binance from "assets/binance";
import { useState } from "react";
import DropdownSelect from "components/DropdownSelect/DropdownSelect";
import { useLazyQuery } from "@apollo/client";
import { GET_NFT_INFO, GET_TOKEN_INFO } from "graphql/queries";
import { TokenImage, TokenText } from "./styles";

const chainOptions = [
  {
    label: "Ethereum",
    icon: <Ethereum />,
    value: "ethereum",
  },
  {
    label: "Polygon",
    icon: <Matic />,
    value: "polygon",
  },
  {
    label: "Optimism",
    icon: <Optimism />,
    value: "optimism",
  },
  {
    label: "Avalanche",
    icon: <Avalanche />,
    value: "avalanche",
  },
  {
    label: "BNB",
    icon: <Binance />,
    value: "bsc",
  },
];

const SUPPORTED_ACCESS_CONDITION_TYPES = [
  {
    label: "ERC20",
    value: "ERC20",
  },
  {
    label: "ERC721",
    value: "ERC721",
  },
  {
    label: "ERC1155",
    value: "ERC1155",
  },
];
const TextInputStyle = {
  width: "85%",
};

const VerifyTokenHoldingComponent = ({ onChange, value, stepType, error }) => {
  const handleOnChange = (key, val) => {
    onChange({
      ...value,
      [key]: val,
    });
  };
  const [getTokenInfo] = useLazyQuery(GET_TOKEN_INFO, {
    onCompleted: (data) => {
      handleOnChange("verifyHoldingTokenInfo", {
        ...value?.verifyHoldingTokenInfo,
        contractAddress: data?.getTokenInfo?.contractAddress,
        decimals: data?.getTokenInfo?.decimals,
        logoUrl: data?.getTokenInfo?.logoUrl,
        name: data?.getTokenInfo?.name,
        symbol: data?.getTokenInfo?.symbol,
      });
    },
    fetchPolicy: "network-only",
  });

  const [getNFTInfo] = useLazyQuery(GET_NFT_INFO, {
    onCompleted: (data) => {
      handleOnChange("verifyHoldingTokenInfo", {
        ...value?.verifyHoldingTokenInfo,
        contractAddress: data?.getTokenInfo?.contractAddress,
        decimals: data?.getTokenInfo?.decimals,
        logoUrl: data?.getTokenInfo?.logoUrl,
        name: data?.getTokenInfo?.name,
        symbol: data?.getTokenInfo?.symbol,
      });
    },
    fetchPolicy: "network-only",
  });
  const searchSelectedTokenInList = (contractAddress, chain, existingList = [], tokenId = "") => {
    if (value?.verifyTokenHoldingType === "ERC20") {
      getTokenInfo({
        variables: {
          contractAddress,
          chain,
        },
      });
    }
    if (value?.verifyTokenHoldingType === "ERC721") {
      getNFTInfo({
        variables: {
          contractAddress,
          chain,
          tokenType: "ERC721",
        },
      });
    }
    if (value?.verifyTokenHoldingType === "ERC1155") {
      getNFTInfo({
        variables: {
          contractAddress,
          chain,
          tokenType: "ERC1155",
          tokenId,
        },
      });
    }
  };

  const handleSelectedTokenInputChange = (addressValue) => {
    let foundToken;
    if (addressValue && addressValue.length === 42 && addressValue.startsWith("0x")) {
      if (value?.verifyTokenHoldingType === "ERC20") {
        foundToken = searchSelectedTokenInList(addressValue, value?.verifyTokenHoldingChain);
      } else if (value?.verifyTokenHoldingType === "ERC721" || value?.verifyTokenHoldingType === "ERC1155") {
        foundToken = searchSelectedTokenInList(addressValue, value?.verifyTokenHoldingChain);
      }
      handleOnChange("verifyHoldingTokenAddress", addressValue);
    }
  };
  return (
    <Grid
      gap="8px"
      display="flex"
      alignItems="center"
      style={{
        width: "100%",
        marginBottom: value?.verifyHoldingTokenInfo?.logoUrl ? "30px" : "0px",
      }}
      direction="column"
    >
      <Grid
        item
        gap="14px"
        display="flex"
        flexDirection="column"
        xs={12}
        style={{
          width: "100%",
        }}
      >
        <Label>Chain</Label>
        <DropdownSelect
          value={value?.verifyTokenHoldingChain}
          setValue={(value) => handleOnChange("verifyTokenHoldingChain", value)}
          innerStyle={{
            marginTop: 0,
          }}
          formSelectStyle={{
            height: "auto",
          }}
          options={chainOptions}
          name="chain"
        />
      </Grid>
      <Grid
        item
        gap="14px"
        display="flex"
        flexDirection="column"
        xs={12}
        style={{
          width: "100%",
        }}
      >
        <Label>Token Type</Label>
        <DropdownSelect
          value={value?.verifyTokenHoldingType}
          setValue={(value) => handleOnChange("verifyTokenHoldingType", value)}
          innerStyle={{
            marginTop: 0,
          }}
          formSelectStyle={{
            height: "auto",
          }}
          options={SUPPORTED_ACCESS_CONDITION_TYPES}
        />
      </Grid>
      <Box display="flex" alignItems="center" width="100%" marginTop="8px">
        <Grid
          item
          gap="14px"
          display="flex"
          xs={12}
          style={{
            width: "100%",
            position: "relative",
          }}
          flexDirection="column"
        >
          <Label>Token</Label>
          <TextField
            placeholder="Paste in contract address"
            value={value?.verifyHoldingTokenAddress || ""}
            onChange={(value) => handleSelectedTokenInputChange(value)}
            multiline={false}
            error={error}
            style={TextInputStyle}
          />
          {value?.verifyHoldingTokenInfo?.logoUrl && (
            <Box display="flex" alignItems="center" marginTop="8px" position="absolute" bottom="-32px">
              <TokenImage src={value?.verifyHoldingTokenInfo?.logoUrl} width="24px" height="24px" />
              <TokenText>
                <span
                  style={{
                    fontWeight: 700,
                    marginRight: "4px",
                  }}
                >
                  {value?.verifyHoldingTokenInfo?.symbol}
                </span>
                {value?.verifyHoldingTokenInfo?.name}
              </TokenText>
            </Box>
          )}
        </Grid>
        <Grid
          item
          gap="14px"
          display="flex"
          xs={12}
          flexDirection="column"
          style={{
            width: "100%",
          }}
        >
          <Label>Min. amount to hold</Label>
          <TextField
            placeholder="Min amount member needs to hold"
            value={value?.verifyHoldingTokenAmount}
            error={error}
            onChange={(value) => handleOnChange("verifyHoldingTokenAmount", value)}
            multiline={false}
            style={TextInputStyle}
            type="number"
          />
        </Grid>
      </Box>
    </Grid>
  );
};

export default VerifyTokenHoldingComponent;
