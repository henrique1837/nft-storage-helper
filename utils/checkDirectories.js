import fs from 'fs';

const checkDirectories = () => {
  if (!fs.existsSync('./data')){
      fs.mkdirSync('./data');
  }
  if (!fs.existsSync('./ceramic')){
      fs.mkdirSync('./ceramic');
  }
  const address = process.env.ADDRESS.toLowerCase();
  if (!fs.existsSync(`./data/${address}`)){
      fs.mkdirSync(`./data/${address}`);
  }
  if (!fs.existsSync(`./data/${address}/json`)){
      fs.mkdirSync(`./data/${address}/json`);
  }
  if (!fs.existsSync(`./data/${address}/images`)){
      fs.mkdirSync(`./data/${address}/images`);
  }

  if (!fs.existsSync(`./ceramic/${address}`)){
      fs.mkdirSync(`./ceramic/${address}`);
  }


}

export default checkDirectories;
