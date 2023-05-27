import { ethers } from "ethers";
import ERC20ABI from "services/web3/abi/ERC20";
import ERC721ABI from "services/web3/abi/ERC721";
import ERC1155ABI from "services/web3/abi/ERC1155";

export async function checkNFTAllowance(
  provider,
  contractAddress: string,
  owner: string,
  operator: string,
) {
  const prov = new ethers.providers.Web3Provider(provider);
  const signer = prov.getSigner()

  // const contract = new web3.eth.Contract(ERC721ABI, contractAddress)
  // const allowance = await contract.methods.allowance(owner, operator).call()
  // return allowance
  const erc721Contract = new ethers.Contract(contractAddress, ERC721ABI, signer);
  try {
    // Call the allowance function to check the allowance
    const allowance = await erc721Contract.isApprovedForAll(owner, operator);
    console.log('allowance', allowance)
    // Return the allowance value
    return allowance;
  } catch (error) {
    console.error("Error occurred while checking ERC721 allowance:", error);
    throw error;
  }
}

export async function checkERC20Allowance(
  provider,
  contractAddress: string,
  owner: string,
  operator: string,
) {
  const prov = new ethers.providers.Web3Provider(provider);
  const signer = prov.getSigner()

  // const contract = new web3.eth.Contract(ERC721ABI, contractAddress)
  // const allowance = await contract.methods.allowance(owner, operator).call()
  // return allowance
  const erc20Contract = new ethers.Contract(contractAddress, ERC20ABI, signer);
  try {
    // Call the allowance function to check the allowance
    const allowance = await erc20Contract.allowance(owner, operator);
    console.log('allowance', allowance)
    // Return the allowance value
    return allowance;
  } catch (error) {
    console.error("Error occurred while checking ERC721 allowance:", error);
    throw error;
  }
}

export async function getERC721Balance(
  provider,
  contractAddress: string,
  owner: string,
) {
  const prov = new ethers.providers.Web3Provider(provider);
  const signer = prov.getSigner()
  const erc721Contract = new ethers.Contract(contractAddress, ERC721ABI, signer);
  try {
    // Call the balance function to check the balance
    const balance = await erc721Contract.balanceOf(owner);
    console.log('balance', balance)
    // Return the balance value
    return balance;
  } catch (error) {
    console.error("Error occurred while checking ERC721 balance:", error);
    throw error;
  }
}

export async function getERC1155Balance(
  provider,
  contractAddress: string,
  owner: string,
  tokenId: string,
) {
  const prov = new ethers.providers.Web3Provider(provider);
  const signer = prov.getSigner()
  const erc1155Contract = new ethers.Contract(contractAddress, ERC1155ABI, signer);
  try {
    // Call the balance function to check the balance
    const balance = await erc1155Contract.balanceOf(owner, tokenId);
    console.log('balance', balance)
    // Return the balance value
    return balance;
  } catch (error) {
    console.error("Error occurred while checking ERC721 balance:", error);
    throw error;
  }
}

export async function getERC20Balance(
  provider,
  contractAddress: string,
  owner: string,
) {
  const prov = new ethers.providers.Web3Provider(provider);
  const signer = prov.getSigner()
  const erc20Contract = new ethers.Contract(contractAddress, ERC20ABI, signer);
  try {
    // Call the balance function to check the balance
    const balance = await erc20Contract.balanceOf(owner);
    console.log('balance', balance)
    // Return the balance value
    return balance;
  } catch (error) {
    console.error("Error occurred while checking ERC721 balance:", error);
    throw error;
  }
}

export async function approveERC20(
  provider,
  contractAddress: string,
  operator: string,
  amount: string, 
) {
  const prov = new ethers.providers.Web3Provider(provider);
  const signer = prov.getSigner()
  const erc20Contract = new ethers.Contract(contractAddress, ERC20ABI, signer);
  try {
    // Call the balance function to check the balance
    const tx = await erc20Contract.approve(operator, amount);
    console.log('tx', tx)
    // Return the balance value
    return tx;
  } catch (error) {
    console.error("Error occurred while checking ERC721 balance:", error);
    throw error;
  }
}

export async function setNFTApprovalForAll(
  provider,
  contractAddress: string,
  operator: string,
) {
  const prov = new ethers.providers.Web3Provider(provider);
  const signer = prov.getSigner()
  const erc1155Contract = new ethers.Contract(contractAddress, ERC1155ABI, signer);
  try {
    // Call the balance function to check the balance
    const tx = await erc1155Contract.setApprovalForAll(operator, true);
    console.log('tx', tx)
    // Return the balance value
    return tx;
  } catch (error) {
    console.error("Error occurred while checking ERC721 balance:", error);
    throw error;
  }
}
