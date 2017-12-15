const resolver = require('./resolver.js')

// On *.eth entered into search bar
chrome.webRequest.onBeforeRequest.addListener((details) => {

  // Get subdomains, domain and top level domain (removing 'http://' and trailing '/')
  let name = details.url.substring(7, details.url.length - 1)

  // Get selected tab
  chrome.tabs.getSelected(null, (tab) => {

    // Update tab url temporarily with loading page (to prevent search redirect)
    chrome.tabs.update(tab.id, {url: "loading.html"})

    // Resolve name to IPFS hash
    resolver.resolve(name).then((ipfsHash) => {

      // Redirect to IPFS hash content on IPFS gateway
      console.log("IPFS hash for " + name + ": " + ipfsHash)

      // Check if local IPFS node is running
      let url = "http://localhost:8080/ipfs/" + ipfsHash
      return fetch(url, {method: "HEAD"})
      .then((response) => response.status)

      // If local node running, serve via local gateway
      .then((statusCode) => {
        if (statusCode === 200) {
          console.log("Serving content from local IPFS gateway")
          chrome.tabs.update(tab.id, {url: url})
        }
        return "Local"
      })

      // Else serve via public gatewat
      .catch((err) => {
        console.log("Could not find local IPFS gateway so serving content from public IPFS gateway instead")
        url = "https://gateway.ipfs.io/ipfs/" + ipfsHash
        chrome.tabs.update(tab.id, {url: url})
        return err
      })

    })

    .catch((err) => {
      var nameWithoutTld = name.substring(0, name.lastIndexOf('.'))
      chrome.tabs.update(tab.id, {url: "error.html?name=" + name})

    })

  })

  return {cancel: true}
}, {urls: ["*://*.eth/"]})
