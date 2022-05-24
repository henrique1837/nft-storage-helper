import ethers from 'ethers';
import fs from 'fs';
import getAndPinFromPublicGateways from './utils/getAndPinFromPublicGateways.js';

// ERC1155 URI event https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#IERC721-Transfer-address-address-uint256-
const abi = [{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"}]

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC);
const contract = new ethers.Contract(process.env.ADDRESS,abi,provider);
const fromId = process.env.FROM_ID;
if(fromId){
  console.log(`Filtering from id ${fromId}`);
  results = results.filter(res => {
    return(Number(res.args.id) >= Number(fromId));
  })
}


console.log('Initiating IPFS client');
const ipfs = create();
async function main(){

  if (!fs.existsSync('./json')){
      fs.mkdirSync('./json');
  }
  if (!fs.existsSync('./images')){
      fs.mkdirSync('./images');
  }

  console.log('Getting all URIs from NFT contract');
  let filter = contract.filters.Transfer(0x0000000000000000000000000000000000000000,null,null);
  const results = await contract.queryFilter(filter,0,'latest');
  console.log(`Total of ${results.length} to be pinned`);
  console.log('Getting cids from metadata and images, pin and save local');
  let i = 1;
  for(let res of results){

    const id = res.args.id;
    const tokenURI = await contract.tokenURI(id);
    const cid = tokenURI.replace("ipfs://","");
    console.log(`Getting data from token id ${id}, cid: ${cid}`);
    const savedObj = await getAndPinFromPublicGateways(cid);
    console.log(savedObj);
    console.log(`Done ${i} from ${results.length}`);
    i = i++;


  }


}


main();
