import { NFTStorage, Blob } from 'nft.storage'
import path from 'path'
import fs from 'fs';

const NFT_STORAGE_TOKEN = process.env.API_TOKEN
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })

async function init(){
  // list all files in the directory

  let contracts = fs.readdirSync(`./data`);
  for(let contract of contracts){
    let folders = fs.readdirSync(`./data/${contract}`);
    for(let folder of folders){
      const files = fs.readdirSync(`./data/${contract}/${folder}`);
      console.log(`Storing ${files.length} file(s) from ./data/${contract}/${folder} folder`)

      for(let file of files){
        const data = fs.readFileSync(`./data/${contract}/${folder}/${file}`, 'utf8');
        const { car } = await NFTStorage.encodeBlob(new Blob(data));
        await client.storeCar(car);
      }

    }
  }
  process.exit();
}


init();
