import { create } from 'ipfs-http-client';
import axios from 'axios';
import fs from 'fs';

import gateways from './gateways.js';


console.log('Initiating IPFS client');
const ipfs = create();

const getAndPinFromPublicGateways = async (cid) => {
  const metadata = (await axios.get(`${gateways[Math.floor(Math.random()*gateways.length)]}${cid}`)).data
  const image = (await axios.get(metadata.image.replace("ipfs://",gateways[Math.floor(Math.random()*gateways.length)]))).data
  const cidImage = metadata.image.replace("ipfs://","");
  console.log(`Saving ${cid} metadata and ${cidImage} image and local pinning`);
  let writeSource = fs.createWriteStream(`./data/${process.env.ADDRESS}/json/${cid}.json`);
  writeSource.write(JSON.stringify(metadata));
  writeSource = fs.createWriteStream(`./data/${process.env.ADDRESS}/images/${cid}_image`);
  writeSource.write(image);
  if(ipfs){
    ipfs.pin.add(cid).then(cid => {console.log(`${cid} pinnned!`)});
    ipfs.pin.add(cidImage).then(cid => {console.log(`${cidImage} image pinnned!`)});
  }
  return({
    metadata: cid,
    image: cidImage
  })
}

export default getAndPinFromPublicGateways;
