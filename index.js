import ethers from 'ethers';
import fs from 'fs';
import getAndPinFromPublicGateways from './utils/getAndPinFromPublicGateways.js';
// ERC1155 URI event https://docs.openzeppelin.com/contracts/4.x/api/token/erc1155#IERC1155-URI-string-uint256- //
const abi = [{"type":"event","name":"URI","inputs":[{"type":"string","name":"value","internalType":"string","indexed":false},{"type":"uint256","name":"id","internalType":"uint256","indexed":true}],"anonymous":false}]

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC);
const contract = new ethers.Contract(process.env.ADDRESS,abi,provider);
const fromId = process.env.FROM_ID;

async function main(){

  if (!fs.existsSync('./json')){
      fs.mkdirSync('./json');
  }
  if (!fs.existsSync('./images')){
      fs.mkdirSync('./images');
  }

  console.log('Getting all URIs from NFT contract');
  let filter = contract.filters.URI(null,null);
  let results = await contract.queryFilter(filter,0,'latest');
  if(fromId){
    console.log(`Filtering from id ${fromId}`);
    results = results.filter(res => {
      return(Number(res.args.id) >= Number(fromId));
    })
  }
  console.log(`Total of ${results.length} to be pinned`);
  console.log('Getting cids from metadata and images, pin and save local');
  let i = 1;

  for(let res of results){

    let cid = res.args.value;
    let id = res.args.id;
    console.log(`Getting data from token id ${id}, cid: ${cid}`);
    const savedObj = await getAndPinFromPublicGateways(cid);
    console.log(savedObj);
    console.log(`Done ${i} from ${results.length}`);
    i = i + 1;


  }


}


main();
