const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');


const main = async() => {
  const provider = new WsProvider('ws://127.0.0.1:9944');
  //const provider = new HttpProvider('http://localhost:9933');
  const api = await ApiPromise.create({ provider });


  // header number from rpc
  api.rpc.chain.subscribeNewHeads((header) => {
    console.log(`Chain is at #${header.number}`);
  });

  const chain = await api.rpc.system.chain();
  console.log(`You are connected to ${chain} !`);

  const certificate_id = await api.query.certificate.certificateId();
  console.log(`Certificate index: ${certificate_id.toHuman()}`);

  let certificate = await api.query.certificate.certificateById(certificate_id.toHuman()-1);

  certificate = certificate.toString();
  console.log(`Certificate is : ${certificate}`);


  //parse json into string
  console.log(`Organization: ${JSON.parse(certificate).org}`);

  let metadata = JSON.parse(certificate).metadata;

  //convert hex into utf8 
  //remove pre-fix 0x in hex
  console.log(`Metadata: ${hexToUtf8(metadata.slice(2,metadata.length))}`);

}

function hexToUtf8(s)
{
  return decodeURIComponent(
     s.replace(/\s+/g, '') // remove spaces
      .replace(/[0-9a-f]{2}/g, '%$&') // add '%' before each 2 characters
  );
}




main();