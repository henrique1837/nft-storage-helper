import ethers from 'ethers';
import getAndPinFromPublicGateways from './utils/getAndPinFromPublicGateways.js';
import checkDirectories from './utils/checkDirectories.js';
import {initiateClient,getERC1155From,getERC721From} from './utils/graphs.js';

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC);
const fromId = process.env.FROM_ID;
const type = process.env.TYPE

async function main(){

  checkDirectories();

  console.log('Getting all URIs from NFT contract');
  const client = await initiateClient(provider);
  let nftsGraph;
  let results = [];
  let cond = true;
  let skip = 0;
  if(type?.toLowerCase() == "erc721"){
    console.log("ERC721 contract");
    while(cond){
      nftsGraph = await getERC721From(client,skip);
      let res = nftsGraph.erc721Contract.tokens;
      if(res.length > 0){
        res.map(item => results.push(item));
        skip = skip + 100;
      } else {
        cond = false;
      }
    }
  } else {
    console.log("ERC1155 contract");
    while(cond){
      nftsGraph = await getERC1155From(client,skip);
      let res = nftsGraph.erc1155Contract.tokens;
      if(res.length > 0){
        res.map(item => results.push(item));
        skip = skip + 100;
      } else {
        cond = false;
      }
    }

  }
  if(results.length == 0){
    console.log("Could not get NFTs, check if FROM_ID and TYPE are correct");
    process.exit();
  }
  console.log('Getting cids from metadata and images, pin and save local');
  let i = 1;

  for(let res of results){

    let cid = res.uri;
    let id = res.identifier;
    console.log(`Getting data from token id ${id}, cid: ${cid}`);
    const savedObj = await getAndPinFromPublicGateways(cid);
    console.log(savedObj);
    console.log(`Done ${i} from ${results.length}`);
    i = i + 1;


  }
  process.exit();

}


main();
