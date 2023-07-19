import { Box, Grid, Typography } from "@mui/material";
import { IndexContainer, Label } from "components/AddFormEntity/components/styles";

import { TYPES } from "utils/constants";
import TextField from "components/Shared/TextField";
import Ethereum from "assets/ethereum";
import { Matic } from "components/Icons/web3";
import Optimism from "assets/optimism";
import Avalanche from "assets/avalanche";
import Binance from "assets/binance";
import { useEffect, useState } from "react";
import DropdownSelect from "components/DropdownSelect/DropdownSelect";
import { useLazyQuery } from "@apollo/client";
import { GET_NFT_INFO, GET_TOKEN_INFO } from "graphql/queries";
import { TokenImage, TokenText } from "./styles";
import { ErrorText } from "components/Shared/styles";

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
      if (!value?.verifyTokenName && data?.getTokenInfo?.name) {
        handleOnChange("verifyTokenName", data?.getTokenInfo?.name);
      }
      onChange({
        ...value,
        verifyTokenDecimals: data?.getTokenInfo?.decimals,
        verifyTokenLogoUrl: data?.getTokenInfo?.logoUrl,
        verifyTokenSymbol: data?.getTokenInfo?.symbol,
      });
    },
    fetchPolicy: "network-only",
  });

  const [getNFTInfo] = useLazyQuery(GET_NFT_INFO, {
    onCompleted: (data) => {
      if (!value?.verifyTokenName && data?.getTokenInfo?.name) {
        handleOnChange("verifyTokenName", data?.getTokenInfo?.name);
      }
      onChange({
        ...value,
        verifyTokenDecimals: data?.getTokenInfo?.decimals,
        verifyTokenLogoUrl: data?.getTokenInfo?.logoUrl,
        verifyTokenSymbol: data?.getTokenInfo?.symbol,
      });
    },
    fetchPolicy: "network-only",
  });
  const searchSelectedTokenInList = (contractAddress, chain, existingList = [], tokenId = "") => {
    if (value?.verifyTokenType === "ERC20") {
      getTokenInfo({
        variables: {
          contractAddress,
          chain,
        },
      });
    }
    if (value?.verifyTokenType === "ERC721") {
      getNFTInfo({
        variables: {
          contractAddress,
          chain,
          tokenType: "ERC721",
        },
      });
    }
    if (value?.verifyTokenType === "ERC1155") {
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
    handleOnChange("verifyTokenAddress", addressValue);
  };

  useEffect(() => {
    searchSelectedTokenInList(value?.verifyTokenAddress, value?.verifyTokenChain);
  }, [value?.verifyTokenChain, value?.verifyTokenType, value?.verifyTokenAddress]);

  return (
    <Grid
      gap="8px"
      display="flex"
      alignItems="center"
      style={{
        width: "100%",
        marginBottom: value?.verifyTokenLogoUrl || value?.verifyTokenName ? "30px" : "0px",
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
          value={value?.verifyTokenChain}
          setValue={(value) => handleOnChange("verifyTokenChain", value)}
          innerStyle={{
            marginTop: 0,
          }}
          formSelectStyle={{
            height: "auto",
          }}
          options={chainOptions}
          name="chain"
        />
        {error?.additionalData?.tokenChain && (
          <ErrorText
            style={{
              marginTop: "-10px",
            }}
          >
            Please input a token chain
          </ErrorText>
        )}
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
          value={value?.verifyTokenType}
          setValue={(value) => handleOnChange("verifyTokenType", value)}
          innerStyle={{
            marginTop: 0,
          }}
          formSelectStyle={{
            height: "auto",
          }}
          options={SUPPORTED_ACCESS_CONDITION_TYPES}
        />
        {error?.additionalData?.tokenType && (
          <ErrorText
            style={{
              marginTop: "-10px",
            }}
          >
            Please input a token type
          </ErrorText>
        )}
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
            value={value?.verifyTokenAddress || ""}
            onChange={(value) => handleSelectedTokenInputChange(value)}
            multiline={false}
            error={error?.additionalData?.tokenAddress}
            style={TextInputStyle}
          />
          {(value?.verifyTokenLogoUrl || value?.verifyTokenName) && (
            <Box display="flex" alignItems="center" marginTop="8px" position="absolute" bottom="-32px">
              {value?.verifyTokenLogoUrl && <TokenImage src={value?.verifyTokenLogoUrl} width="24px" height="24px" />}

              <TokenText>
                <span
                  style={{
                    fontWeight: 700,
                    marginRight: "4px",
                  }}
                >
                  {value?.verifyTokenSymbol}
                </span>
                {value?.verifyTokenName}
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
            value={value?.verifyTokenAmount}
            error={error?.additionalData?.tokenAmount ? "Please enter a minimum amount to hold" : null}
            onChange={(value) => handleOnChange("verifyTokenAmount", value)}
            multiline={false}
            style={TextInputStyle}
            type="number"
          />
        </Grid>
      </Box>
      <Grid
        item
        gap="14px"
        display="flex"
        xs={12}
        flexDirection="column"
        style={{
          width: "100%",
          marginTop: value?.verifyTokenLogoUrl || value?.verifyTokenName ? "40px" : "8px",
        }}
      >
        <Label>Token Name</Label>
        <TextField
          placeholder="Token Name"
          value={value?.verifyTokenName}
          error={error?.additionalData?.tokenName}
          onChange={(value) => handleOnChange("verifyTokenName", value)}
          multiline={false}
          style={TextInputStyle}
        />
      </Grid>
      <Grid
        item
        gap="14px"
        display="flex"
        xs={12}
        flexDirection="column"
        style={{
          width: "100%",
          marginTop: "8px",
        }}
      >
        <Label>Token ID (optional for ERC1155)</Label>
        <TextField
          placeholder="Token ID (optional for ERC1155)"
          value={value?.verifyTokenId}
          onChange={(value) => handleOnChange("verifyTokenId", value)}
          multiline={false}
          style={TextInputStyle}
        />
      </Grid>
    </Grid>
  );
};

export default VerifyTokenHoldingComponent;
