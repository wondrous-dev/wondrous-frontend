import snapshot from '@snapshot-labs/snapshot.js'

import {
  Proposal,
  Space,
  Vote
} from './types'


import ENS, { getEnsAddress } from '@ensdomains/ensjs'
import { ethers, Transaction } from 'ethers'

export const isValidSpace = (space: Space): any => (
  snapshot.utils.validateSchema(
    snapshot.schemas.space,
    space
  )
);

export const isValidProposal = (proposal: Proposal): any => (
  snapshot.utils.validateSchema(
    snapshot.schemas.proposal,
    proposal
  )
);

export const isValidVote = (vote: Vote): any => (
  snapshot.utils.validateSchema(
    snapshot.schemas.vote,
    vote
  )
);


/*

// sets text record, DOES NOT validate object @ url
export const setTextRecord = async (domain: string, url: string): Promise<Transaction> => {
  console.log(`Getting provider...`);
  const provider = ethers.provider;
  console.log(provider);
  console.log(`Getting ENS info`);
  const ens = new ENS({
    provider: ethers.provider,
    ensAddress: await getEnsAddress(`${await ethers.provider._networkPromise.then(e=>e.chainId)}`)
  });
  console.log(ens)
  console.log(`Setting new Text Record...`);
  const name = await ens.name(domain);

  const tx = await name.setText('snapshot', url);
  console.log(tx);
  return tx;
}

export const uploadSpaceToIPFS = async (config?: Space | null): Promise<string | undefined> => {
  try {
    // if no input, uses default space JSON for testing
    const space: Space = config ? config : spaceJSON;
    console.log(`Formatting JSON...`);

    // format config into compatible JSON
    const json = JSON.stringify(space, null, 2);
    const added = await ipfs.add(json);

    const url = `https://ipfs.infura.io/ipfs/${added.path}`;

    // updates IPFS history to local file, will be updated to a db insert
    // can be commented out later
    updateIPFSHistory(url);
    console.log(`Successfully Uploaded to IPFS at \n\t${url}.`);
    return url;
  } catch (error) {
    console.error('Error uploading to IFPS:', error);
  }
}

export const requireSpace = (space: Space): (boolean | undefined) => {
  const validator = isValidSpace(space);
  if (validator === true) {
    console.log(`Space is valid.`);
    return true;
  } else {
    console.error(validator);
    throw Error(`Error: Invalid space`);
  }
}


// helper function to upload to local file

interface IPFSUpload {
  index: number;
  time: string;
  ipfs: string;
}

const updateIPFSHistory = (ipfs: string): void => {
  try {
    const uploads: IPFSUpload[] = uploadsJSON;

    console.log(`Getting previous upload data...`);
    // get current index from previous uploads
    const index: number = uploads.length > 0
      ? uploads[uploads.length-1].index + 1
      : 0;

    // get current time
    const time: string = new Date(Date.now()).toUTCString();

    console.log(`Compiling new upload data.`);
    // get new upload
    const newUpload: IPFSUpload = {
      index,
      time,
      ipfs
    }
    uploads.push(newUpload);

    console.log(`New upload data compiled.`);
    const json = JSON.stringify(uploads, null, 2);

    const file = './scripts/lib/ipfsUploads.json';
    fs.writeFileSync(file, json);
    console.log(`New upload data saved.`);
  } catch (err: any) {
    console.error(err);
  }
}

const main = async (): Promise<void> => {
  //console.log(`Uploading space to IPFS...`);
  //await uploadSpaceToIPFS();

  console.log(`Setting new text record`)
  await setTextRecord('myssynglynx.eth', uploadsJSON[uploadsJSON.length-1].ipfs)
  console.log(`Complete.`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
*/
