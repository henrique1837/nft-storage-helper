import ethers from 'ethers';
import { create } from 'ipfs-http-client';

import getAndPinFromPublicGateways from './utils/getAndPinFromPublicGateways.js';
import checkDirectories from './utils/checkDirectories.js';
import {initiateClient,getERC1155From,getERC721From} from './utils/graphs.js';
import initiateDB from './utils/orbitdb.js';

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC);
const fromId = process.env.FROM_ID;
const type = process.env.TYPE

console.log('Initiating IPFS client');
const ipfs = create();

async function main(){

  checkDirectories();
  //const db = await initiateDB(ipfs);
  console.log('Getting all URIs from NFT contract');
  const client = await initiateClient(provider);
  let nftsGraph;
  let results;
  if(type?.toLowerCase() == "erc721"){
    console.log("ERC721 contract");
    nftsGraph = await getERC721From(client);
    results = nftsGraph.erc721Contract.tokens;
  } else {
    console.log("ERC1155 contract");
    nftsGraph = await getERC1155From(client);
    results = nftsGraph.erc1155Contract.tokens;

  }
  if(results?.length == 0 || !results){
    console.log("Could not get NFTs, check if FROM_ID and TYPE are correct");
    process.exit();
  }
  console.log('Getting cids from metadata and images, pin and save local');
  let i = 1;

  for(let res of results){

    let cid = res.uri;
    let id = res.identifier;
    console.log(`Getting data from token id ${id}, cid: ${cid}`);
    let savedObj = await getAndPinFromPublicGateways(cid,ipfs);
    const network = await provider.getNetwork();
    savedObj.id = id;
    savedObj._id = `${process.env.ADDRESS.toLowerCase()}.${id}.${network.chainId}`;
    console.log(savedObj);
    //const hash = await db.put(savedObj)
    //console.log(`Data saved: ${hash}`);
    console.log(`Done ${i} from ${results.length}`);
    i = i + 1;


  }
  process.exit();

}


main();
