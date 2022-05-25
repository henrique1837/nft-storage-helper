import fs from 'fs';

const checkDirectories = () => {
  if (!fs.existsSync('./data')){
      fs.mkdirSync('./data');
  }
  if (!fs.existsSync(`./data/${process.env.ADDRESS}`)){
      fs.mkdirSync(`./data/${process.env.ADDRESS}`);
  }
  if (!fs.existsSync(`./data/${process.env.ADDRESS}/json`)){
      fs.mkdirSync(`./data/${process.env.ADDRESS}/json`);
  }
  if (!fs.existsSync(`./data/${process.env.ADDRESS}/images`)){
      fs.mkdirSync(`./data/${process.env.ADDRESS}/images`);
  }
}

export default checkDirectories;
