# Introduction


# Disclaimer


# About Zigtur

Zigtur is a cybersecurity professional. Graduated from a cyberdefense engineering school, he now focuses its efforts on smart contract auditing.

Twitter: [@zigtur](https://twitter.com/zigtur)
Discord: [@zigtur](https://discordapp.com/users/909209529558921276)


# About HeyMint
**HeyMint project:** https://heymint.xyz/

"HeyMint is thrilled to create amazing no-code tools that help NFT creators & collectors do what they love. 100% free because we ♡ you."

HeyMint is a project that aims to allow every creators to easily deploy their own tokens collection (NFT and normal tokens). Some advanced features like presale, royalties, loans will be included. A user will just have to set the config, by using a web interface.

HeyMint will soon launch an ERC1155 platform to easily deploy ERC1155 contracts.


# Threat Model & Methodology
## Actors
There are 4 types of actors:
- HeyMint: Deployer of all the extensions (A to G), the Reference contract and the AddressRelay contract. This actor also has control on some settings on all the `HeyMintERC1155Child`.
- Creator: Deployer of an `HeyMintERC1155Child`, this actor can control almost all the settings of this child. It can also be named "Owner".
- Presale user: User of a child, he has a presale ticket.
- Normal user: User of a child.

## Vulnerability classification
Only the impact will be studied in this audit.

| Impact level            |  Explanation                                                                       | Example                 |
|-------------------------|------------------------------------------------------------------------------------|-------------------------|
| Critical                | This vulnerability would have a tremendous impact on HeyMint and all the creators. | All funds are getting stolen from all childs |
| High                    | A lot of end-users are impacted by the vulnerability or multiple child contracts   | Malicious creator steals all funds by malicious behavior |
| Medium                  | Only a few end-users are impacted by the vulnerability.                            | A user can't mint its presale tokens |
| Low                     | This has no impact on project, but would better be fixed before deployment         | Gas optimizations, not mandatory checks, ... |

## Solutions
Solutions can be given in the following audit. Some of them can be done easily, and so a fixed code will be given.

When the fix is too heavy, no code proposal will be given. However, ways to solve the issue will be detailed to help HeyMint team fixing the issue.

# Findings

## Presale tickets can be reused on other childs, if owner uses same signer address

**Vulnerability classification: High**

A user with one presale on a creator contract could be able to mint on every other creator contracts.

### Explanations

*MISSING CONTENT*

### Vulnerable code

*MISSING CONTENT*

### Vulnerability test

*MISSING CONTENT*

### Solution

*MISSING CONTENT*

#### First solution

*MISSING CONTENT*

#### Second solution

*MISSING CONTENT*

## Presale users can lose presale mints because of other users
*Note: This vulnerability holds if presale minting period overlaps with normal minting period. As no checks are done in public mint functions to verify overlapping, this is considered as valid.*

**Vulnerability classification: High**

All the presale users could be impacted by this vulnerability.

### Explanations

During a presale mint, a require statement is used to check that, once tokens will be minted, the total supply will not be greater than the presale max supply.

A public mint will increase the total supply. As public mint and presale mint periods can overlap each other, the total supply can reach the presale max supply by using only public mints. So, presale max supply can be reached without a single presale mint.

Then, presale users will not be able to use their presale mints because of the require statement.

### Vulnerable code
- File: `HeyMintERC1155ExtensionC.sol`
- Function: `presaleMint`
- Lines: `187-192`
- Explanations: `state.data.totalSupply[_tokenId] + _numTokens` is checked against `tokenConfig.presaleMaxSupply`. But not all mints in `totalSupply` were presale mints, there could be public mints in it.
- Vulnerable code:
```solidity
        require(
            tokenConfig.presaleMaxSupply == 0 ||
                state.data.totalSupply[_tokenId] + _numTokens <=
                tokenConfig.presaleMaxSupply,
            "MAX_SUPPLY_EXCEEDED"
        );
```

### Vulnerability test
Multiple unit tests for this vulnerability can be found in `ZigturAudit.js`, under the names:
- `Presale users can lose presale mints because of other users - mintToken case`
- `Presale users can lose presale mints because of other users - giftTokens case`

### Solution
#### First solution
One way to solve the problem is to:
- Add a `presaleTotalSupply` field, to keep track of how many tokens were minted using presales
- Add a `presaleTokensMintedByAddress` field, to keep track of how many presale tokens were minted by user
- Modify checks in `presaleMint()` to verify that the new `presaleTotalSupply` is not greater than `presaleMaxSupply`
- Increment `tokensMintedByAddress` AND `presaleTokensMintedByAddress` when presale minting

#### Second solution
Another way to fix the issue is by not overlapping presale mint and public mint periods.

It is worth saying that this solution **is not** the most user-friendly one.




## Presale users can lose presale mints, if they use normal mint
*Note: This vulnerability holds if presale minting period overlaps with normal minting period. As no checks are done in mintToken() to verify overlapping, this is considered as valid.*

**Vulnerability classification: Medium**

All the presale users could be impacted by this vulnerability. But, it is a "self attack".

### Explanations
During a presale mint, two require statements are used. The first one checks that, once tokens will be minted, the number of tokens minted by address will not be greater than the number of presale mints allowed per address. The second one checks that, once tokens will be minted, the number of tokens minted by address will not be greater than the number of presale mints allowed to the sender user.

A public mint will increase the number of tokens minted by the user. As public mint and presale mint periods can overlap each other, the number of tokens minted by the user can reach both number of presale allowed to this user and allowed per address by using only public mints. So, the number of presale mints allowed to user can be reached without using presale mint.

Then, presale user will not be able to use its presale mints because of the require statement.

### Vulnerable code
- File: `HeyMintERC1155ExtensionC.sol`
- Function: `presaleMint`
- Lines: `167-180`
- Explanations: `tokensMintedByAddress[msg.sender][_tokenId]` is checked against `presaleMintsAllowedPerAddress`, but it doesn't count only presale mints. Same for `_maximumAllowedMints`.
- Vulnerable code:
```solidity
        require(
            tokenConfig.presaleMintsAllowedPerAddress == 0 ||
                state.data.tokensMintedByAddress[msg.sender][_tokenId] +
                    _numTokens <=
                tokenConfig.presaleMintsAllowedPerAddress,
            "MAX_MINTS_PER_ADDRESS_EXCEEDED"
        );
        require(
            _maximumAllowedMints == 0 ||
                state.data.tokensMintedByAddress[msg.sender][_tokenId] +
                    _numTokens <=
                _maximumAllowedMints,
            "MAX_MINTS_EXCEEDED"
        );
```

### Vulnerability test
Multiple unit tests for this vulnerability can be found in `ZigturAudit.js`, under the names:
- `Presale users can lose their presale mint, if they use normal mint - mintToken and MAX_MINTS_PER_ADDRESS_EXCEEDED case`
- `Presale users can lose their presale mint, if they use normal mint - mintToken and MAX_MINTS_EXCEEDED case`
- `Presale users can lose their presale mint, if they use normal mint - freeClaim and MAX_MINTS_PER_ADDRESS_EXCEEDED case`

*Note: only `mintToken` and `freeClaim` have been tested for public minting, but `burnToMint` should work too.*


### Solution
One way to fix it:
- Add a presaleTotalSupply field
- Modify checks in presaleMint()
- Increment tokensMintedByAddress AND presaleTokensMintedByAddress when presale Minting

#### First solution
*Note: this solution is pretty similar to the first solution of [Presale users can lose presale mints because of other users](#first-solution).*
One way to solve the problem is to:
- Add a `presaleTokensMintedByAddress` field, to keep track of how many presale tokens were minted by user
- Modify checks in `presaleMint()` to verify that the new `presaleTokensMintedByAddress` is not greater than `_maximumAllowedMints` and `presaleMintsAllowedPerAddress`
- Increment `tokensMintedByAddress` AND `presaleTokensMintedByAddress` when presale minting

#### Second solution
Another way to fix the issue is by not overlapping presale mint and public mint periods.

It is worth saying that this solution **is not** the most user-friendly one.


## User can max out tokenPublicMintsAllowedPerAddress by using creditCardMint

**Vulnerability classification: Medium**

### Explanations
In the `creditCardMint` function, a check is done to verify that the address to which tokens will be minted is less or equal than tokensMintedByAddress.

The problem is that when tokens are minted in this function, it is the creditCardAddress's tokensMintedByAddress field that is increased (i.e. the `msg.sender` here), and not the user's tokensMintedByAddress field (i.e. the `_to` address in this function).

So, user can mint more than the tokensMintedByAddress limit using creditCard by buying multiple times (multiple transactions).

### Vulnerable code
- File: `HeyMintERC1155ExtensionE.sol`
- Function: `creditCardMint`
- Lines: `160`
- Explanations: `state.data.tokensMintedByAddress[msg.sender][_tokenId]` is increased. But `msg.sender` isn't really the minter. The minter should be `_to`.
- Vulnerable code:
```solidity
        require(
            state.tokens[_tokenId].publicMintsAllowedPerAddress == 0 ||
                state.data.tokensMintedByAddress[_to][_tokenId] + _numTokens <=
                state.tokens[_tokenId].publicMintsAllowedPerAddress,
            "MAX_MINTS_EXCEEDED"
        );

        // ...

        state.data.totalSupply[_tokenId] += _numTokens;
        // Line 160 below
        state.data.tokensMintedByAddress[msg.sender][_tokenId] += _numTokens;
        _mint(_to, _tokenId, _numTokens, "");
```

### Vulnerability test
The unit test for this vulnerability can be found in `ZigturAudit.js`, under the name `User can max out tokenPublicMintsAllowedPerAddress by using creditCardMint`.

### Solution
- Explanations: Modify line `160` to increase mint balance of the `_to` address instead of the mint balance of the `msg.sender`.
- Fixed code:
```solidity
        require(
            state.tokens[_tokenId].publicMintsAllowedPerAddress == 0 ||
                state.data.tokensMintedByAddress[_to][_tokenId] + _numTokens <=
                state.tokens[_tokenId].publicMintsAllowedPerAddress,
            "MAX_MINTS_EXCEEDED"
        );

        // ...

        state.data.totalSupply[_tokenId] += _numTokens;
        // line 160 fixed
        state.data.tokensMintedByAddress[_to][_tokenId] += _numTokens;
        _mint(_to, _tokenId, _numTokens, "");
```





