const Web3 = require('web3')
const namehash = require('eth-ens-namehash')
const multihash = require('multihashes')

const REGISTRAR_MAIN_NET = "0x314159265dd8dbb310642f98f50c066173c1259b"
const REGISTRAR_ROPSTEN = "0x112234455c3a32fd11230c42e7bccd4a84e02010"

var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/0pzfHdAhsqakqtBk8Hs6"))

var abi = {
  registrar: JSON.parse(require('../contracts/registrar.js')),
  resolver: JSON.parse(require('../contracts/resolver.js'))
}

module.exports.resolve = function(name) {

  let hash = namehash.hash(name)
  Registrar = new web3.eth.Contract(abi.registrar, REGISTRAR_MAIN_NET)

  return new Promise((resolve, reject) => {
    Registrar.methods.resolver(hash).call()
    .then((address) => {
      if (address === '0x0000000000000000000000000000000000000000') {
        reject(null)
      } else {
        console.log(address)
        Resolver = new web3.eth.Contract(abi.resolver, address)
        return Resolver.methods.content(hash).call()
      }
    })
    .then((contentHash) => {
      console.log("Hash: " + contentHash)
      // Remove 0x prefix
      hex = contentHash.substring(2)
      // Convert to buffer
      buf = multihash.fromHexString(hex)
      // Multihash encode and convert to base58
      resolve(multihash.toB58String(multihash.encode(buf, 'sha2-256')))
    })
  })
}
