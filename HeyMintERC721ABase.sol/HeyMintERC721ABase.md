# Zigtur Audit

## publicMint(uint256 _numTokens) external payable nonReentrant

### Multiple Gas optimization

#### Initial state
Without modifying Ben's code, the gas reporter is:


|  Contract                  |  Method                                    |  Min        |  Max        |  Avg          |  # calls      |  usd (avg)  │
|----------------------------|--------------------------------------------|-------------|-------------|---------------|---------------|-------------|
|  HeyMintERC721ABase        |  publicMint                                |     118131  |     164976  |       137055  |           19  |  None       │



#### Final state
After gas optimization, the gas reporter is:

|  Contract                  |  Method                                    |  Min        |  Max        |  Avg          |  # calls      |  usd (avg)  │
|----------------------------|--------------------------------------------|-------------|-------------|---------------|---------------|-------------|
|  HeyMintERC721ABase        |  publicMint                                |     117684  |     164529  |       136608  |           19  |  None       │

#### Conclusion
Saved gas is not significant enough (~400 gas in average), but some gas seems to have been saved without breaking the code.


#### Gas-Optimized code
```

/**
     * @notice Allow for public minting of tokens
     * @param _numTokens The number of tokens to mint
     */
    function publicMint(uint256 _numTokens) external payable nonReentrant {
        BaseConfig storage cfg = HeyMintStorage.state().cfg;
        require(cfg.publicSaleActive, "NOT_ACTIVE");
        require(publicSaleTimeIsActive(), "NOT_ACTIVE");
        require(
            cfg.publicMintsAllowedPerAddress == 0 ||
                _numberMinted(msg.sender) + _numTokens <=
                cfg.publicMintsAllowedPerAddress,
            "MAX_MINTS_EXCEEDED"
        );
        // Gas Optimization: you can read cfg.publicMintsAllowedPerTransaction only once
        uint256 allowedPerTransaction = cfg.publicMintsAllowedPerTransaction;
        require(
            allowedPerTransaction == 0 ||
                _numTokens <= allowedPerTransaction,
            "MAX_MINTS_EXCEEDED"
        );
        //maxSupply is set to local variable, because it is used at the end of the function
        uint256 _maxSupply = cfg.maxSupply;
        // futureSupply var is created, to avoid reading 2 times on-chain data
        uint256 futureSupply = totalSupply() + _numTokens;
        require(
            futureSupply <= _maxSupply,
            "MAX_SUPPLY_EXCEEDED"
        );
        uint256 publicPrice = publicPriceInWei();
        if (cfg.heyMintFeeActive) {
            uint256 heymintFee = _numTokens * heymintFeePerToken;
            require(
                msg.value == publicPrice * _numTokens + heymintFee,
                "INVALID_PRICE_PAID"
            );
            (bool success, ) = heymintPayoutAddress.call{value: heymintFee}("");
            require(success, "TRANSFER_FAILED");
        } else {
            require(
                msg.value == publicPrice * _numTokens,
                "INVALID_PRICE_PAID"
            );
        }

        if (cfg.fundingDuration > 0) {
            uint256 firstTokenIdToMint = _nextTokenId();
            for (uint256 i = 0; i < _numTokens; i++) {
                HeyMintStorage.state().data.pricePaid[
                    firstTokenIdToMint + i
                ] = publicPrice;
            }
        }

        _safeMint(msg.sender, _numTokens);

        // Using _maxSupply local variable, as maxSupply has not been modified in function
        // Gas Optimization 1: As you already checked before that totalSupply() + numTokens <= maxSupply, now you can only check that is is ==
        // Gas Optimization 2: You already know this new totalSupply (= (old) totalSupply + _numTokens)
        if (futureSupply == _maxSupply) {
            cfg.publicSaleActive = false;
        }
    }
```

