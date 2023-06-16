import { useQuery } from "@apollo/client";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useContext, useEffect } from "react";
import useWonderWeb3 from "services/web3/useWonderWeb3"
import {checkNFTAllowance, setNFTApprovalForAll, batchTransferERC1155} from "services/web3/tokenHelpers"
import useEagerConnect from "services/web3/useEagerConnect"


const TestPage = () => {
  // remove before merge
  const { web3Provider } = useWonderWeb3()
  useEagerConnect();

  const contractAddress = '0x2953399124f0cbb46d2cbacd8a89cf0599974963'
  const owner = '0xda069d035585c646e241ce63c4e5c2084887a452'
  const spender = '0xa97EF76725D7A7B3066EA7b6c17C4DAbA469FDbF'
  const tokenId = '98621154128753925190066773332738462629707461629451146306987043088493755528496'
  const handleClick = async () => {
    batchTransferERC1155(web3Provider, "0x2953399124f0cbb46d2cbacd8a89cf0599974963", ["0xa131953f865D94c98f99E0095645DA2FA40eB1AF","0x6aC6d98fE35aA37d8c8BBA7a725c158290B32e3b" ], [tokenId, tokenId],[1,1])
    // await checkNFTAllowance(web3Provider, contractAddress, owner, spender)
    console.log('handleClick')
    // await setNFTApprovalForAll(web3Provider, contractAddress, spender)
  }
  
  return (
    <Grid display="flex" flexDirection="column" height="100%" minHeight="100vh">
      <Grid flex="1" display="flex" justifyContent="center" alignItems="center" gap="14px" flexDirection="column">
        {/* <ConnectWallet />; */}
        <Button onClick={handleClick}>Click me</Button>
      </Grid>
    </Grid>
  );
};

export default TestPage;
