const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const { stringToU8a, u8aToHex, stringToHex} =require('@polkadot/util');

const aesjs = require('aes-js');

const main = async() => {
  const provider = new WsProvider('ws://127.0.0.1:9944');
  //const provider = new HttpProvider('http://localhost:9933');
  const api = await ApiPromise.create({ provider });

  const keyring = new Keyring({ type: 'ed25519' });


  // User C create cv
  const PHRASE_1 = 'velvet coyote color census taste box vital high squirrel spy arrest obey';
  const team = keyring.addFromUri(PHRASE_1);

  /*
  const unsub = await api.tx.cv.createItem(team.address,stringToHex("0x1233445566"),1,2,3
  )
  .signAndSend(team, ({status}) => {
    if (status.isInBlock) {
      console.log(`included in ${status.asInBlock}`);
    }
  });
  */


  //get item_id
  const item_id = await api.query.cv.itemId();
  console.log(`item index: ${item_id.toHuman()}`);

  //get item_by_id by user C
  const item_by_id = await api.query.cv.itemById(item_id-1);
  console.log(`item by id: ${item_by_id}`);

  // User C has own key for encrypt
  // An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
  var cvenkey = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];

  const cvItemBytes = aesjs.utils.utf8.toBytes(item_by_id);
  //console.log(`cvItem: ${cvItem}`);


  // The counter is optional, and if omitted will begin at 1
  var aesCtr = new aesjs.ModeOfOperation.ctr(cvenkey);
  var cvItemEncryptedBytes = aesCtr.encrypt(cvItemBytes);

  // To print or store the binary data, you may convert it to hex
  // CV item is encrypted (hex)
  var cvItemEncryptedHex = aesjs.utils.hex.fromBytes(cvItemEncryptedBytes);
  console.log(cvItemEncryptedHex);



    // Some mnemonic phrase
  const PHRASE = 'virus strike poverty wink release soon garment zone wait frown song govern';

  // Add an account, straight mnemonic
  //Organization B
  const root = keyring.addFromUri(PHRASE);

  console.log(`${root.meta}: has address ${root.address} with publicKey [${root.publicKey}]`);

 // Organization B want to see
 // Organization B must be provide a public key /address

  // The counter is optional, and if omitted will begin at 1
  // Encrypt with pubkey organization B with cvenkey of user C
  //var cvViewKeyBytes = aesCtr.encrypt(root.publicKey);
  // public key of orgnanization B is encrypted (hex)
  //var cvViewKeyHex = aesjs.utils.hex.fromBytes(cvViewKeyBytes);
  //console.log(cvViewKeyHex);

  //const message = stringToU8a('This is a test.');
  
  const cvViewKey = team.encryptMessage(cvenkey, root.publicKey);

  console.log(`cvViewKey:${cvViewKey}`);


  // User C allow view CV or not
  const getCvEnkey = root.decryptMessage(cvViewKey, team.publicKey);

  console.log(`cvViewKey:${getCvEnkey}`);


  // When ready to decrypt the hex string, convert it back to bytes
  var cvItemEncryptedBytes = aesjs.utils.hex.toBytes(cvItemEncryptedHex);
  // Get item CV
  var aesCtr = new aesjs.ModeOfOperation.ctr(cvenkey);
  var decryptedItemCv = aesCtr.decrypt(cvItemEncryptedBytes);

  // Convert our bytes back into text
  var cvItem = aesjs.utils.utf8.fromBytes(decryptedItemCv);
  console.log(`cvItem:${cvItem}`);


  



  /*
  let certificate = await api.query.certificate.certificateById(certificate_id.toHuman()-1);

  certificate = certificate.toString();
  console.log(`Certificate is : ${certificate}`);


  //parse json into string
  console.log(`Organization: ${JSON.parse(certificate).org}`);

  let metadata = JSON.parse(certificate).metadata;

  //convert hex into utf8 
  //remove pre-fix 0x in hex
  console.log(`Metadata: ${hexToUtf8(metadata.slice(2,metadata.length))}`);
*/
}

function hexToUtf8(s)
{
  return decodeURIComponent(
     s.replace(/\s+/g, '') // remove spaces
      .replace(/[0-9a-f]{2}/g, '%$&') // add '%' before each 2 characters
  );
}




main();