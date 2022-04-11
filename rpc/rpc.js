const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');

/* const rpc = {
  cv: {
    getCvItem: {
      description: "Get cv item",
      params: [],
      types:
      {
            // mapping the actual specified address format
        Address: 'AccountId',
        // mapping the lookup
        LookupSource: 'AccountId',
        WhoAndWhen: {
          account: "AccountId",
          block: "u32",
          time: "u64",
        },
        Item:{
          item_id:"u32",
          owner: "AccountId",
          created:"WhoAndWhen",
          period_from: "Option<u64>",
          period_to: "Option<u64>",
          certificate_id:"Option<u32>",
          score: "u32",
          keywords: "Vec<Vec<u8>>",
          metadata: "Vec<u8>",
        }
      }
    }
  }
} */


const rpc = {
  cv: {
    getCvItem: {
      description: "Get cv item",
      params: [],
      types: "Vec<Item>"
    }
  }
} 

const main = async() => {
  const provider = new WsProvider('ws://127.0.0.1:9944');
  //const provider = new HttpProvider('http://localhost:9933');
  const api = await ApiPromise.create({ provider, rpc });

  const cv = await api.rpc.cv.getCvItem();
  console.log(cv);



}




main();