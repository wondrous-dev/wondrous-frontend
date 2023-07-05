import { ethers } from "ethers";
import ERC20ABI from "services/web3/abi/ERC20";
import ERC721ABI from "services/web3/abi/ERC721";
import ERC1155ABI from "services/web3/abi/ERC1155";
import batchTransferABI from "services/web3/abi/batchTransfer";
import {getMultisendAddress, ContractType} from "services/web3/contractRouter";
export async function checkNFTAllowance(
  provider,
  contractAddress: string,
  owner: string,
  operator: string,
) {
  const prov = new ethers.providers.Web3Provider(provider);
  const signer = prov.getSigner();

  const erc721Contract = new ethers.Contract(contractAddress, ERC721ABI, signer);
  try {
    // Call the allowance function to check the allowance
    const allowance = await erc721Contract.isApprovedForAll(owner, operator);
    // Return the allowance value
    return allowance;
  } catch (error) {
    console.error("Error occurred while checking ERC721 allowance:", error);
    throw error;
  }
}

export async function checkERC1155Allowance(
  provider,
  contractAddress: string,
  owner: string,
  operator: string,
) {
  const prov = new ethers.providers.Web3Provider(provider);
  const signer = prov.getSigner();

  const erc1155Contract = new ethers.Contract(contractAddress, ERC1155ABI, signer);
  try {
    // Call the allowance function to check the allowance
    const allowance = await erc1155Contract.isApprovedForAll(owner, operator);
    // Return the allowance value
    return allowance;
  } catch (error) {
    console.error("Error occurred while checking ERC1155 allowance:", error);
    throw error;
  }
}


export async function checkERC20Allowance(provider, contractAddress: string, owner: string, operator: string) {
  const prov = new ethers.providers.Web3Provider(provider);
  const signer = prov.getSigner();

  // const contract = new web3.eth.Contract(ERC721ABI, contractAddress)
  // const allowance = await contract.methods.allowance(owner, operator).call()
  // return allowance
  const erc20Contract = new ethers.Contract(contractAddress, ERC20ABI, signer);
  try {
    // Call the allowance function to check the allowance
    const allowance = await erc20Contract.allowance(owner, operator);
    // Return the allowance value
    return allowance;
  } catch (error) {
    console.error("Error occurred while checking ERC20 allowance:", error);
    throw error;
  }
}

export async function getERC721Balance(provider, contractAddress: string, owner: string) {
  const prov = new ethers.providers.Web3Provider(provider);
  const signer = prov.getSigner();
  const erc721Contract = new ethers.Contract(contractAddress, ERC721ABI, signer);
  try {
    // Call the balance function to check the balance
    const balance = await erc721Contract.balanceOf(owner);
    // Return the balance value
    return balance;
  } catch (error) {
    console.error("Error occurred while checking ERC721 balance:", error);
    throw error;
  }
}

export async function getERC1155Balance(provider, contractAddress: string, owner: string, tokenId: string) {
  const prov = new ethers.providers.Web3Provider(provider);
  const signer = prov.getSigner();
  const erc1155Contract = new ethers.Contract(contractAddress, ERC1155ABI, signer);
  try {
    // Call the balance function to check the balance
    const balance = await erc1155Contract.balanceOf(owner, tokenId);
    // Return the balance value
    return balance;
  } catch (error) {
    console.error("Error occurred while checking ERC1155 balance:", error);
    throw error;
  }
}

export async function getERC20Balance(provider, contractAddress: string, owner: string) {
  const prov = new ethers.providers.Web3Provider(provider);
  const signer = prov.getSigner();
  const erc20Contract = new ethers.Contract(contractAddress, ERC20ABI, signer);
  try {
    // Call the balance function to check the balance
    const balance = await erc20Contract.balanceOf(owner);
    // Return the balance value
    return balance;
  } catch (error) {
    console.error("Error occurred while checking ERC721 balance:", error);
    throw error;
  }
}

export async function approveERC20(provider, contractAddress: string, operator: string, amount: string) {
  const prov = new ethers.providers.Web3Provider(provider);
  const signer = prov.getSigner();
  const erc20Contract = new ethers.Contract(contractAddress, ERC20ABI, signer);
  try {
    // Call the balance function to check the balance
    const tx = await erc20Contract.approve(operator, amount);
    // Return the balance value
    return tx;
  } catch (error) {
    console.error("Error occurred while checking ERC721 balance:", error);
    throw error;
  }
}


export async function setNFTApprovalForAll(provider, contractAddress: string, operator: string) {
  const prov = new ethers.providers.Web3Provider(provider);
  const signer = prov.getSigner();
  const erc1155Contract = new ethers.Contract(contractAddress, ERC1155ABI, signer);
  try {
    // Call the balance function to check the balance
    const tx = await erc1155Contract.setApprovalForAll(operator, true);
    // Return the balance value
    return tx;
  } catch (error) {
    console.error("Error occurred while checking ERC721 balance:", error);
    throw error;
  }
}

export async function setNFTApprovalForAll721(provider, contractAddress: string, operator: string) {
  const prov = new ethers.providers.Web3Provider(provider);
  const signer = prov.getSigner();
  const erc721contract = new ethers.Contract(contractAddress, ERC721ABI, signer);
  try {
    // Call the balance function to check the balance
    const tx = await erc721contract.setApprovalForAll(operator, true);
    // Return the balance value
    return tx;
  } catch (error) {
    console.error("Error occurred while checking ERC721 balance:", error);
    throw error;
  }
}

export async function batchTransferERC1155(provider, tokenAddress: string, addresses: string[], tokenIds: string[], amounts: number[], chain = 137) {
  const prov = new ethers.providers.Web3Provider(provider);
  const signer = prov.getSigner()
  const batchTransferContractAddress = getMultisendAddress(ContractType.ERC1155, chain)
  const batchTransferContract = new ethers.Contract(batchTransferContractAddress, batchTransferABI, signer);
  try {
    // Call the balance function to check the balance
    const tx = await batchTransferContract.batchTransferERC1155(tokenAddress, addresses, tokenIds, amounts, { gasLimit: 2000000 });
    console.log('tx', tx)
    // Return the balance value
    return tx;
  } catch (error) {
    console.error("Error occurred while checking ERC721 balance:", error);
    throw error;
  }
}

export async function batchTransferERC721(provider, tokenAddress: string, addresses: string[], tokenIds: string[], chain = 137) {
  const prov = new ethers.providers.Web3Provider(provider);
  const signer = prov.getSigner()
  const batchTransferContractAddress = getMultisendAddress(ContractType.ERC721, chain)
  const batchTransferContract = new ethers.Contract(batchTransferContractAddress, batchTransferABI, signer);
  try {
    // Call the balance function to check the balance
    const tx = await batchTransferContract.batchTransferERC721(tokenAddress, addresses, tokenIds, { gasLimit: 2000000 });
    console.log('tx', tx)
    // Return the balance value
    return tx;
  } catch (error) {
    console.error("Error occurred while checking ERC721 balance:", error);
    throw error;
  }
}

export async function batchTransferERC20(provider, tokenAddress: string, addresses: string[], amounts: string[], chain = 137) {
  const prov = new ethers.providers.Web3Provider(provider);
  const signer = prov.getSigner()
  const batchTransferContractAddress = getMultisendAddress(ContractType.ERC20, chain)
  const batchTransferContract = new ethers.Contract(batchTransferContractAddress, batchTransferABI, signer);
  try {
    // Call the balance function to check the balance
    const tx = await batchTransferContract.batchTransferERC20(tokenAddress, addresses, amounts, { gasLimit: 2000000 });
    // Return the balance value
    return tx;
  } catch (error) {
    console.error("Error occurred while checking ERC721 balance:", error);
    throw error;
  }
}
