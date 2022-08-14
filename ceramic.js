import { CeramicClient } from '@ceramicnetwork/http-client';
import { TileDocument } from '@ceramicnetwork/stream-tile'
import { randomBytes } from 'crypto';
import { toString,fromString } from 'uint8arrays'
import chalk from 'chalk'

import { DID } from 'dids'
import { getResolver as getKeyResolver } from 'key-did-resolver'
import { getResolver as get3IDResolver } from '@ceramicnetwork/3id-did-resolver'
import { Ed25519Provider } from 'key-did-provider-ed25519';

import fs from 'fs';
// `seed` must be a 32-byte long Uint8Array
async function authenticateWithSecret(seed) {
  const ceramic = new CeramicClient()

  const did = new DID({
    provider: new Ed25519Provider(seed),
    resolver: {
      ...get3IDResolver(ceramic),
      ...getKeyResolver(),
    },
  })

  // Authenticate the DID using the 3ID provider
  await did.authenticate()

  // The Ceramic client can create and update streams using the authenticated DID
  ceramic.did = did
  return(ceramic)
}
async function createDocument(ceramic,content) {
  // The following call will fail if the Ceramic instance does not have an authenticated DID
  const doc = await TileDocument.create(ceramic, content)
  // The stream ID of the created document can then be accessed as the `id` property
  return doc.id
}



export default async function main(docId){
  const contracts = fs.readdirSync(`./ceramic`);
  console.log(`Total of ${contracts.length} contracts folders`)
  let content = []
  for(let contract of contracts){
    let files = fs.readdirSync(`./ceramic/${contract}`);
    console.log(`Storing ${files.length} file(s) from ./ceramic/${contract} folder in Ceramic Network`)
    for(let file of files){
      const data = fs.readFileSync(`./ceramic/${contract}/${file}`, 'utf8');
      content.push(JSON.parse(data));
    }
  }
  const seed = process.env.SEED ? new Uint8Array(fromString(process.env.SEED,'base16')) : new Uint8Array(randomBytes(32));
  const ceramic = await authenticateWithSecret(seed);
  console.log(`Using DID ${chalk.cyan(ceramic.did.id)} with seed ${chalk.red(toString(seed, 'base16'))}`);
  if(!docId){
    const docDid =  await createDocument(ceramic,content);
    console.log(docDid)
  } else {
    const doc = await TileDocument.load(ceramic, docId);
    // The following call will fail if the Ceramic instance does not have an authenticated DID
    await doc.update(content)
    console.log(`${doc.content.length} documents saved in StreamID ${chalk.cyan(doc.id)}`)
  }
  process.exit();
}

try{
  main(process.env.DOC_ID);
} catch(err){
  console.log(err)
  process.exit()
}
