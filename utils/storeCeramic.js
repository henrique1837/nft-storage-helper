import { CeramicClient } from '@ceramicnetwork/http-client'
import { DID } from 'dids'
import { getResolver as getKeyResolver } from 'key-did-resolver'
import { getResolver as get3IDResolver } from '@ceramicnetwork/3id-did-resolver'
import { ThreeIdProvider } from '@3id/did-provider'

// `seed` must be a 32-byte long Uint8Array
async function authenticateWithSecret(seed) {
  const ceramic = new CeramicClient()

  const threeID = await ThreeIdProvider.create({
    seed,
    // See the section above about permissions management
    getPermission: (request) => Promise.resolve(request.payload.paths),
  })

  const did = new DID({
    provider: threeID.getDidProvider(),
    resolver: {
      ...get3IDResolver(ceramic),
      ...getKeyResolver(),
    },
  })

  // Authenticate the DID using the 3ID provider
  await did.authenticate()

  // The Ceramic client can create and update streams using the authenticated DID
  ceramic.did = did
}



export default authenticateWithSecret;
