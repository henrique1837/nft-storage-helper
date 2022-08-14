// Import the Ceramic and Tile document clients
import { CeramicClient } from '@ceramicnetwork/http-client'
import { TileDocument } from '@ceramicnetwork/stream-tile'

// Connect to a Ceramic node
const ceramic = new CeramicClient()

// The `id` argument can be a stream ID (to load the latest version)
// or a commit ID (to load a specific version)
async function load(id) {
  const doc =  await TileDocument.load(ceramic, id)
  console.log(doc.content);
  console.log(`Total of ${doc.content.length} metadatas`)

}

load(process.env.DOC_ID)
