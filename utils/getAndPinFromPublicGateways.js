import { create } from 'ipfs-http-client';
import axios from 'axios';
import fs from 'fs';

import gateways from './gateways.js';


console.log('Initiating IPFS client');
const ipfs = create();
const getAndPinFromPublicGateways = async (cid) => {
  let gateway = gateways[Math.floor(Math.random()*gateways.length)];
  console.log(`Using public gateway ${gateway}${cid}`);
  const metadata = (await axios.get(`${gateway}${cid}`,{timeout: 60000})).data
  gateway = gateways[Math.floor(Math.random()*gateways.length)];
  console.log(`Using public gateway ${metadata.image.replace("ipfs://",gateway)}`);
  const image = (await axios.get(metadata.image.replace("ipfs://",gateway),{timeout: 120000})).data
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
    metadata: cid,
    image: cidImage,
    name: metadata.name,
    description: metadata.description,
    external_url: metadata.external_url
  })
}

export default getAndPinFromPublicGateways;
