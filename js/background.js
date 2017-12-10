const parse = require('domain-name-parser')
const queryString = require('query-string')
const Web3 = require('web3')
const resolver = require('./resolver.js')

var isEthDomain = function(url) {
  return (parse(url).tld === "eth")
}

var resolve = function(url) {
  console.log("resolvable url: " + url)
  chrome.tabs.getSelected(null, (tab) => {

    console.log(url)
    resolver.resolve(url)
    .then((ipfsHash) => {
      console.log("IPFS hash: " + ipfsHash)
      chrome.tabs.update(tab.id, {url: "https://gateway.ipfs.io/ipfs/" + ipfsHash})
    })
    .catch((err) => {
      console.log(err)
    })
  })
}

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.url) {
    query = queryString.parse(details.url)
    keys = Object.keys(query)
    keys.forEach((key) => {
      if (isEthDomain(query[key])) {
        resolve(query[key])
      }
    })
  }
}, {urls: ["<all_urls>"]})
