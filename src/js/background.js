const resolver = require('./resolver.js')

// On *.eth entered into search bar
chrome.webRequest.onBeforeRequest.addListener((details) => {

  // Get subdomains, domain and top level domain (removing 'http://' and trailing '/')
  let name = details.url.substring(7, details.url.length - 1)

  // Get selected tab
  chrome.tabs.getSelected(null, (tab) => {

    // Update tab url temporarily with IPFS Gateway base url (to prevent search redirect)
    chrome.tabs.update(tab.id, {url: "dist/loading.html"})

    // Resolve name to IPFS hash
    resolver.resolve(name).then((ipfsHash) => {

      // Redirect to IPFS hash content on IPFS gateway
      console.log("IPFS hash for " + name + ": " + ipfsHash)
      chrome.tabs.update(tab.id, {url: "https://gateway.ipfs.io/ipfs/" + ipfsHash})
    })
    .catch((err) => {
      var nameWithoutTld = name.substring(0, name.lastIndexOf('.'))
      chrome.tabs.update(tab.id, {url: "dist/error.html?name=" + name})

    })

  })

  return {cancel: true}
}, {urls: ["*://*.eth/"]})
