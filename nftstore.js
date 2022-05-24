import { NFTStorage, File, Blob } from 'nft.storage';
import fs from 'fs';
const NFT_STORAGE_TOKEN = process.env.API_TOKEN
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })

// list all files in the directory
fs.readdir(`./${process.env.FOLDER}`, (err, files) => {
    if (err) {
        throw err;
    }

    // files object contains all files names
    // log them on console
    let i = 0;
    console.log(`Adding ${files.length} to be pined`);
    files.forEach(file => {
        i = i++;
        fs.readFile(`./${process.env.FOLDER}/${file}`, 'utf8', async (err, data) => {
          const { car } = await NFTStorage.encodeBlob(new Blob(data));
          client.storeCar(car);
          console.log(`${cid} added to nft.storage filecoin pin service`);
        });
        if(i == files.length - 1){
          process.exit();
        }
    });
});
