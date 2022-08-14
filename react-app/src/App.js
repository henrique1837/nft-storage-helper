import React, { useState, useEffect,useMemo, useRef,useCallback } from 'react'
import {
  Button,
  Box,
  Header,
  Heading,
  Paragraph,
  Anchor,
  Footer,
  Image,
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow
 } from 'grommet';

import {
  useParams
} from 'react-router-dom';

import { CeramicClient } from '@ceramicnetwork/http-client'
import { TileDocument } from '@ceramicnetwork/stream-tile'

// Connect to a Ceramic node
const ceramic = new CeramicClient("https://gateway-clay.ceramic.network")



export default function App () {

  const {docId} = useParams();
  const [documents,setDocs] = useState();
  console.log(docId)
  // The `id` argument can be a stream ID (to load the latest version)
  // or a commit ID (to load a specific version)
  const load = async (id) => {
    const doc =  await TileDocument.load(ceramic, id)
    console.log(doc.content);
    console.log(`Total of ${doc.content.length} metadatas`)
    return(doc.content)

  }

  useMemo(async () => {
    if(docId && !documents){
      const newDocuments = await load(docId);
      console.log(newDocuments)
      setDocs(newDocuments);
    }
  },[docId,documents]);
  return (
        <center>

        <Header background="brand" align="start">
          <Heading margin="small">NFT Storage Helper UI</Heading>
          <Box align="end" pad="medium" alignContent="center" >

          </Box>
        </Header>
        <Heading level="2">Documents</Heading>
        {
          documents &&
          <>
          <Paragraph>
          {`StreamID: ${docId}`}
          </Paragraph>
          <Paragraph>
          {`Total of ${documents.length} metadatas`}
          </Paragraph>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell scope="col" border="bottom">
                  Contract
                </TableCell>
                <TableCell scope="col" border="bottom">
                  Token ID
                </TableCell>
                <TableCell scope="col" border="bottom">
                  Name
                </TableCell>
                <TableCell scope="col" border="bottom">
                  External URL
                </TableCell>
                <TableCell scope="col" border="bottom">
                  Image
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
            {
              documents.map(item => {
                return(
                  <TableRow>
                    <TableCell scope="row" size="xsmall">
                      <strong>{item.address}</strong>
                    </TableCell>
                    <TableCell size="xxsmall">{item.id}</TableCell>
                    <TableCell size="small"><Anchor href={`https://nftstorage.link/ipfs/${item.metadata}`} label={item.name} target="_blank" rel="noreferrer"/></TableCell>
                    <TableCell size="medium"><Anchor href={item.external_url} label={item.external_url} target="_blank" rel="noreferrer"/></TableCell>
                    <TableCell><Anchor href={`https://nftstorage.link/ipfs/${item.image}`} label={<Image fit="cover" src={`https://nftstorage.link/ipfs/${item.image}`} style={{width: "100px"}} />} target="_blank" rel="noreferrer"/></TableCell>

                  </TableRow>
                )
              })
            }
            </TableBody>
          </Table>
          </>
        }
        <Footer background="brand" pad="medium" size="small">
          <Anchor href="https://github.com/henrique1837/nft-storage-helper" target="_blank" rel="noreferrer">Github</Anchor>        </Footer>
        </center>
      )
}
