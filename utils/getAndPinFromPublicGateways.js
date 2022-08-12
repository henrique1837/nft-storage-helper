import axios from 'axios';
import fs from 'fs';

import gateways from './gateways.js';



const getAndPinFromPublicGateways = async (cid,ipfs) => {
  const gateway = gateways[Math.floor(Math.random()*gateways.length)];
  console.log(`Using public gateway ${gateway}${cid}`)
  const metadata = (await axios.get(`${gateway}${cid}`)).data
  const image = (await axios.get(metadata.image.replace("ipfs://",gateways[Math.floor(Math.random()*gateways.length)]))).data
  const cidImage = metadata.image.replace("ipfs://","");
  console.log(`Saving ${cid} metadata and ${cidImage} image and local pinning`);
  let writeSource = fs.createWriteStream(`./data/${process.env.ADDRESS}/json/${cid}.json`);
  writeSource.write(JSON.stringify(metadata));
  writeSource = fs.createWriteStream(`./data/${process.env.ADDRESS}/images/${cid}_image`);
  writeSource.write(image);
  if(ipfs){
    ipfs.pin.add(cid).then(cid => {console.log(`${cid} pinnned!`)}).catch(err => {
      console.log(err.message)
    });
    ipfs.pin.add(cidImage).then(cid => {console.log(`${cidImage} image pinnned!`)}).catch(err => {
      console.log(err.message)
      console.log("Local IPFS node not running")
    });
  }
  return({
    contract: process.env.ADDRESS.toLowerCase(),
    rpc: process.env.RPC,
    name: metadata.name ? metadata.name : null,
    description: metadata.description ? metadata.description : null,
    external_url: metadata.external_url ? metadata.external_url : null,
    metadata: cid,
    image: cidImage
  })
}

export default getAndPinFromPublicGateways;
