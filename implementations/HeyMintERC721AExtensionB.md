# HeyMintERC721AExtensionB.sol

## presaleMint

### Vulnerability: attacker can mint presale
*Note: This is not an only Solidity vulnerability.*

At the beginning of the contract, a default presale signer address is set:

```solidity
    // Default HeyMint Launchpad presale signer address used to validate authorized presale mint addresses
    address private constant defaultPresaleSignerAddress =
        0xA85755fD92F91A1dD11Eba8A613121C6D2654BbE;
```

If this default signer is used for multiple instances (instanceA and instanceB), then with the actual code, presale signature will work on both instances A and B. Because signature only include `hash(address + number of tokens)`.

Maybe you wanted to do signature with the default key from the HeyMint web server ?

If so, an attacker could deploy his own HeyMint instance, then sign his attacker address with the amount of tokens he needs. Then, he will be able to presaleMint tokens on other contract instances.

To avoid this behavior, there are multiple solutions:
- add the contract address in the hash before signing, it the sign value would be: `hash(address + number of tokens)`
- use a different presale key for each instance

### Conclusion
This point is essential. This type of attack could impact all deployed instances.


### Multiple Gas optimization
See README Summary - On-chain read to get an explanation of the optimization.
#### Initial state
Without modifying Ben's code, the gas reporter is:

|  Contract                  |  Method                                    |  Min        |  Max        |  Avg          |  # calls      |
|----------------------------|--------------------------------------------|-------------|-------------|---------------|---------------|
|  HeyMintERC721AExtensionB  |  presaleMint                                |         -  |     -  |       127778  |           2  |

#### Final state
After gas optimization, the gas reporter is:

|  Contract                  |  Method                                    |  Min        |  Max        |  Avg          |  # calls      |
|----------------------------|--------------------------------------------|-------------|-------------|--------------|---------------|
|  HeyMintERC721AExtensionB        |  presaleMint                                |     -  |     -  |       126785  |           2  |


### Conclusion
Almost 1000 gas optimized per call. For 1000 users, this is 1_000_000 gas!

#### Optimized Code

```solidity
/**
     * @notice Allow for allowlist minting of tokens
     * @param _messageHash The hash of the message containing msg.sender & _maximumAllowedMints to verify
     * @param _signature The signature of the messageHash to verify
     * @param _numTokens The number of tokens to mint
     * @param _maximumAllowedMints The maximum number of tokens that can be minted by the caller
     */
    function presaleMint(
        bytes32 _messageHash,
        bytes calldata _signature,
        uint256 _numTokens,
        uint256 _maximumAllowedMints
    ) external payable nonReentrant {
        BaseConfig storage cfg = HeyMintStorage.state().cfg;
        require(cfg.presaleActive, "NOT_ACTIVE");
        require(presaleTimeIsActive(), "NOT_ACTIVE");
        // _presaleMintsAllowedPerAddress var is created, to avoid reading 2 times on-chain data
        uint8 _presaleMintsAllowedPerAddress = cfg.presaleMintsAllowedPerAddress;
        require(
            _presaleMintsAllowedPerAddress == 0 ||
                _numberMinted(msg.sender) + _numTokens <=
                _presaleMintsAllowedPerAddress,
            "MAX_MINTS_EXCEEDED"
        );
        // _presaleMintsAllowedPerTransaction var is created, to avoid reading 2 times on-chain data
        uint8 _presaleMintsAllowedPerTransaction = cfg.presaleMintsAllowedPerTransaction;
        require(
            _presaleMintsAllowedPerTransaction == 0 ||
                _numTokens <= _presaleMintsAllowedPerTransaction,
            "MAX_MINTS_EXCEEDED"
        );
        require(
            _numberMinted(msg.sender) + _numTokens <= _maximumAllowedMints,
            "MAX_MINTS_EXCEEDED"
        );
        // _presaleMaxSupply var is created, to avoid reading 2 times on-chain data
        uint16 _presaleMaxSupply = cfg.presaleMaxSupply;
        // futureTotalSupply var is created, to avoid reading 2 times on-chain data
        uint256 futureTotalSupply = totalSupply() + _numTokens;
        require(
            _presaleMaxSupply == 0 ||
                futureTotalSupply <= _presaleMaxSupply,
            "MAX_SUPPLY_EXCEEDED"
        );
        require(
            futureTotalSupply <= cfg.maxSupply,
            "MAX_SUPPLY_EXCEEDED"
        );
        uint256 presalePrice = presalePriceInWei();
        if (cfg.heyMintFeeActive) {
            uint256 heymintFee = _numTokens * heymintFeePerToken;
            require(
                msg.value == presalePrice * _numTokens + heymintFee,
                "INVALID_PRICE_PAID"
            );
            (bool success, ) = heymintPayoutAddress.call{value: heymintFee}("");
            require(success, "TRANSFER_FAILED");
        } else {
            require(
                msg.value == presalePrice * _numTokens,
                "INVALID_PRICE_PAID"
            );
        }
        require(
            keccak256(abi.encode(msg.sender, _maximumAllowedMints)) ==
                _messageHash,
            "MESSAGE_INVALID"
        );
        require(
            verifySignerAddress(_messageHash, _signature),
            "INVALID_SIGNATURE"
        );

        if (cfg.fundingDuration > 0) {
            uint256 firstTokenIdToMint = _nextTokenId();
            for (uint256 i = 0; i < _numTokens; i++) {
                HeyMintStorage.state().data.pricePaid[
                    firstTokenIdToMint + i
                ] = presalePrice;
            }
        }

        _safeMint(msg.sender, _numTokens);

        // Using _presaleMaxSupply local variable, as presaleMaxSupply has not been modified in function
        // Gas Optimization 1: As you already checked before that totalSupply() + numTokens <= maxSupply, now you can only check that is is ==
        // Gas Optimization 2: You already know this new totalSupply (= (old) totalSupply + _numTokens)
        if (futureTotalSupply == _presaleMaxSupply) {
            cfg.presaleActive = false;
        }
    }
```



