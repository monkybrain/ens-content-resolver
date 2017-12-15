# ENS Content Resolver

Chrome extension that resolves ENS domains (.eth) to IPFS hashes and redirects your browser to content.

Install it via [Chrome Web Store](https://chrome.google.com/webstore/detail/ens-content-resolver/ifgfopmoihnnicfgcpafgibiinfkodjf) or build it from source by selecting `dist` as package root folder.

First tries to serve the content through your local IPFS gateway (`localhost:8080`). If you don't have a node running it will use the public gateway (`gateway.ipfs.io`) instead.

Try it out by entering e.g. [monkybrain.eth](http://monkybrain.eth) in your browser's address bar.

Currently only supports [Infura](https://infura.io) for connecting to the Ethereum network. Support for local Ethereum nodes will arrive soon, as will support for [Swarm](https://ethersphere.github.io/swarm-home/).

[![Video demo](https://img.youtube.com/vi/9YbWr4ouiPw/0.jpg)](https://www.youtube.com/watch?v=9YbWr4ouiPw)
