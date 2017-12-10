const Web3 = require('web3')
const resolver = require('./resolver.js')

// var isEthDomain = function(url) {
//   let index = url.lastIndexOf('.')
//   let tld = url.substring(index + 1, url.length - 1)
//   return tld === "eth"
// }

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

// chrome.webNavigation.onBeforeNavigate.addListener((details) => {
//   if (details.url) {
//     query = queryString.parse(details.url)
//     keys = Object.keys(query)
//     keys.forEach((key) => {
//       if (isEthDomain(query[key])) {
//         resolve(query[key])
//       }
//     })
//   }
// }, {urls: ["<all_urls>"]})

chrome.webRequest.onBeforeRequest.addListener((details) => {
  let url = details.url.replace('http://', '')
  let name = url.substring(0, url.length - 1)
  chrome.tabs.getSelected(null, (tab) => {
    chrome.tabs.update(tab.id, {url: "https://gateway.ipfs.io"})
    resolver.resolve(name)
    .then((ipfsHash) => {
      console.log("IPFS hash for " + name + ": " + ipfsHash)
      chrome.tabs.update(tab.id, {url: "https://gateway.ipfs.io/ipfs/" + ipfsHash})
    })
  })
  return {cancel: true}
}, {urls: ["*://*.eth/"]})
