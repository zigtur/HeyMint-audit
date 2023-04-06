# HeyMint Audit - Zigtur

## HeyMint
HeyMint project: https://heymint.xyz/

"HeyMint is thrilled to create amazing no-code tools that help NFT creators & collectors do what they love. 100% free because we ♡ you."

HeyMint is a project that aims to allow every creators to easily deploy their own NFT collection. Some advanced features like presale, royalties, loans will be included. A user will just have to set the config, by using a web interface.

## Audit Summary
### Storage layout issue
As you used delegatecall from the HeyMintERC721AChild, you should be **absolutely sure** that the contracts that will be delegatecalled use the **SAME STORAGE LAYOUT**.

That was not the case for the HeyMintERC721ABase `initialize` function. Explanation is given in `HeyMintERC721AChild.md` file.

### ECDSA Presale default public key issue
If the default public key is used for presale mint, then an attacker will be able to get presale mints in all deployed contracts.

Explanation is given in `HeyMintERC721AExtensionB.md` file.


### startTime and endTime
startTime and endTime are not properly handled. A check that startTime < endTime should be made, to avoid a DoS.

Explanation is given in `HeyMintERC721ABase.md` file.

### Gas optimization
Multiple gas optimization have been made. Here are the main gas optimization made:

#### On-chain read
If in a function, you read multiple times the same on-chain value but you do not modify it during your code manipulation, you can read it only once. To do it, use a local memory variable.

This can be explained by the fact that reading on-chain is expensive, more expensive that creating and reading a memory variable: 
- SLOAD: This opcode loads a word from storage, it reads on-chain data
  - opcode gas cost: 100
- PUSH: This opcode place a value item on stack (memory variable)
  - opcode gas cost: 3
- MLOAD: This opcode load a word from memory
  - opcode gas cost: 3

So we can see that SLOAD is really more expensive that PUSH + MLOAD. Reading on-chain data and then using local memory manipulation (PUSH+MLOAD) is gas-efficient, and should be used instead of reading multiple time the same on-chain value (SLOAD).

Here are some functions that were optimized with this point:
- HeyMintERC721ABase: `publicMint` function
- HeyMintERC721AExtensionB: `presaleMint` function
- HeyMintERC721AExtensionC: `crossmint` function
