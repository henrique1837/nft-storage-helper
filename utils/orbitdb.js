import OrbitDB from 'orbit-db';

async function initiateDB(ipfs) {
  // Create OrbitDB instance
  const orbitdb = await OrbitDB.createInstance(ipfs);
  const db = await orbitdb.docs(`storage-helper-db.docs`);
  console.log(db.address);
  return(db);
}

export default initiateDB;
