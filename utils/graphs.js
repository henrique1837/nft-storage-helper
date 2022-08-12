import fetch from 'node-fetch'
globalThis.fetch = fetch
import { Client as createClient} from "@urql/core"
// Modify API_URL according to needs


// Supports only ERC721
const APIURL_ETH_ERC721 = "https://api.thegraph.com/subgraphs/name/quantumlyy/eip721-subgraph-mainnet";
const APIURL_POLYGON_ERC721 = "https://api.thegraph.com/subgraphs/name/quantumlyy/eip721-subgraph-matic";
const APIURL_BOBA_ERC721 = "https://api.thegraph.com/subgraphs/name/quantumlyy/eip721-subgraph-boba";

// Supports ERC721 / ERC1155 or only ERC721
const APIURL_XDAI_ERC721_ERC1155 = "https://api.thegraph.com/subgraphs/name/leon-do/xdai-erc721-erc1155";
const APIURL_BSC_ERC721_ERC1155 = "https://api.thegraph.com/subgraphs/name/leon-do/bsc-erc721-erc1155";
const APIURL_AVALANCHE_ERC721_ERC1155 = "https://api.thegraph.com/subgraphs/name/leon-do/avalanche-erc721-erc1155";
const APIURL_RINKEBY_ERC721_ERC1155 = "https://api.thegraph.com/subgraphs/name/leon-do/rinkeby-erc721-erc1155";

// Supports only ERC1155

const APIURL_POLYGON_ERC1155 = "https://api.thegraph.com/subgraphs/name/quantumlyy/eip1155-subgraph-matic";


const type = process.env.TYPE
const fromId = process.env.FROM_ID ? Number(process.env.FROM_ID) : 0;


export const initiateClient = async (provider) => {
   let newClient;
   const {chainId} = await provider.getNetwork();
   if(chainId === 1){
     newClient = createClient({
       url: APIURL_ETH_ERC721,
     })
   }
   if(chainId === 0x64){
     newClient = createClient({
       url: APIURL_XDAI_ERC721_ERC1155,
     })
   }
   if(chainId === 137){
     newClient = createClient({
       url: type?.toLowerCase() == "erc721" ? APIURL_POLYGON_ERC721 : APIURL_POLYGON_ERC1155,
     })
   }
   if(chainId === 56){
     newClient = createClient({
       url: APIURL_BSC_ERC721_ERC1155,
     })
   }
   if(chainId === 288){
     newClient = createClient({
       url: APIURL_BOBA_ERC721,
     })
   }
   if(chainId === 43114){
     newClient = createClient({
       url: APIURL_AVALANCHE_ERC721_ERC1155,
     })
   }
   if(chainId === 4){
     newClient = createClient({
       url: APIURL_RINKEBY_ERC721_ERC1155,
     })
   }
   return(newClient);
}

export const getERC1155From = async (client) => {
  const address = process.env.ADDRESS;

  const tokensQuery = `
    query {

        erc1155Contract(id: "${address.toLowerCase()}") {
          id,
          tokens(where: {identifier_gte: ${fromId}},orderBy: identifier) {
            id,
            identifier,
            uri
          }
        }
    }
  `
  const results = await client.query(tokensQuery).toPromise()
  return(results.data);
}

export const getERC721From = async (client) => {
  const address = process.env.ADDRESS;
  const tokensQuery = `
    query {

        erc721Contract(id: "${address.toLowerCase()}") {
          id,
          tokens(where: {identifier_gte: ${fromId}},orderBy: identifier) {
            id,
            identifier,
            uri
          }
        }
    }
  `

  const results = await client.query(tokensQuery).toPromise()
  return(results.data);
}
